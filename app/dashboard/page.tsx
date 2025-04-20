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
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold text-gray-700">
          Welcome to Your Therapy Dashboard
        </h2>
        <p className="mt-2 text-gray-600">
          Start your therapy journey to see your progress and insights.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Your Therapy Progress
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Total Sessions
          </h3>
          <p className="text-3xl font-bold text-indigo-600">
            {dashboardData.sessionStats.total}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Completed Steps
          </h3>
          <p className="text-3xl font-bold text-green-600">
            {dashboardData.sessionStats.completed}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            In Progress
          </h3>
          <p className="text-3xl font-bold text-yellow-600">
            {dashboardData.sessionStats.inProgress}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-700 mb-2">
            Average Mood
          </h3>
          <p className="text-3xl font-bold text-blue-600">
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
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Mood Trends
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.moodTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#4F46E5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">
            Coping Strategies
          </h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dashboardData.copingStrategies}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const strategy = payload[0].payload;
                      return (
                        <div className="bg-white p-4 border rounded-lg shadow-lg">
                          <p className="font-semibold">{strategy.name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {strategy.definition}
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
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
                  stroke="#10B981"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {dashboardData.chatSessions.map((session) => (
          <div key={session.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-700">
                {session.title}
              </h3>
              <span className="text-sm text-gray-500">
                {new Date(session.createdAt).toLocaleDateString()}
              </span>
            </div>
            {session.summary && (
              <p className="text-gray-600 mb-6 italic">"{session.summary}"</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">
                  Identified Triggers
                </h4>
                <div className="space-y-2">
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={session.triggers}
                          dataKey="count"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          label
                        >
                          {session.triggers.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-medium text-gray-700 mb-3">
                  Coping Strategies
                </h4>
                <div className="space-y-2">
                  {session.copingStrategies.length > 0 ? (
                    session.copingStrategies.map((strategy, index) => (
                      <div key={index} className="bg-green-50 p-3 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-gray-700 font-medium">
                            {strategy.name}
                          </span>
                          <span className="text-green-600 font-medium">
                            {strategy.count} times
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
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
  );
}
