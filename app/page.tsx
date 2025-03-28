"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  role: "user" | "assistant";
  content: string;
  type?: "response" | "question";
}

interface Session {
  first_name?: string;
  last_name?: string;
  email?: string;
  picture?: string;
}

// Create a separate client component for the main content
function NewProjectContent() {
  // const [session, setSession] = useState<Session | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [projectId, setProjectId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // const router = useRouter();
  // const searchParams = useSearchParams();
  // const projectId = searchParams.get("id");

  useEffect(() => {
    const fetchProject = async () => {
      if (projectId) {
        try {
          const response = await fetch(`/api/project/${projectId}`);
          if (response.ok) {
            const data = await response.json();
            // setProject(data);
            setMessages(data.messages || []);
          }
        } catch (error) {
          console.error("Error fetching project:", error);
        }
      }
    };

    fetchProject();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/project/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
        }),
      });

      const data = await response.json();

      console.log(data);

      // const assistantMessage: Message = {
      //   role: "assistant",
      //   content: data.content,
      //   type: data.schema ? "response" : "question",
      // };

      // // Update messages state with the assistant's response
      // setMessages((prev) => [...prev, assistantMessage]);

      // if (data) {
      //   // Save or update the project with the complete schema
      //   const projectResponse = await fetch(
      //     projectId ? `/api/project/${projectId}` : "/api/project/save",
      //     {
      //       method: projectId ? "PUT" : "POST",
      //       headers: {
      //         "Content-Type": "application/json",
      //       },
      //       body: JSON.stringify({
      //         schema: data.schema,
      //         messages: [...messages, userMessage, assistantMessage],
      //         name: `Project ${new Date().toLocaleDateString()}`, // Add a default name
      //       }),
      //     }
      //   );

      //   if (!projectResponse.ok) {
      //     throw new Error("Failed to save project");
      //   }

      //   const projectData = await projectResponse.json();

      //   // Use _id instead of id for navigation
      //   // router.push(`/project/${projectData._id}`);
      // }
    } catch (error) {
      console.error("Error:", error);
      // Add error message to the UI
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Sorry, there was an error saving your project. Please try again.",
          type: "response",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col space-y-8">
          {/* Welcome Section */}
          <div
            className={`text-center ${
              messages.length > 0 ? "hidden" : "block"
            } animate-fade-in`}
          >
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 animate-slide-up"
              style={{ animationDelay: "200ms" }}
            >
              Welcome,{" "}
              <span className="text-gray-700">
                {/* <em>{session?.first_name || "User"}</em> */}
                <em>User</em>
              </span>
            </h2>
            <p
              className="text-lg sm:text-xl md:text-2xl text-gray-600 animate-slide-up"
              style={{ animationDelay: "400ms" }}
            >
              What are we building today?
            </p>
          </div>

          {/* Messages Section */}
          <div
            className={`space-y-4 sm:space-y-6 ${
              messages.length > 0 ? "block" : "hidden"
            }`}
          >
            {messages.slice(-2).map((message, index) => {
              return (
                <div key={index} className="space-y-4">
                  {message.role === "assistant" ? (
                    <>
                      <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 animate-chat-bubble">
                        {message.content}
                      </div>

                      {/* {text && (
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 animate-chat-bubble max-w-3xl">
                          <p className="text-gray-800 text-sm sm:text-base">
                            {text}
                          </p>
                        </div>
                      )} */}
                    </>
                  ) : (
                    <div className="bg-gray-50 rounded-lg shadow-sm p-4 sm:p-6 animate-chat-bubble max-w-3xl ml-auto">
                      <p className="text-gray-800 text-sm sm:text-base">
                        {message.content}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
            {isLoading && (
              <div className="bg-white rounded-lg shadow-sm border-gray-200 p-4 sm:p-6 animate-chat-bubble max-w-3xl">
                <p className="text-gray-800 text-sm sm:text-base">
                  Got it! Let me work on that...
                </p>
              </div>
            )}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
            <div className="flex gap-2">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                className="flex-1 text-base sm:text-lg py-6"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading}
                size="lg"
                className="px-6 py-6"
              >
                <Send className="w-5 h-5 sm:w-6 sm:h-6" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Main component with Suspense boundary
export default function NewProject() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <NewProjectContent />
    </Suspense>
  );
}
