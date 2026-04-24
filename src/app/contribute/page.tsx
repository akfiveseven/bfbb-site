"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import axios from "axios";
import type { Spatula, Strategy } from "@/types/data";

interface Submission {
  id: string;
  type: string;
  data: string;
  status: string;
  createdAt: string;
}

export default function Contribute() {
  const { data: session, status: authStatus } = useSession();
  const [tab, setTab] = useState<"strategy" | "method" | "guide">("strategy");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [spatulas, setSpatulas] = useState<Spatula[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Strategy form
  const [stratName, setStratName] = useState("");
  const [stratLevel, setStratLevel] = useState("");
  const [stratSpatula, setStratSpatula] = useState("");
  const [stratPrereqs, setStratPrereqs] = useState("");
  const [stratHans, setStratHans] = useState("N/A");
  const [stratDescription, setStratDescription] = useState("");
  const [stratLinks, setStratLinks] = useState("");

  // Method form
  const [methodName, setMethodName] = useState("");
  const [methodStrat, setMethodStrat] = useState("");
  const [methodDifficulty, setMethodDifficulty] = useState("1");
  const [methodDescription, setMethodDescription] = useState("");
  const [methodVideoURL, setMethodVideoURL] = useState("");

  // Guide form
  const [guideName, setGuideName] = useState("");
  const [guideDifficulty, setGuideDifficulty] = useState("Beginner");
  const [guideCategory, setGuideCategory] = useState("");
  const [guideLink, setGuideLink] = useState("");

  const levels = [
    "Bikini Bottom", "Jellyfish Fields", "Downtown Bikini Bottom",
    "Goo Lagoon", "Poseidome", "Rock Bottom", "Mermalair",
    "Sand Mountain", "Industrial Park", "Kelp Forest",
    "Flying Dutchman's Graveyard", "SpongeBob's Dream", "Chum Bucket Lab",
  ];

  useEffect(() => {
    if (session) {
      axios.get("/api/submissions").then((res) => setSubmissions(res.data));
      axios.get("/api/data/spatulas").then((res) => setSpatulas(res.data));
      axios.get("/api/data/strategies").then((res) => setStrategies(res.data));
    }
  }, [session]);

  const filteredSpatulas = stratLevel
    ? spatulas.filter((s) => s.level === stratLevel)
    : spatulas;

  const handleSubmitStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await axios.post("/api/submissions", {
        type: "strategy",
        data: {
          name: stratName,
          level: stratLevel,
          spatula: stratSpatula,
          prerequisites: stratPrereqs
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          hans: stratHans,
          description: stratDescription,
          links: stratLinks
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
        },
      });
      setMessage("Strategy submitted for review!");
      setStratName("");
      setStratLevel("");
      setStratSpatula("");
      setStratPrereqs("");
      setStratHans("N/A");
      setStratDescription("");
      setStratLinks("");
      const res = await axios.get("/api/submissions");
      setSubmissions(res.data);
    } catch {
      setMessage("Failed to submit. Please try again.");
    }
    setSubmitting(false);
  };

  const handleSubmitMethod = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await axios.post("/api/submissions", {
        type: "method",
        data: {
          name: methodName,
          strat: methodStrat,
          difficulty: methodDifficulty,
          description: methodDescription,
          videoURL: methodVideoURL,
        },
      });
      setMessage("Method submitted for review!");
      setMethodName("");
      setMethodStrat("");
      setMethodDifficulty("1");
      setMethodDescription("");
      setMethodVideoURL("");
      const res = await axios.get("/api/submissions");
      setSubmissions(res.data);
    } catch {
      setMessage("Failed to submit. Please try again.");
    }
    setSubmitting(false);
  };

  const handleSubmitGuide = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await axios.post("/api/submissions", {
        type: "guide",
        data: {
          name: guideName,
          difficulty: guideDifficulty,
          category: guideCategory,
          link: guideLink,
        },
      });
      setMessage("Guide submitted for review!");
      setGuideName("");
      setGuideDifficulty("Beginner");
      setGuideCategory("");
      setGuideLink("");
      const res = await axios.get("/api/submissions");
      setSubmissions(res.data);
    } catch {
      setMessage("Failed to submit. Please try again.");
    }
    setSubmitting(false);
  };

  if (authStatus === "loading") {
    return (
      <div className="flex items-center justify-center min-h-[50vh] font-bob">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] font-bob gap-4">
        <h1 className="text-2xl font-bold text-yellow">Contribute</h1>
        <p className="text-gray-300">Sign in with Discord to contribute strategies and methods.</p>
        <button
          onClick={() => signIn("discord")}
          className="px-6 py-3 rounded-lg text-white font-medium bg-[#5865F2] hover:bg-[#4752C4] transition-colors cursor-pointer"
        >
          Sign in with Discord
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full px-3 py-2 rounded-lg bg-blue-950/60 border border-blue-700 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#fff67b] transition-colors duration-200";
  const labelClass = "block text-sm font-medium text-gray-300 mb-1";

  return (
    <div className="min-h-[calc(100vh-6rem)] p-4 sm:p-8 font-bob">
      <h1 className="text-2xl sm:text-4xl font-bold text-yellow text-center mb-6">
        Contribute
      </h1>

      {/* Tab Toggle */}
      <div className="flex justify-center gap-2 mb-6">
        <button
          onClick={() => setTab("strategy")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === "strategy"
              ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
              : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
          }`}
        >
          Submit Strategy
        </button>
        <button
          onClick={() => setTab("method")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === "method"
              ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
              : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
          }`}
        >
          Submit Method
        </button>
        <button
          onClick={() => setTab("guide")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === "guide"
              ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
              : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
          }`}
        >
          Submit Guide
        </button>
      </div>

      {message && (
        <div className="max-w-2xl mx-auto mb-4 p-3 rounded-lg bg-blue-900/60 border border-blue-700 text-sm text-center text-white">
          {message}
        </div>
      )}

      {/* Strategy Form */}
      {tab === "strategy" && (
        <form onSubmit={handleSubmitStrategy} className="max-w-2xl mx-auto space-y-4">
          <div className="container-bg rounded-lg p-6 space-y-4">
            <div>
              <label className={labelClass}>Strategy Name *</label>
              <input
                type="text"
                value={stratName}
                onChange={(e) => setStratName(e.target.value)}
                required
                className={inputClass}
                placeholder="e.g. Hand Disable"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Level *</label>
                <select
                  value={stratLevel}
                  onChange={(e) => {
                    setStratLevel(e.target.value);
                    setStratSpatula("");
                  }}
                  required
                  className={inputClass}
                >
                  <option value="">Select level</option>
                  {levels.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Spatula</label>
                <select
                  value={stratSpatula}
                  onChange={(e) => setStratSpatula(e.target.value)}
                  className={inputClass}
                >
                  <option value="">N/A</option>
                  {filteredSpatulas.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Prerequisites (comma-separated)</label>
                <input
                  type="text"
                  value={stratPrereqs}
                  onChange={(e) => setStratPrereqs(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Bubble Bowl, Cruise Bubble"
                />
              </div>
              <div>
                <label className={labelClass}>Hans</label>
                <select
                  value={stratHans}
                  onChange={(e) => setStratHans(e.target.value)}
                  className={inputClass}
                >
                  <option value="N/A">N/A</option>
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                value={stratDescription}
                onChange={(e) => setStratDescription(e.target.value)}
                required
                rows={4}
                className={inputClass}
                placeholder="Describe the strategy..."
              />
            </div>
            <div>
              <label className={labelClass}>Links (comma-separated URLs)</label>
              <input
                type="text"
                value={stratLinks}
                onChange={(e) => setStratLinks(e.target.value)}
                className={inputClass}
                placeholder="https://..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50 font-medium hover:bg-[#fff67b]/30 transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Strategy"}
            </button>
          </div>
        </form>
      )}

      {/* Method Form */}
      {tab === "method" && (
        <form onSubmit={handleSubmitMethod} className="max-w-2xl mx-auto space-y-4">
          <div className="container-bg rounded-lg p-6 space-y-4">
            <div>
              <label className={labelClass}>Method Name *</label>
              <input
                type="text"
                value={methodName}
                onChange={(e) => setMethodName(e.target.value)}
                required
                className={inputClass}
                placeholder="e.g. Original Disable"
              />
            </div>
            <div>
              <label className={labelClass}>Strategy *</label>
              <select
                value={methodStrat}
                onChange={(e) => setMethodStrat(e.target.value)}
                required
                className={inputClass}
              >
                <option value="">Select strategy</option>
                {strategies.map((s) => (
                  <option key={s.id} value={s.name}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Difficulty (1-10) *</label>
              <select
                value={methodDifficulty}
                onChange={(e) => setMethodDifficulty(e.target.value)}
                required
                className={inputClass}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                  <option key={n} value={String(n)}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                value={methodDescription}
                onChange={(e) => setMethodDescription(e.target.value)}
                required
                rows={4}
                className={inputClass}
                placeholder="Describe the method..."
              />
            </div>
            <div>
              <label className={labelClass}>Video URL</label>
              <input
                type="text"
                value={methodVideoURL}
                onChange={(e) => setMethodVideoURL(e.target.value)}
                className={inputClass}
                placeholder="https://youtu.be/..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50 font-medium hover:bg-[#fff67b]/30 transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Method"}
            </button>
          </div>
        </form>
      )}

      {/* Guide Form */}
      {tab === "guide" && (
        <form onSubmit={handleSubmitGuide} className="max-w-2xl mx-auto space-y-4">
          <div className="container-bg rounded-lg p-6 space-y-4">
            <div>
              <label className={labelClass}>Guide Name *</label>
              <input
                type="text"
                value={guideName}
                onChange={(e) => setGuideName(e.target.value)}
                required
                className={inputClass}
                placeholder="e.g. SHiFT Any% Tutorial"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Difficulty *</label>
                <select
                  value={guideDifficulty}
                  onChange={(e) => setGuideDifficulty(e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>Category</label>
                <input
                  type="text"
                  value={guideCategory}
                  onChange={(e) => setGuideCategory(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Any%"
                />
              </div>
            </div>
            <div>
              <label className={labelClass}>Link *</label>
              <input
                type="url"
                value={guideLink}
                onChange={(e) => setGuideLink(e.target.value)}
                required
                className={inputClass}
                placeholder="https://youtu.be/..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50 font-medium hover:bg-[#fff67b]/30 transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Guide"}
            </button>
          </div>
        </form>
      )}

      {/* Past Submissions */}
      <div className="max-w-2xl mx-auto mt-8">
        <h2 className="text-xl font-bold text-yellow mb-4">Your Submissions</h2>
        {submissions.length === 0 ? (
          <p className="text-gray-400 text-sm">No submissions yet.</p>
        ) : (
          <div className="space-y-2">
            {submissions.map((sub) => {
              const parsed = JSON.parse(sub.data);
              return (
                <div
                  key={sub.id}
                  className="container-bg rounded-lg p-4 flex justify-between items-center"
                >
                  <div>
                    <span className="text-sm font-semibold text-white">
                      {parsed.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">({sub.type})</span>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-md border ${
                      sub.status === "approved"
                        ? "border-green-500/50 text-green-400 bg-green-500/10"
                        : sub.status === "denied"
                        ? "border-red-500/50 text-red-400 bg-red-500/10"
                        : "border-yellow-500/50 text-yellow-400 bg-yellow-500/10"
                    }`}
                  >
                    {sub.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
