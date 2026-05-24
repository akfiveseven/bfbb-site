"use client";

import React, { useState, useEffect } from "react";
import { useSession, signIn } from "next-auth/react";
import axios from "axios";
import type { Spatula, Strategy, Method, Guide, GlossaryEntry, SockStrategy, Sock } from "@/types/data";

interface Submission {
  id: string;
  type: string;
  data: string;
  status: string;
  createdAt: string;
}

export default function Contribute() {
  const { data: session, status: authStatus } = useSession();
  const [tab, setTab] = useState<"strategy" | "method" | "sockStrategy" | "guide" | "glossary" | "feedback" | "edit">("strategy");
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [spatulas, setSpatulas] = useState<Spatula[]>([]);
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Strategy form
  const [stratName, setStratName] = useState("");
  const [stratLevel, setStratLevel] = useState("");
  const [stratSpatulas, setStratSpatulas] = useState<string[]>([]);
  const [stratDescription, setStratDescription] = useState("");

  // Method form
  const [methodName, setMethodName] = useState("");
  const [methodStrat, setMethodStrat] = useState("");
  const [methodStratSearch, setMethodStratSearch] = useState("");
  const [methodStratOpen, setMethodStratOpen] = useState(false);
  const [methodDifficulty, setMethodDifficulty] = useState("Beginner");
  const [methodDescription, setMethodDescription] = useState("");
  const [methodVideoURLs, setMethodVideoURLs] = useState<string[]>([""]);
  const [methodPrereqs, setMethodPrereqs] = useState("");
  const [methodHans, setMethodHans] = useState("N/A");
  const [methodObsolete, setMethodObsolete] = useState(false);

  // Guide form
  const [guideName, setGuideName] = useState("");
  const [guideDifficulty, setGuideDifficulty] = useState("Beginner");
  const [guideCategory, setGuideCategory] = useState("");
  const [guideLink, setGuideLink] = useState("");

  // Glossary form
  const [glossaryName, setGlossaryName] = useState("");
  const [glossaryDifficulty, setGlossaryDifficulty] = useState("Beginner");
  const [glossaryDescription, setGlossaryDescription] = useState("");
  const [glossaryVideoURL, setGlossaryVideoURL] = useState("");

  // Sock strategy form
  const [sockStratName, setSockStratName] = useState("");
  const [sockStratLevel, setSockStratLevel] = useState("");
  const [sockStratSock, setSockStratSock] = useState("");

  // Feedback form
  const [feedbackSubject, setFeedbackSubject] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // Edit existing state
  const [editEntityType, setEditEntityType] = useState<"strategy" | "method" | "sockStrategy" | "guide" | "glossary">("strategy");
  const [editSearch, setEditSearch] = useState("");
  const [methods, setMethods] = useState<Method[]>([]);
  const [socksData, setSocksData] = useState<Sock[]>([]);
  const [sockStrategiesData, setSockStrategiesData] = useState<SockStrategy[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [glossary, setGlossary] = useState<GlossaryEntry[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [editingEntry, setEditingEntry] = useState<any>(null);
  const [editEntityId, setEditEntityId] = useState<number | null>(null);

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
      axios.get("/api/data/methods").then((res) => setMethods(res.data));
      axios.get("/api/data/socks").then((res) => setSocksData(res.data));
      axios.get("/api/data/sockStrategies").then((res) => setSockStrategiesData(res.data));
      axios.get("/api/data/guides").then((res) => setGuides(res.data));
      axios.get("/api/data/glossary").then((res) => setGlossary(res.data));
    }
  }, [session]);

  const filteredSpatulas = stratLevel
    ? spatulas.filter((s) => s.level === stratLevel)
    : spatulas;

  const filteredSocks = sockStratLevel
    ? socksData.filter((s) => s.level === sockStratLevel)
    : socksData;

  const handleSubmitSockStrategy = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await axios.post("/api/submissions", {
        type: "sockStrategy",
        data: {
          name: sockStratName,
          sock: sockStratSock,
          level: sockStratLevel,
        },
      });
      setMessage("Sock strategy submitted for review!");
      setSockStratName("");
      setSockStratLevel("");
      setSockStratSock("");
      const res = await axios.get("/api/submissions");
      setSubmissions(res.data);
    } catch {
      setMessage("Failed to submit. Please try again.");
    }
    setSubmitting(false);
  };

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
          spatulas: stratSpatulas.length > 0 ? stratSpatulas : ["N/A"],
          description: stratDescription,
        },
      });
      setMessage("Strategy submitted for review!");
      setStratName("");
      setStratLevel("");
      setStratSpatulas([]);
      setStratDescription("");
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
          videoURLs: methodVideoURLs.filter(Boolean),
          prerequisites: methodPrereqs
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          hans: methodHans,
          obsolete: methodObsolete,
        },
      });
      setMessage("Method submitted for review!");
      setMethodName("");
      setMethodStrat("");
      setMethodStratSearch("");
      setMethodStratOpen(false);
      setMethodDifficulty("Beginner");
      setMethodDescription("");
      setMethodVideoURLs([""]);
      setMethodPrereqs("");
      setMethodHans("N/A");
      setMethodObsolete(false);
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

  const handleSubmitGlossary = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await axios.post("/api/submissions", {
        type: "glossary",
        data: {
          name: glossaryName,
          difficulty: glossaryDifficulty,
          description: glossaryDescription,
          videoURL: glossaryVideoURL,
        },
      });
      setMessage("Glossary entry submitted for review!");
      setGlossaryName("");
      setGlossaryDifficulty("Beginner");
      setGlossaryDescription("");
      setGlossaryVideoURL("");
      const res = await axios.get("/api/submissions");
      setSubmissions(res.data);
    } catch {
      setMessage("Failed to submit. Please try again.");
    }
    setSubmitting(false);
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage("");
    try {
      await axios.post("/api/submissions", {
        type: "feedback",
        data: {
          name: feedbackSubject || "Feedback",
          subject: feedbackSubject,
          message: feedbackMessage,
        },
      });
      setMessage("Feedback submitted! Thank you.");
      setFeedbackSubject("");
      setFeedbackMessage("");
      const res = await axios.get("/api/submissions");
      setSubmissions(res.data);
    } catch {
      setMessage("Failed to submit. Please try again.");
    }
    setSubmitting(false);
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEntry || editEntityId === null) return;
    setSubmitting(true);
    setMessage("");
    try {
      await axios.post("/api/submissions", {
        type: "edit",
        data: {
          name: `Edit ${editEntityType}: ${editingEntry.name}`,
          entityType: editEntityType,
          entityId: editEntityId,
          changes: editingEntry,
        },
      });
      setMessage("Edit submitted for review!");
      setEditingEntry(null);
      setEditEntityId(null);
      const res = await axios.get("/api/submissions");
      setSubmissions(res.data);
    } catch {
      setMessage("Failed to submit. Please try again.");
    }
    setSubmitting(false);
  };

  const selectEntryToEdit = (entityType: string, entry: Record<string, unknown>) => {
    setEditEntityId(entry.id as number);
    if (entityType === "strategy") {
      setEditingEntry({ ...entry });
    } else if (entityType === "method") {
      setEditingEntry({ ...entry });
    } else if (entityType === "guide") {
      setEditingEntry({ ...entry });
    } else if (entityType === "sockStrategy") {
      setEditingEntry({ ...entry });
    } else if (entityType === "glossary") {
      setEditingEntry({ ...entry });
    }
  };

  const getFilteredEntries = () => {
    const q = editSearch.toLowerCase();
    if (editEntityType === "strategy") {
      return strategies.filter((s) => s.name.toLowerCase().includes(q) || s.level.toLowerCase().includes(q));
    } else if (editEntityType === "method") {
      return methods.filter((m) => m.name.toLowerCase().includes(q) || m.strat.toLowerCase().includes(q));
    } else if (editEntityType === "sockStrategy") {
      return sockStrategiesData.filter((s) => s.name.toLowerCase().includes(q) || s.sock.toLowerCase().includes(q) || s.level.toLowerCase().includes(q));
    } else if (editEntityType === "guide") {
      return guides.filter((g) => g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q));
    } else {
      return glossary.filter((g) => g.name.toLowerCase().includes(q) || g.description.toLowerCase().includes(q));
    }
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
        <button
          onClick={() => setTab("sockStrategy")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === "sockStrategy"
              ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
              : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
          }`}
        >
          Submit Sock Strat
        </button>
        <button
          onClick={() => setTab("glossary")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === "glossary"
              ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
              : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
          }`}
        >
          Submit Glossary Entry
        </button>
        <button
          onClick={() => setTab("feedback")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === "feedback"
              ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
              : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
          }`}
        >
          Feedback
        </button>
        <button
          onClick={() => setTab("edit")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
            tab === "edit"
              ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
              : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
          }`}
        >
          Edit Existing
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
                    setStratSpatulas([]);
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
                <label className={labelClass}>Spatulas</label>
                <div className="max-h-40 overflow-y-auto rounded-lg bg-blue-950/60 border border-blue-700 p-2 space-y-1">
                  {filteredSpatulas.length === 0 ? (
                    <p className="text-xs text-gray-500">Select a level first</p>
                  ) : (
                    filteredSpatulas.map((s) => (
                      <label key={s.id} className="flex items-center gap-2 text-sm text-white cursor-pointer hover:bg-blue-900/40 rounded px-1 py-0.5">
                        <input
                          type="checkbox"
                          checked={stratSpatulas.includes(s.name)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setStratSpatulas([...stratSpatulas, s.name]);
                            } else {
                              setStratSpatulas(stratSpatulas.filter((n) => n !== s.name));
                            }
                          }}
                          className="accent-[#fff67b]"
                        />
                        {s.name}
                      </label>
                    ))
                  )}
                </div>
                <p className="text-xs text-gray-500 mt-1">Leave empty for general strats</p>
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
            <div className="relative">
              <label className={labelClass}>Strategy *</label>
              <input
                type="text"
                value={methodStratOpen ? methodStratSearch : methodStrat}
                onChange={(e) => { setMethodStratSearch(e.target.value); setMethodStratOpen(true); }}
                onFocus={() => { setMethodStratOpen(true); setMethodStratSearch(""); }}
                onBlur={() => { setTimeout(() => setMethodStratOpen(false), 150); }}
                className={inputClass}
                placeholder="Search strategies..."
                required={!methodStrat}
              />
              {methodStrat && !methodStratOpen && (
                <button
                  type="button"
                  onClick={() => { setMethodStrat(""); setMethodStratSearch(""); setMethodStratOpen(true); }}
                  className="absolute right-2 top-7 text-gray-400 hover:text-white text-sm cursor-pointer"
                >
                  ×
                </button>
              )}
              {methodStratOpen && (() => {
                const q = methodStratSearch.toLowerCase();
                const filteredSpat = strategies.filter(s => s.name.toLowerCase().includes(q));
                const filteredSock = sockStrategiesData.filter(s => s.name.toLowerCase().includes(q));
                return (filteredSpat.length > 0 || filteredSock.length > 0) ? (
                  <div className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto rounded-lg bg-blue-950 border border-blue-700 shadow-lg">
                    {filteredSpat.length > 0 && (
                      <>
                        <div className="px-3 py-1 text-xs text-gray-500 uppercase">Spatula Strategies</div>
                        {filteredSpat.map((s) => (
                          <button
                            key={`strat-${s.id}`}
                            type="button"
                            onClick={() => { setMethodStrat(s.name); setMethodStratOpen(false); setMethodStratSearch(""); }}
                            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-blue-900/60 cursor-pointer"
                          >
                            {s.name}
                          </button>
                        ))}
                      </>
                    )}
                    {filteredSock.length > 0 && (
                      <>
                        <div className="px-3 py-1 text-xs text-gray-500 uppercase">Sock Strategies</div>
                        {filteredSock.map((s) => (
                          <button
                            key={`sock-${s.id}`}
                            type="button"
                            onClick={() => { setMethodStrat(s.name); setMethodStratOpen(false); setMethodStratSearch(""); }}
                            className="w-full text-left px-3 py-2 text-sm text-white hover:bg-blue-900/60 cursor-pointer"
                          >
                            {s.name}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="absolute z-10 w-full mt-1 rounded-lg bg-blue-950 border border-blue-700 shadow-lg px-3 py-3">
                    <p className="text-sm text-gray-500">No strategies found</p>
                  </div>
                );
              })()}
            </div>
            <div>
              <label className={labelClass}>Difficulty *</label>
              <select
                value={methodDifficulty}
                onChange={(e) => setMethodDifficulty(e.target.value)}
                required
                className={inputClass}
              >
                {["Beginner", "Intermediate", "Advanced", "Expert", "Experimental"].map((d) => (
                  <option key={d} value={d}>
                    {d}
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
              <label className={labelClass}>Video URLs</label>
              {methodVideoURLs.map((url, i) => (
                <div key={i} className="flex gap-1 mb-1">
                  <input
                    type="text"
                    value={url}
                    onChange={(e) => {
                      const updated = [...methodVideoURLs];
                      updated[i] = e.target.value;
                      setMethodVideoURLs(updated);
                    }}
                    className={inputClass}
                    placeholder="https://youtu.be/..."
                  />
                  {methodVideoURLs.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setMethodVideoURLs(methodVideoURLs.filter((_, j) => j !== i))}
                      className="px-2 text-red-400 hover:text-red-300 cursor-pointer text-sm"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => setMethodVideoURLs([...methodVideoURLs, ""])}
                className="text-xs text-[#fff67b] hover:underline cursor-pointer"
              >
                + Add video URL
              </button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Prerequisites (comma-separated)</label>
                <input
                  type="text"
                  value={methodPrereqs}
                  onChange={(e) => setMethodPrereqs(e.target.value)}
                  className={inputClass}
                  placeholder="e.g. Bubble Bowl, Cruise Bubble"
                />
              </div>
              <div>
                <label className={labelClass}>Hans</label>
                <select
                  value={methodHans}
                  onChange={(e) => setMethodHans(e.target.value)}
                  className={inputClass}
                >
                  <option value="N/A">N/A</option>
                  <option value="Enabled">Enabled</option>
                  <option value="Disabled">Disabled</option>
                </select>
              </div>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={methodObsolete}
                onChange={(e) => setMethodObsolete(e.target.checked)}
                className="accent-[#fff67b]"
              />
              Obsolete strategy
            </label>
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
                  <option value="Expert">Expert</option>
                  <option value="Experimental">Experimental</option>
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

      {/* Sock Strategy Form */}
      {tab === "sockStrategy" && (
        <form onSubmit={handleSubmitSockStrategy} className="max-w-2xl mx-auto space-y-4">
          <div className="container-bg rounded-lg p-6 space-y-4">
            <div>
              <label className={labelClass}>Strategy Name *</label>
              <input
                type="text"
                value={sockStratName}
                onChange={(e) => setSockStratName(e.target.value)}
                required
                className={inputClass}
                placeholder="e.g. Sock Skip"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Level *</label>
                <select
                  value={sockStratLevel}
                  onChange={(e) => {
                    setSockStratLevel(e.target.value);
                    setSockStratSock("");
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
                <label className={labelClass}>Sock *</label>
                <select
                  value={sockStratSock}
                  onChange={(e) => setSockStratSock(e.target.value)}
                  required
                  className={inputClass}
                >
                  <option value="">Select sock</option>
                  {filteredSocks.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50 font-medium hover:bg-[#fff67b]/30 transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Sock Strategy"}
            </button>
          </div>
        </form>
      )}

      {/* Glossary Form */}
      {tab === "glossary" && (
        <form onSubmit={handleSubmitGlossary} className="max-w-2xl mx-auto space-y-4">
          <div className="container-bg rounded-lg p-6 space-y-4">
            <div>
              <label className={labelClass}>Term Name *</label>
              <input
                type="text"
                value={glossaryName}
                onChange={(e) => setGlossaryName(e.target.value)}
                required
                className={inputClass}
                placeholder="e.g. Cruise Boost (CB)"
              />
            </div>
            <div>
              <label className={labelClass}>Difficulty</label>
              <select
                value={glossaryDifficulty}
                onChange={(e) => setGlossaryDifficulty(e.target.value)}
                className={inputClass}
              >
                {["Beginner", "Intermediate", "Advanced", "Expert", "Experimental"].map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Description *</label>
              <textarea
                value={glossaryDescription}
                onChange={(e) => setGlossaryDescription(e.target.value)}
                required
                rows={4}
                className={inputClass}
                placeholder="Describe the term..."
              />
            </div>
            <div>
              <label className={labelClass}>Video URL</label>
              <input
                type="text"
                value={glossaryVideoURL}
                onChange={(e) => setGlossaryVideoURL(e.target.value)}
                className={inputClass}
                placeholder="https://youtu.be/..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50 font-medium hover:bg-[#fff67b]/30 transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit Glossary Entry"}
            </button>
          </div>
        </form>
      )}

      {/* Feedback Form */}
      {tab === "feedback" && (
        <form onSubmit={handleSubmitFeedback} className="max-w-2xl mx-auto space-y-4">
          <div className="container-bg rounded-lg p-6 space-y-4">
            <div>
              <label className={labelClass}>Subject *</label>
              <input
                type="text"
                value={feedbackSubject}
                onChange={(e) => setFeedbackSubject(e.target.value)}
                required
                className={inputClass}
                placeholder="e.g. Bug report, Feature request, General feedback"
              />
            </div>
            <div>
              <label className={labelClass}>Message *</label>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                required
                rows={6}
                className={inputClass}
                placeholder="Tell us what's on your mind..."
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 rounded-lg bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50 font-medium hover:bg-[#fff67b]/30 transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Send Feedback"}
            </button>
          </div>
        </form>
      )}

      {/* Edit Existing */}
      {tab === "edit" && (
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Entity type selector */}
          <div className="flex justify-center gap-2 flex-wrap">
            {(["strategy", "method", "sockStrategy", "guide", "glossary"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setEditEntityType(t); setEditingEntry(null); setEditEntityId(null); setEditSearch(""); }}
                className={`px-3 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                  editEntityType === t
                    ? "bg-blue-600/20 text-blue-400 border border-blue-600/50"
                    : "text-gray-400 border border-gray-600 hover:border-blue-500"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>

          {!editingEntry ? (
            <>
              {/* Search */}
              <input
                type="text"
                value={editSearch}
                onChange={(e) => setEditSearch(e.target.value)}
                placeholder={`Search ${editEntityType === "glossary" ? "glossary entries" : editEntityType + "s"}...`}
                className={inputClass}
              />
              {/* Results */}
              <div className="container-bg rounded-lg p-4 max-h-80 overflow-y-auto space-y-1">
                {getFilteredEntries().slice(0, 50).map((entry) => {
                  const e = entry as unknown as Record<string, unknown>;
                  return (
                  <button
                    key={e.id as number}
                    onClick={() => selectEntryToEdit(editEntityType, e)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-white hover:bg-blue-900/60 border border-transparent hover:border-[#fff67b] transition-colors cursor-pointer"
                  >
                    <span className="font-semibold">{e.name as string}</span>
                    {editEntityType === "strategy" && (
                      <span className="text-xs text-gray-400 ml-2">{e.level as string}</span>
                    )}
                    {editEntityType === "method" && (
                      <span className="text-xs text-gray-400 ml-2">{e.strat as string}</span>
                    )}
                    {editEntityType === "sockStrategy" && (
                      <span className="text-xs text-gray-400 ml-2">{e.level as string} — {e.sock as string}</span>
                    )}
                    {editEntityType === "guide" && (
                      <span className="text-xs text-gray-400 ml-2">{e.category as string}</span>
                    )}
                  </button>
                  );
                })}
                {getFilteredEntries().length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">No results found.</p>
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmitEdit}>
              <div className="container-bg rounded-lg p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-yellow">
                    Editing {editEntityType}: {editingEntry.name}
                  </h3>
                  <button
                    type="button"
                    onClick={() => { setEditingEntry(null); setEditEntityId(null); }}
                    className="text-xs text-gray-400 hover:text-white cursor-pointer"
                  >
                    ← Back to search
                  </button>
                </div>

                {/* Strategy edit fields */}
                {editEntityType === "strategy" && (
                  <>
                    <div>
                      <label className={labelClass}>Name</label>
                      <input value={editingEntry.name} onChange={(e) => setEditingEntry({ ...editingEntry, name: e.target.value })} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Level</label>
                        <select value={editingEntry.level} onChange={(e) => setEditingEntry({ ...editingEntry, level: e.target.value })} className={inputClass}>
                          {levels.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Spatulas</label>
                        <div className="space-y-1">
                          {(editingEntry.spatulas || []).map((spat: string, i: number) => (
                            <div key={i} className="flex gap-1">
                              <input
                                value={spat}
                                onChange={(e) => {
                                  const updated = [...editingEntry.spatulas];
                                  updated[i] = e.target.value;
                                  setEditingEntry({ ...editingEntry, spatulas: updated });
                                }}
                                className={inputClass}
                              />
                              <button
                                type="button"
                                onClick={() => setEditingEntry({ ...editingEntry, spatulas: editingEntry.spatulas.filter((_: string, j: number) => j !== i) })}
                                className="px-2 text-red-400 hover:text-red-300 cursor-pointer text-sm"
                              >
                                ×
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => setEditingEntry({ ...editingEntry, spatulas: [...(editingEntry.spatulas || []), ""] })}
                            className="text-xs text-[#fff67b] hover:underline cursor-pointer"
                          >
                            + Add spatula
                          </button>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea value={editingEntry.description} onChange={(e) => setEditingEntry({ ...editingEntry, description: e.target.value })} rows={4} className={inputClass} />
                    </div>
                  </>
                )}

                {/* Method edit fields */}
                {editEntityType === "method" && (
                  <>
                    <div>
                      <label className={labelClass}>Name</label>
                      <input value={editingEntry.name} onChange={(e) => setEditingEntry({ ...editingEntry, name: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Strategy</label>
                      <select value={editingEntry.strat} onChange={(e) => setEditingEntry({ ...editingEntry, strat: e.target.value })} className={inputClass}>
                        <optgroup label="Spatula Strategies">
                          {strategies.map((s) => <option key={`strat-${s.id}`} value={s.name}>{s.name}</option>)}
                        </optgroup>
                        <optgroup label="Sock Strategies">
                          {sockStrategiesData.map((s) => <option key={`sock-${s.id}`} value={s.name}>{s.name}</option>)}
                        </optgroup>
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Difficulty</label>
                      <select value={editingEntry.difficulty} onChange={(e) => setEditingEntry({ ...editingEntry, difficulty: e.target.value })} className={inputClass}>
                        {["Beginner", "Intermediate", "Advanced", "Expert", "Experimental"].map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea value={editingEntry.description} onChange={(e) => setEditingEntry({ ...editingEntry, description: e.target.value })} rows={4} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Video URLs</label>
                      {(editingEntry.videoURLs || []).map((url: string, i: number) => (
                        <div key={i} className="flex gap-1 mb-1">
                          <input
                            value={url}
                            onChange={(e) => {
                              const updated = [...editingEntry.videoURLs];
                              updated[i] = e.target.value;
                              setEditingEntry({ ...editingEntry, videoURLs: updated });
                            }}
                            className={inputClass}
                            placeholder="https://..."
                          />
                          <button
                            type="button"
                            onClick={() => setEditingEntry({ ...editingEntry, videoURLs: editingEntry.videoURLs.filter((_: string, j: number) => j !== i) })}
                            className="px-2 text-red-400 hover:text-red-300 cursor-pointer text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={() => setEditingEntry({ ...editingEntry, videoURLs: [...(editingEntry.videoURLs || []), ""] })}
                        className="text-xs text-[#fff67b] hover:underline cursor-pointer"
                      >
                        + Add video URL
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Prerequisites (comma-separated)</label>
                        <input value={(editingEntry.prerequisites || []).join(", ")} onChange={(e) => setEditingEntry({ ...editingEntry, prerequisites: e.target.value.split(",").map((s: string) => s.trim()).filter(Boolean) })} className={inputClass} />
                      </div>
                      <div>
                        <label className={labelClass}>Hans</label>
                        <select value={editingEntry.hans} onChange={(e) => setEditingEntry({ ...editingEntry, hans: e.target.value })} className={inputClass}>
                          <option value="N/A">N/A</option>
                          <option value="Enabled">Enabled</option>
                          <option value="Disabled">Disabled</option>
                        </select>
                      </div>
                    </div>
                    <label className="flex items-center gap-2 text-sm text-gray-300 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingEntry.obsolete ?? false}
                        onChange={(e) => setEditingEntry({ ...editingEntry, obsolete: e.target.checked })}
                        className="accent-[#fff67b]"
                      />
                      Obsolete
                    </label>
                  </>
                )}

                {/* Guide edit fields */}
                {editEntityType === "guide" && (
                  <>
                    <div>
                      <label className={labelClass}>Name</label>
                      <input value={editingEntry.name} onChange={(e) => setEditingEntry({ ...editingEntry, name: e.target.value })} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Difficulty</label>
                        <select value={editingEntry.difficulty} onChange={(e) => setEditingEntry({ ...editingEntry, difficulty: e.target.value })} className={inputClass}>
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                          <option value="Experimental">Experimental</option>
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Category</label>
                        <input value={editingEntry.category} onChange={(e) => setEditingEntry({ ...editingEntry, category: e.target.value })} className={inputClass} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClass}>Link</label>
                      <input value={editingEntry.link} onChange={(e) => setEditingEntry({ ...editingEntry, link: e.target.value })} className={inputClass} />
                    </div>
                  </>
                )}

                {/* Sock Strategy edit fields */}
                {editEntityType === "sockStrategy" && (
                  <>
                    <div>
                      <label className={labelClass}>Name</label>
                      <input value={editingEntry.name} onChange={(e) => setEditingEntry({ ...editingEntry, name: e.target.value })} className={inputClass} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClass}>Level</label>
                        <select value={editingEntry.level} onChange={(e) => setEditingEntry({ ...editingEntry, level: e.target.value })} className={inputClass}>
                          {levels.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className={labelClass}>Sock</label>
                        <input value={editingEntry.sock} onChange={(e) => setEditingEntry({ ...editingEntry, sock: e.target.value })} className={inputClass} />
                      </div>
                    </div>
                  </>
                )}

                {/* Glossary edit fields */}
                {editEntityType === "glossary" && (
                  <>
                    <div>
                      <label className={labelClass}>Term Name</label>
                      <input value={editingEntry.name} onChange={(e) => setEditingEntry({ ...editingEntry, name: e.target.value })} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Difficulty</label>
                      <select value={editingEntry.difficulty} onChange={(e) => setEditingEntry({ ...editingEntry, difficulty: e.target.value })} className={inputClass}>
                        {["Beginner", "Intermediate", "Advanced", "Expert", "Experimental"].map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelClass}>Description</label>
                      <textarea value={editingEntry.description} onChange={(e) => setEditingEntry({ ...editingEntry, description: e.target.value })} rows={4} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Video URL</label>
                      <input value={editingEntry.videoURL} onChange={(e) => setEditingEntry({ ...editingEntry, videoURL: e.target.value })} className={inputClass} />
                    </div>
                  </>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3 rounded-lg bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50 font-medium hover:bg-[#fff67b]/30 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Edit for Review"}
                </button>
              </div>
            </form>
          )}
        </div>
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
