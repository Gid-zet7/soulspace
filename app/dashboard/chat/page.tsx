"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";

interface Message {
  role: "user" | "assistant";
  content: string;
  currentStep?: number;
  step?: number;
  timestamp: Date;
}

interface Step {
  number: number;
  title: string;
  description: string;
  completed: boolean;
  examplePrompt: string;
}

const INITIAL_STEPS: Step[] = [
  {
    number: 1,
    title: "Identify Your Feelings",
    description: "Let's start by understanding how you're feeling right now.",
    completed: false,
    examplePrompt:
      "I'm feeling overwhelmed and anxious about my upcoming presentation at work.",
  },
  {
    number: 2,
    title: "Explore Triggers",
    description: "What might have led to these feelings?",
    completed: false,
    examplePrompt:
      "I think it started when my manager mentioned the presentation deadline was moved up.",
  },
  {
    number: 3,
    title: "Consider Coping Strategies",
    description: "Let's explore some helpful ways to manage these feelings.",
    completed: false,
    examplePrompt:
      "I usually take deep breaths, but I'm not sure if that's enough for this situation.",
  },
  {
    number: 4,
    title: "Create an Action Plan",
    description: "What steps can you take to feel better?",
    completed: false,
    examplePrompt:
      "I could break down the presentation into smaller tasks and practice each section.",
  },
];

export default function Chat() {
  const { data: session } = useSession();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [chatId, setChatId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [steps, setSteps] = useState<Step[]>(INITIAL_STEPS);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [exampleText, setExampleText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      const currentExample = steps[currentStep - 1]?.examplePrompt;
      if (!currentExample) return;

      setIsTyping(true);
      setExampleText(currentExample[0]);

      let i = 1;
      const typingInterval = setInterval(() => {
        if (i < currentExample.length) {
          setExampleText((prev) => prev + currentExample[i]);
          i++;
        } else {
          setIsTyping(false);
          clearInterval(typingInterval);
        }
      }, 30);
      return () => clearInterval(typingInterval);
    } else {
      setExampleText("");
      setIsTyping(false);
    }
  }, [currentStep, messages.length, steps]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input,
      currentStep: currentStep,
      step: currentStep,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          currentStep,
          chatId,
        }),
      });

      const data = await response.json();

      console.log(data);

      const assistantMessage: Message = {
        role: "assistant",
        content: data.content,
        currentStep: currentStep,
        step: currentStep,
        timestamp: new Date(),
      };

      setChatId(data.chatId || null);
      setMessages((prev) => [...prev, assistantMessage]);

      // Update step completion if the AI indicates the step is complete
      if (data.stepComplete) {
        setSteps((prev) =>
          prev.map((step) =>
            step.number === currentStep ? { ...step, completed: true } : step
          )
        );
        setCurrentStep((prev) => Math.min(prev + 1, steps.length));
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I apologize, but I encountered an error. Please try again.",
          currentStep: currentStep,
          step: currentStep,
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Steps Progress */}
      <div className="bg-white shadow-sm p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.number}
                className={`flex flex-col items-center ${
                  step.number === currentStep
                    ? "text-indigo-600"
                    : step.completed
                    ? "text-green-600"
                    : "text-gray-400"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step.number === currentStep
                      ? "border-indigo-600 bg-indigo-50"
                      : step.completed
                      ? "border-green-600 bg-green-50"
                      : "border-gray-300"
                  }`}
                >
                  {step.completed ? "✓" : step.number}
                </div>
                <span className="text-xs mt-1">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-4xl mx-auto space-y-4">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {steps[currentStep - 1].title}
              </h3>
              <p className="text-gray-600 mb-4">
                {steps[currentStep - 1].description}
              </p>
              <div className="mt-4 p-4 bg-indigo-50 rounded-lg">
                <p className="text-gray-700">
                  Example: {exampleText?.split("undefined")[0] || exampleText}
                  {isTyping && <span className="animate-pulse">|</span>}
                </p>
              </div>
            </div>
          )}
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-100 text-gray-900"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                <p className="text-xs mt-1 opacity-70">
                  {new Date(message.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white border-t p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                messages.length === 0
                  ? `Type your response about ${steps[
                      currentStep - 1
                    ].title.toLowerCase()}...`
                  : "Type your message..."
              }
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
