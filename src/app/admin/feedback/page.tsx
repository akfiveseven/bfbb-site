"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface FeedbackItem {
  id: string;
  data: string;
  status: string;
  reviewNote: string | null;
  createdAt: string;
  user: { name: string | null; email: string | null; image: string | null };
}

export default function AdminFeedback() {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    axios
      .get("/api/admin/feedback")
      .then((res) => setFeedback(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const markAsRead = async (id: string) => {
    await axios.patch(`/api/admin/feedback/${id}`, { status: "approved" });
    setFeedback((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "approved" } : f))
    );
  };

  const deleteFeedback = async (id: string) => {
    await axios.delete(`/api/admin/feedback/${id}`);
    setFeedback((prev) => prev.filter((f) => f.id !== id));
  };

  const unreadCount = feedback.filter((f) => f.status === "pending").length;

  return (
    <div className="min-h-[calc(100vh-6rem)] p-4 sm:p-8 font-bob">
      <h1 className="text-2xl sm:text-4xl font-bold text-yellow text-center mb-2">
        Feedback
      </h1>
      <p className="text-gray-400 text-sm text-center mb-8">
        {unreadCount} unread message{unreadCount !== 1 ? "s" : ""}
      </p>
      <div className="max-w-3xl mx-auto space-y-3">
        {loading && <p className="text-gray-400 text-center">Loading...</p>}
        {!loading && feedback.length === 0 && (
          <p className="text-gray-400 text-center">No feedback yet.</p>
        )}
        {feedback.map((item) => {
          const parsed = JSON.parse(item.data);
          const isExpanded = expandedId === item.id;
          return (
            <div
              key={item.id}
              className={`container-bg rounded-lg border transition-colors ${
                item.status === "pending"
                  ? "border-[#fff67b]/30"
                  : "border-transparent"
              }`}
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : item.id)}
                className="w-full p-4 text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {item.user.image && (
                    <Image
                      src={item.user.image}
                      alt={item.user.name ?? "User"}
                      width={28}
                      height={28}
                      className="rounded-full flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-white truncate">
                        {parsed.subject || "No subject"}
                      </span>
                      {item.status === "pending" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/30 flex-shrink-0">
                          New
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-400">
                      {item.user.name ?? "Unknown"} — {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <span className={`text-yellow text-lg transition-transform ${isExpanded ? "rotate-180" : ""}`}>
                    ▼
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  <div className="bg-blue-950/60 rounded-lg p-4 border border-blue-800">
                    <p className="text-sm text-gray-200 whitespace-pre-wrap">
                      {parsed.message}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {item.status === "pending" && (
                      <button
                        onClick={() => markAsRead(item.id)}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600/20 text-blue-400 border border-blue-600/50 hover:bg-blue-600/30 cursor-pointer"
                      >
                        Mark as Read
                      </button>
                    )}
                    {item.user.email && (
                      <a
                        href={`mailto:${item.user.email}?subject=Re: ${encodeURIComponent(parsed.subject || "Your feedback")}&body=${encodeURIComponent(`Hi ${item.user.name || "there"},\n\nThank you for your feedback regarding "${parsed.subject || "your message"}".\n\n`)}`}
                        className="px-3 py-1.5 rounded-md text-xs font-medium bg-green-600/20 text-green-400 border border-green-600/50 hover:bg-green-600/30 cursor-pointer inline-block"
                      >
                        Reply via Email
                      </a>
                    )}
                    {!item.user.email && (
                      <span className="text-xs text-gray-500">No email available for reply</span>
                    )}
                    <button
                      onClick={() => deleteFeedback(item.id)}
                      className="px-3 py-1.5 rounded-md text-xs font-medium text-red-400 border border-red-500/30 hover:bg-red-500/10 cursor-pointer ml-auto"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
