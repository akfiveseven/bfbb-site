"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface Strategy {
  id: number;
  name: string;
  spatula: string;
  level: string;
  prerequisites: string[];
  hans: string;
  description: string;
  links: string[];
}

interface Method {
  id: number;
  name: string;
  strat: string;
  difficulty: string;
  description: string;
  videoURL: string;
}

export default function AdminContent() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [methods, setMethods] = useState<Method[]>([]);
  const [tab, setTab] = useState<"strategies" | "methods">("strategies");
  const [editingStrat, setEditingStrat] = useState<Strategy | null>(null);
  const [editingMethod, setEditingMethod] = useState<Method | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("/api/admin/content/strategies").then((res) => setStrategies(res.data));
    axios.get("/api/admin/content/methods").then((res) => setMethods(res.data));
  }, []);

  const saveStrategy = async () => {
    if (!editingStrat) return;
    await axios.put("/api/admin/content/strategies", editingStrat);
    setStrategies((prev) =>
      prev.map((s) => (s.id === editingStrat.id ? editingStrat : s))
    );
    setEditingStrat(null);
  };

  const saveMethod = async () => {
    if (!editingMethod) return;
    await axios.put("/api/admin/content/methods", editingMethod);
    setMethods((prev) =>
      prev.map((m) => (m.id === editingMethod.id ? editingMethod : m))
    );
    setEditingMethod(null);
  };

  const deleteStrategy = async (id: number) => {
    await axios.delete(`/api/admin/content/strategies/${id}`);
    setStrategies((prev) => prev.filter((s) => s.id !== id));
  };

  const deleteMethod = async (id: number) => {
    await axios.delete(`/api/admin/content/methods/${id}`);
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const inputClass =
    "w-full px-2 py-1 rounded bg-blue-950/60 border border-blue-700 text-white text-xs focus:outline-none focus:border-[#fff67b]";

  const filteredStrategies = strategies.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.level.toLowerCase().includes(search.toLowerCase())
  );

  const filteredMethods = methods.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.strat.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-[calc(100vh-6rem)] p-4 sm:p-8 font-bob">
      <h1 className="text-2xl sm:text-4xl font-bold text-yellow text-center mb-6">
        Content Management
      </h1>

      <div className="max-w-5xl mx-auto">
        {/* Tab Toggle */}
        <div className="flex justify-center gap-2 mb-4">
          <button
            onClick={() => setTab("strategies")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === "strategies"
                ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
                : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
            }`}
          >
            Strategies ({strategies.length})
          </button>
          <button
            onClick={() => setTab("methods")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === "methods"
                ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
                : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
            }`}
          >
            Methods ({methods.length})
          </button>
        </div>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-blue-950/60 border border-blue-700 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#fff67b] mb-4"
        />

        {/* Strategies */}
        {tab === "strategies" && (
          <div className="space-y-2">
            {filteredStrategies.map((strat) =>
              editingStrat?.id === strat.id ? (
                <div
                  key={strat.id}
                  className="container-bg rounded-lg p-4 border border-[#fff67b]/50 space-y-2"
                >
                  <input
                    value={editingStrat.name}
                    onChange={(e) =>
                      setEditingStrat({ ...editingStrat, name: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Name"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={editingStrat.level}
                      onChange={(e) =>
                        setEditingStrat({ ...editingStrat, level: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Level"
                    />
                    <input
                      value={editingStrat.spatula}
                      onChange={(e) =>
                        setEditingStrat({ ...editingStrat, spatula: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Spatula"
                    />
                  </div>
                  <textarea
                    value={editingStrat.description}
                    onChange={(e) =>
                      setEditingStrat({
                        ...editingStrat,
                        description: e.target.value,
                      })
                    }
                    className={inputClass}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveStrategy}
                      className="px-3 py-1 rounded text-xs bg-green-600/20 text-green-400 border border-green-600/50 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingStrat(null)}
                      className="px-3 py-1 rounded text-xs text-gray-400 border border-gray-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={strat.id}
                  className="container-bg rounded-lg p-3 flex items-center justify-between border border-transparent hover:border-blue-700"
                >
                  <div>
                    <span className="text-sm font-semibold text-white">
                      {strat.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {strat.level} — {strat.spatula}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingStrat(strat)}
                      className="px-2 py-1 rounded text-xs text-[#fff67b] border border-[#fff67b]/30 hover:bg-[#fff67b]/10 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteStrategy(strat.id)}
                      className="px-2 py-1 rounded text-xs text-red-400 border border-red-500/30 hover:bg-red-500/10 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}

        {/* Methods */}
        {tab === "methods" && (
          <div className="space-y-2">
            {filteredMethods.map((method) =>
              editingMethod?.id === method.id ? (
                <div
                  key={method.id}
                  className="container-bg rounded-lg p-4 border border-[#fff67b]/50 space-y-2"
                >
                  <input
                    value={editingMethod.name}
                    onChange={(e) =>
                      setEditingMethod({ ...editingMethod, name: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Name"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={editingMethod.strat}
                      onChange={(e) =>
                        setEditingMethod({ ...editingMethod, strat: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Strategy"
                    />
                    <input
                      value={editingMethod.difficulty}
                      onChange={(e) =>
                        setEditingMethod({
                          ...editingMethod,
                          difficulty: e.target.value,
                        })
                      }
                      className={inputClass}
                      placeholder="Difficulty"
                    />
                  </div>
                  <textarea
                    value={editingMethod.description}
                    onChange={(e) =>
                      setEditingMethod({
                        ...editingMethod,
                        description: e.target.value,
                      })
                    }
                    className={inputClass}
                    rows={3}
                  />
                  <input
                    value={editingMethod.videoURL}
                    onChange={(e) =>
                      setEditingMethod({ ...editingMethod, videoURL: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Video URL"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveMethod}
                      className="px-3 py-1 rounded text-xs bg-green-600/20 text-green-400 border border-green-600/50 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingMethod(null)}
                      className="px-3 py-1 rounded text-xs text-gray-400 border border-gray-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={method.id}
                  className="container-bg rounded-lg p-3 flex items-center justify-between border border-transparent hover:border-blue-700"
                >
                  <div>
                    <span className="text-sm font-semibold text-white">
                      {method.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {method.strat} — Difficulty: {method.difficulty}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingMethod(method)}
                      className="px-2 py-1 rounded text-xs text-[#fff67b] border border-[#fff67b]/30 hover:bg-[#fff67b]/10 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteMethod(method.id)}
                      className="px-2 py-1 rounded text-xs text-red-400 border border-red-500/30 hover:bg-red-500/10 cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
