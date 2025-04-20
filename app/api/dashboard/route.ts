import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import Chat from "@/models/Chat";

interface MoodEntry {
  date: Date;
  mood: number;
}

interface ChatMessage {
  role: string;
  content: string;
  currentStep: number;
  timestamp: Date;
}

interface ChatDocument {
  _id: string;
  messages: ChatMessage[];
  currentStep: number;
}

function extractTriggerWords(chat: ChatDocument) {
  // console.log(chat);
  const triggerWords = new Map();

  chat.messages
    .filter((msg) => msg.role === "assistant" && msg.currentStep === 2)
    .forEach((msg) => {
      const lines = msg.content.split("\n");
      lines.forEach((line: string) => {
        if (line.trim().startsWith("•")) {
          const trigger = line.replace("•", "").trim();
          const cleanTrigger = trigger.split(":")[0].trim();
          if (cleanTrigger.length > 3) {
            triggerWords.set(
              cleanTrigger,
              (triggerWords.get(cleanTrigger) || 0) + 1
            );
          }
        }
      });
    });

  return Array.from(triggerWords.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

function extractCopingStrategies(chat: ChatDocument) {
  const strategies = new Map<string, { count: number; definition: string }>();

  chat.messages
    .filter(
      (msg: ChatMessage) => msg.role === "assistant" && msg.currentStep === 3
    )
    .forEach((msg: ChatMessage) => {
      const lines = msg.content.split("\n");
      let currentTrigger = "";

      lines.forEach((line: string) => {
        console.log(line);
        // Check for trigger headers (e.g., "1. Fear of Judgment:")
        const triggerMatch = line.match(/^\d+\.\s+\*\*([^:]+):/);
        console.log(triggerMatch);
        if (triggerMatch) {
          currentTrigger = triggerMatch[1].trim();
        }

        // Check for strategy points (e.g., "- **Reframe Your Thoughts:**")
        const strategyMatch = line.match(/^\s*-\s+\*\*([^:]+):\*\*\s*([^[]+)/);
        if (strategyMatch && currentTrigger) {
          const strategyName = strategyMatch[1].trim();
          const definition = strategyMatch[2].trim();
          const fullName = `${currentTrigger} - ${strategyName}`;

          const existing = strategies.get(fullName);
          if (existing) {
            strategies.set(fullName, {
              count: existing.count + 1,
              definition: existing.definition,
            });
          } else {
            strategies.set(fullName, {
              count: 1,
              definition,
            });
          }
        }
      });
    });

  return Array.from(strategies.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .map(([name, data]) => ({
      name,
      count: data.count,
      definition: data.definition,
    }));
}

export async function GET() {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get all chats for the user
    const chats = await Chat.find({ userId: user._id }).sort({ createdAt: -1 });

    // Process mood entries
    const moodTrends = user.moodEntries
      .sort((a: MoodEntry, b: MoodEntry) => a.date.getTime() - b.date.getTime())
      .map((entry: MoodEntry) => ({
        date: entry.date.toISOString().split("T")[0],
        mood: entry.mood,
      }));

    // Process chat data for triggers and coping strategies
    const chatSessions = chats.map((chat) => {
      const triggers = extractTriggerWords(chat);
      const copingStrategies = extractCopingStrategies(chat);

      return {
        id: chat._id,
        title:
          chat.title ||
          `Session ${new Date(chat.createdAt).toLocaleDateString()}`,
        summary: chat.summary,
        currentStep: chat.currentStep,
        triggers,
        copingStrategies,
        createdAt: chat.createdAt,
      };
    });

    // Calculate session stats
    const sessionStats = {
      total: chats.length,
      completed: chats.filter((chat) => chat.currentStep === 4).length,
      inProgress: chats.filter((chat) => chat.currentStep < 4).length,
    };

    // Get aggregated coping strategies across all sessions
    const allCopingStrategies = chats.flatMap(extractCopingStrategies);
    // console.log(allCopingStrategies);
    const aggregatedStrategies = new Map<
      string,
      { count: number; definition: string }
    >();

    allCopingStrategies.forEach((strategy) => {
      const existing = aggregatedStrategies.get(strategy.name);
      if (existing) {
        aggregatedStrategies.set(strategy.name, {
          count: existing.count + strategy.count,
          definition: strategy.definition,
        });
      } else {
        aggregatedStrategies.set(strategy.name, {
          count: strategy.count,
          definition: strategy.definition,
        });
      }
    });

    const copingStrategies = Array.from(aggregatedStrategies.entries())
      .sort((a, b) => b[1].count - a[1].count)
      .map(([name, data]) => ({
        name,
        count: data.count,
        definition: data.definition,
      }));

    return NextResponse.json({
      moodTrends,
      sessionStats,
      chatSessions,
      copingStrategies,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { message: "Error fetching dashboard data" },
      { status: 500 }
    );
  }
}
