"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";

interface Submission {
  id: string;
  type: string;
  data: string;
  status: string;
  createdAt: string;
  user: { name: string | null; image: string | null };
}

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = async () => {
    try {
      const res = await axios.get("/api/admin/submissions");
      setSubmissions(res.data);
    } catch {
      // handled
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleAction = async (id: string, action: "approve" | "deny") => {
    try {
      await axios.patch(`/api/admin/submissions/${id}`, { action });
      setSubmissions((prev) => prev.filter((s) => s.id !== id));
    } catch {
      // handled
    }
  };

  return (
    <div className="min-h-[calc(100vh-6rem)] p-4 sm:p-8 font-bob">
      <h1 className="text-2xl sm:text-4xl font-bold text-yellow text-center mb-8">
        Pending Submissions
      </h1>
      <div className="max-w-4xl mx-auto space-y-4">
        {loading && <p className="text-gray-400 text-center">Loading...</p>}
        {!loading && submissions.length === 0 && (
          <p className="text-gray-400 text-center">No pending submissions.</p>
        )}
        {submissions.map((sub) => {
          const parsed = JSON.parse(sub.data);
          return (
            <div
              key={sub.id}
              className="container-bg rounded-lg p-4 sm:p-6 border border-blue-700"
            >
              <div className="flex items-center gap-3 mb-3">
                {sub.user.image && (
                  <Image
                    src={sub.user.image}
                    alt={sub.user.name ?? "User"}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                )}
                <span className="text-sm text-gray-300">
                  {sub.user.name ?? "Unknown user"}
                </span>
                <span className="text-xs text-gray-500 ml-auto">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="mb-3">
                <span className="text-xs text-gray-400 uppercase mr-2">
                  {sub.type}
                </span>
                <span className="text-sm font-semibold text-white">
                  {parsed.name}
                </span>
              </div>
              <div className="text-xs text-gray-300 mb-4 space-y-1">
                {sub.type === "strategy" && (
                  <>
                    <p>Level: {parsed.level}</p>
                    <p>Spatulas: {(parsed.spatulas || (parsed.spatula ? [parsed.spatula] : [])).filter((s: string) => s !== "N/A").join(", ") || "N/A"}</p>
                  </>
                )}
                {sub.type === "method" && (
                  <>
                    <p>Strategy: {parsed.strat}</p>
                    <p>Difficulty: {parsed.difficulty}</p>
                    <p>Hans: {parsed.hans || "N/A"}</p>
                    <p>Prerequisites: {(parsed.prerequisites || []).join(", ") || "None"}</p>
                    <p>Videos: {(parsed.videoURLs || []).join(", ") || "N/A"}</p>
                  </>
                )}
                {sub.type === "guide" && (
                  <>
                    <p>Difficulty: {parsed.difficulty}</p>
                    <p>Category: {parsed.category || "N/A"}</p>
                    <p>Link: {parsed.link}</p>
                  </>
                )}
                {sub.type === "glossary" && (
                  <>
                    <p>Difficulty: {parsed.difficulty}</p>
                    <p>Video: {parsed.videoURL || "N/A"}</p>
                  </>
                )}
                {sub.type === "route" && (
                  <>
                    <p>Category: {parsed.category || "N/A"}</p>
                    <p>Items in route: {parsed.entryCount || "Unknown"}</p>
                  </>
                )}
                {sub.type === "edit" && (
                  <>
                    <p>Editing: {parsed.entityType} (ID: {parsed.entityId})</p>
                    <p className="font-semibold mt-1">Proposed changes:</p>
                    {Object.entries(parsed.changes || {}).map(([key, value]) => (
                      <p key={key}>{key}: {Array.isArray(value) ? (value as string[]).join(", ") : String(value)}</p>
                    ))}
                  </>
                )}
                <p className="mt-2">{parsed.description}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleAction(sub.id, "approve")}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600/20 text-green-400 border border-green-600/50 hover:bg-green-600/30 transition-colors cursor-pointer"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleAction(sub.id, "deny")}
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-red-600/20 text-red-400 border border-red-600/50 hover:bg-red-600/30 transition-colors cursor-pointer"
                >
                  Deny
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
