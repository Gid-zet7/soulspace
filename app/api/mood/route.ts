import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(request: Request) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { mood, notes } = await request.json();

    // Get user
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Add new mood entry
    user.moodEntries.push({
      date: new Date(),
      mood,
      notes,
    });

    await user.save();

    return NextResponse.json({ message: "Mood entry saved successfully" });
  } catch (error) {
    console.error("Error saving mood entry:", error);
    return NextResponse.json(
      { message: "Error saving mood entry" },
      { status: 500 }
    );
  }
}
