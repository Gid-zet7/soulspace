import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Chat from "@/models/Chat";
import mongoose from "mongoose";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const STEP_PROMPTS = {
  1: `You are a supportive AI therapist helping users identify their feelings. 
     Ask gentle, open-ended questions to help them express their emotions.
     Focus on understanding the intensity and nature of their feelings.
     Once you have a clear understanding of their emotional state, indicate step complete.`,

  2: `You are a supportive AI therapist helping users explore what triggered their feelings.
     Ask gentle questions about recent events, thoughts, or situations that might have led to these feelings.
     When you understand their triggers, summarize them in clear bullet points, like this:
     Identified triggers:
     • [First trigger with brief context]
     • [Second trigger with brief context]
     • [Third trigger with brief context]
     After listing the triggers, indicate step complete.`,

  3: `You are a supportive AI therapist helping users develop coping strategies.
     Based on their identified feelings and triggers, suggest healthy coping mechanisms.
     Focus on practical, actionable strategies they can implement.
     Once you've provided appropriate coping strategies, indicate step complete.`,

  4: `You are a supportive AI therapist helping users create an action plan.
     Help them set specific, achieveable goals for managing their feelings.
     Create a structured plan with clear next steps.
     Once you've helped them create a concrete action plan, indicate step complete.`,
};

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get user ID
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const { messages, currentStep, chatId } = await request.json();
    // console.log();

    // Get or create chat session
    let chat;
    if (chatId) {
      chat = await Chat.findById(chatId);
      if (!chat || chat.userId.toString() !== user._id.toString()) {
        return NextResponse.json(
          { message: "Chat not found" },
          { status: 404 }
        );
      }
    } else {
      chat = new Chat({
        userId: user._id,
        currentStep: 1,
        title: "New Therapy Session",
        messages: [],
      });
    }

    // Get the conversation history for context
    const conversationHistory = messages.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add the system prompt for the current step
    const systemPrompt = STEP_PROMPTS[currentStep as keyof typeof STEP_PROMPTS];

    // Create the chat completion
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        ...conversationHistory,
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    // Check if the response indicates step completion
    const stepComplete =
      response?.toLowerCase().includes("step complete") ||
      response?.toLowerCase().includes("moving to next step");

    console.log(stepComplete);

    // Update chat with new messages
    chat.messages.push(
      {
        role: "user",
        content: messages[messages.length - 1].content,
        timestamp: new Date(),
      },
      {
        role: "assistant",
        content: response,
        timestamp: new Date(),
      }
    );

    // Update step if completed
    if (stepComplete) {
      chat.currentStep = Math.min(chat.currentStep + 1, 4);
    }

    // Generate or update chat summary
    const summaryCompletion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content:
            "Summarize the main points of this therapy session in one brief sentence.",
        },
        ...chat.messages.map((msg: any) => ({
          role: msg.role,
          content: msg.content,
        })),
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    chat.summary = summaryCompletion.choices[0].message.content || "";

    // Save the updated chat
    await chat.save();

    return NextResponse.json({
      content: response,
      stepComplete,
      chatId: chat._id,
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json(
      { message: "Error processing chat request" },
      { status: 500 }
    );
  }
}
