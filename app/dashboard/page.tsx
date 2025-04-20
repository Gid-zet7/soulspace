"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface ChatSession {
  id: string;
  title: string;
  summary: string;
  currentStep: number;
  triggers: { name: string; count: number }[];
  copingStrategies: { name: string; count: number; definition: string }[];
  createdAt: string;
}

interface CopingStrategy {
  name: string;
  count: number;
  definition: string;
}

interface DashboardData {
  moodTrends: {
    date: string;
    mood: number;
  }[];
  sessionStats: {
    total: number;
    completed: number;
    inProgress: number;
  };
  chatSessions: ChatSession[];
  copingStrategies: CopingStrategy[];
}

const COLORS = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"];

export default function Dashboard() {
  const { data: session } = useSession();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch("/api/dashboard");
        const data = await response.json();
        console.log(data);
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchDashboardData();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-[#0A0A0A]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-center py-8">
        <h2 className="text-2xl font-semibold text-white">
          Welcome to Your Therapy Dashboard
        </h2>
        <p className="mt-2 text-gray-400">
          Start your therapy journey to see your progress and insights.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">
          Your Therapy Progress
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-[#1A0505]/40 backdrop-blur-lg rounded-2xl border border-red-900/20 p-6 transform hover:scale-105 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Total Sessions
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {dashboardData.sessionStats.total}
            </p>
          </div>
          <div className="bg-[#1A0505]/40 backdrop-blur-lg rounded-2xl border border-red-900/20 p-6 transform hover:scale-105 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Completed Steps
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {dashboardData.sessionStats.completed}
            </p>
          </div>
          <div className="bg-[#1A0505]/40 backdrop-blur-lg rounded-2xl border border-red-900/20 p-6 transform hover:scale-105 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              In Progress
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {dashboardData.sessionStats.inProgress}
            </p>
          </div>
          <div className="bg-[#1A0505]/40 backdrop-blur-lg rounded-2xl border border-red-900/20 p-6 transform hover:scale-105 transition-all duration-300">
            <h3 className="text-lg font-semibold text-gray-300 mb-2">
              Average Mood
            </h3>
            <p className="text-3xl font-bold text-red-600">
              {dashboardData.moodTrends.length > 0
                ? (
                    dashboardData.moodTrends.reduce(
                      (acc, curr) => acc + curr.mood,
                      0
                    ) / dashboardData.moodTrends.length
                  ).toFixed(1)
                : "N/A"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-[#1A0505]/40 backdrop-blur-lg rounded-2xl border border-red-900/20 p-6 transform hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-4">
              Mood Trends
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.moodTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis domain={[0, 10]} stroke="#666" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1A0505",
                      border: "1px solid rgba(220, 38, 38, 0.2)",
                      borderRadius: "0.5rem",
                    }}
                    labelStyle={{ color: "#fff" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="mood"
                    stroke="#DC2626"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#1A0505]/40 backdrop-blur-lg rounded-2xl border border-red-900/20 p-6 transform hover:scale-105 transition-all duration-300">
            <h3 className="text-xl font-semibold text-white mb-4">
              Coping Strategies
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dashboardData.copingStrategies}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const strategy = payload[0].payload;
                        return (
                          <div className="bg-[#1A0505]/90 backdrop-blur-lg p-4 border border-red-900/20 rounded-lg shadow-lg">
                            <p className="font-semibold text-white">
                              {strategy.name}
                            </p>
                            <p className="text-sm text-gray-400 mt-1">
                              {strategy.definition}
                            </p>
                            <p className="text-sm text-red-500 mt-1">
                              Used {strategy.count} times
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#DC2626"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {dashboardData.chatSessions.map((session) => (
            <div
              key={session.id}
              className="bg-[#1A0505]/40 backdrop-blur-lg rounded-2xl border border-red-900/20 p-6 transform hover:scale-105 transition-all duration-300"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-white">
                  {session.title}
                </h3>
                <span className="text-sm text-gray-400">
                  {new Date(session.createdAt).toLocaleDateString()}
                </span>
              </div>
              {session.summary && (
                <p className="text-gray-400 mb-6 italic">"{session.summary}"</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">
                    Identified Triggers
                  </h4>
                  <div className="space-y-2">
                    {session.triggers.map((trigger, index) => (
                      <div
                        key={index}
                        className="bg-[#0A0A0A]/40 backdrop-blur-sm p-3 rounded-lg border border-red-900/10"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-gray-300">{trigger.name}</span>
                          <span className="text-red-500">
                            {trigger.count} times
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-medium text-white mb-3">
                    Coping Strategies
                  </h4>
                  <div className="space-y-2">
                    {session.copingStrategies.length > 0 ? (
                      session.copingStrategies.map((strategy, index) => (
                        <div
                          key={index}
                          className="bg-[#0A0A0A]/40 backdrop-blur-sm p-3 rounded-lg border border-red-900/10"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-gray-300">
                              {strategy.name}
                            </span>
                            <span className="text-red-500">
                              {strategy.count} times
                            </span>
                          </div>
                          <p className="text-sm text-gray-400">
                            {strategy.definition}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500 italic">
                        No coping strategies discussed in this session
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
