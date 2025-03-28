"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface Chat {
  _id: string;
  title: string;
  summary: string;
  currentStep: number;
  status: "active" | "completed" | "archived";
  createdAt: string;
  updatedAt: string;
  tags: string[];
}

interface PaginationData {
  total: number;
  pages: number;
  page: number;
  limit: number;
}

export default function ChatHistory() {
  const router = useRouter();
  const [chats, setChats] = useState<Chat[]>([]);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    pages: 0,
    page: 1,
    limit: 10,
  });
  const [status, setStatus] = useState<string>("active");
  const [search, setSearch] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const fetchChats = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        status,
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        search,
      });

      const response = await fetch(`/api/chats?${queryParams}`);
      const data = await response.json();

      if (response.ok) {
        setChats(data.chats);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [status, pagination.page, search]);

  const handleChatClick = (chatId: string) => {
    router.push(`/dashboard/chat?id=${chatId}`);
  };

  const getStepLabel = (step: number) => {
    const steps = [
      "Identify Feelings",
      "Explore Triggers",
      "Develop Strategies",
      "Create Action Plan",
    ];
    return steps[step - 1] || "Complete";
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex space-x-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="active">Active</option>
            <option value="completed">Completed</option>
            <option value="archived">Archived</option>
          </select>
          <input
            type="text"
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-lg border border-gray-300 px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : chats.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No conversations found
        </div>
      ) : (
        <div className="grid gap-4">
          {chats.map((chat) => (
            <div
              key={chat._id}
              onClick={() => handleChatClick(chat._id)}
              className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{chat.title}</h3>
                <span className="text-sm text-gray-500">
                  {format(new Date(chat.updatedAt), "MMM d, yyyy")}
                </span>
              </div>
              <p className="text-gray-600 text-sm mb-3">{chat.summary}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                    {getStepLabel(chat.currentStep)}
                  </span>
                  {chat.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    chat.status === "completed"
                      ? "bg-green-100 text-green-800"
                      : chat.status === "archived"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {chat.status.charAt(0).toUpperCase() + chat.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          <button
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page - 1 })
            }
            disabled={pagination.page === 1}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            onClick={() =>
              setPagination({ ...pagination, page: pagination.page + 1 })
            }
            disabled={pagination.page === pagination.pages}
            className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
