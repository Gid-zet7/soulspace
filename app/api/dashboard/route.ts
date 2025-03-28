import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Chat from "@/models/Chat";

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get user data
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get user's chats
    const chats = await Chat.find({ userId: user._id });

    // Calculate session stats
    const sessionStats = {
      total: chats.length,
      completed: chats.filter((chat) => chat.currentStep === 4).length,
      inProgress: chats.filter((chat) => chat.currentStep < 4).length,
    };

    // Process mood trends
    const moodTrends = user.moodEntries
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 14) // Last 14 days
      .map((entry) => ({
        date: new Date(entry.date).toLocaleDateString(),
        mood: entry.mood,
      }))
      .reverse();

    // Analyze chat messages for triggers
    const triggerWords = new Map();
    chats.forEach((chat) => {
      chat.messages
        .filter((msg) => msg.role === "assistant" && chat.currentStep === 2)
        .forEach((msg) => {
          // Extract triggers from bullet points
          const lines = msg.content.split("\n");
          lines.forEach((line) => {
            if (line.trim().startsWith("•")) {
              // Remove bullet point and get the trigger text
              const trigger = line.replace("•", "").trim();
              // Remove any context after colon if present
              const cleanTrigger = trigger.split(":")[0].trim();
              if (cleanTrigger.length > 3) {
                // Avoid short words
                triggerWords.set(
                  cleanTrigger,
                  (triggerWords.get(cleanTrigger) || 0) + 1
                );
              }
            }
          });
        });
    });

    // Get top triggers
    const topTriggers = Array.from(triggerWords.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));

    // Analyze coping strategies effectiveness
    const strategies = new Map();
    chats.forEach((chat) => {
      const strategyMessages = chat.messages.filter(
        (msg) => msg.role === "assistant" && chat.currentStep === 3 // Coping strategies step
      );

      strategyMessages.forEach((msg) => {
        // Extract strategy suggestions and their context
        const content = msg.content.toLowerCase();
        const commonStrategies = [
          "breathing",
          "meditation",
          "exercise",
          "journaling",
          "talking",
          "music",
          "nature",
          "reading",
        ];

        commonStrategies.forEach((strategy) => {
          if (content.includes(strategy)) {
            // Calculate effectiveness based on subsequent mood entries
            const timestamp = new Date(msg.timestamp);
            const nextMood = user.moodEntries.find(
              (entry) => new Date(entry.date) > timestamp
            );
            if (nextMood) {
              const currentEffectiveness = strategies.get(strategy) || {
                total: 0,
                count: 0,
              };
              strategies.set(strategy, {
                total: currentEffectiveness.total + nextMood.mood,
                count: currentEffectiveness.count + 1,
              });
            }
          }
        });
      });
    });

    // Calculate average effectiveness for each strategy
    const copingStrategies = Array.from(strategies.entries())
      .map(([name, data]) => ({
        name,
        effectiveness: data.total / data.count,
      }))
      .sort((a, b) => b.effectiveness - a.effectiveness);

    return NextResponse.json({
      sessionStats,
      moodTrends,
      topTriggers,
      copingStrategies,
    });
  } catch (error) {
    console.error("Dashboard error:", error);
    return NextResponse.json(
      { message: "Error fetching dashboard data" },
      { status: 500 }
    );
  }
}
