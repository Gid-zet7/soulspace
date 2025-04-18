"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface MoodEntry {
  mood: number;
  notes: string;
}

export default function MoodTracker() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mood, setMood] = useState<number>(5);
  const [notes, setNotes] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood,
          notes,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save mood entry");
      }

      // Reset form and refresh dashboard
      setMood(5);
      setNotes("");
      router.refresh();
    } catch (error) {
      console.error("Error saving mood entry:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        How are you feeling today?
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <label className="block text-lg font-medium text-gray-700">
            Mood Rating
          </label>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Very Unhappy</span>
            <div className="flex-1 mx-4">
              <input
                type="range"
                min="1"
                max="10"
                value={mood}
                onChange={(e) => setMood(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <span className="text-sm text-gray-500">Very Happy</span>
          </div>
          <div className="text-center text-2xl font-bold text-indigo-600">
            {mood}
          </div>
        </div>

        <div className="space-y-4">
          <label className="block text-lg font-medium text-gray-700">
            Notes (Optional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add any notes about how you're feeling..."
            className="w-full h-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save Mood Entry"}
        </button>
      </form>
    </div>
  );
}
