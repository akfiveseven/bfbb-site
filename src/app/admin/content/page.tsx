"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

interface Strategy {
  id: number;
  name: string;
  spatulas: string[];
  level: string;
  description: string;
}

interface Method {
  id: number;
  name: string;
  strat: string;
  difficulty: string;
  description: string;
  videoURLs: string[];
  prerequisites: string[];
  hans: string;
  obsolete: boolean;
}

interface Sock {
  id: number;
  name: string;
  area: string | null;
  level: string;
  min_spat_requirement: number;
}

interface Spatula {
  id: number;
  pos: number;
  name: string;
  level: string;
  min_spatula_requirement: number;
}

interface Guide {
  id: number;
  name: string;
  difficulty: string;
  category: string;
  link: string;
}

interface GlossaryEntry {
  id: number;
  name: string;
  difficulty: string;
  description: string;
  videoURL: string;
}

interface SockStrategy {
  id: number;
  name: string;
  sock: string;
  level: string;
}

interface PublishedRoute {
  id: string;
  name: string;
  category: string | null;
  updatedAt: string;
  author: { name: string | null; image: string | null };
}

export default function AdminContent() {
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [methods, setMethods] = useState<Method[]>([]);
  const [socks, setSocks] = useState<Sock[]>([]);
  const [spatulas, setSpatulas] = useState<Spatula[]>([]);
  const [guides, setGuides] = useState<Guide[]>([]);
  const [glossary, setGlossary] = useState<GlossaryEntry[]>([]);
  const [sockStrategies, setSockStrategies] = useState<SockStrategy[]>([]);
  const [publishedRoutes, setPublishedRoutes] = useState<PublishedRoute[]>([]);
  const [tab, setTab] = useState<"strategies" | "methods" | "socks" | "spatulas" | "guides" | "glossary" | "sockStrategies" | "routes">("strategies");
  const [editingStrat, setEditingStrat] = useState<Strategy | null>(null);
  const [editingMethod, setEditingMethod] = useState<Method | null>(null);
  const [editingSock, setEditingSock] = useState<Sock | null>(null);
  const [editingSpatula, setEditingSpatula] = useState<Spatula | null>(null);
  const [editingGuide, setEditingGuide] = useState<Guide | null>(null);
  const [editingGlossary, setEditingGlossary] = useState<GlossaryEntry | null>(null);
  const [editingSockStrat, setEditingSockStrat] = useState<SockStrategy | null>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    axios.get("/api/admin/content/strategies").then((res) => setStrategies(res.data));
    axios.get("/api/admin/content/methods").then((res) => setMethods(res.data));
    axios.get("/api/admin/content/socks").then((res) => setSocks(res.data));
    axios.get("/api/admin/content/spatulas").then((res) => setSpatulas(res.data));
    axios.get("/api/admin/content/guides").then((res) => setGuides(res.data));
    axios.get("/api/admin/content/glossary").then((res) => setGlossary(res.data));
    axios.get("/api/admin/content/sockStrategies").then((res) => setSockStrategies(res.data));
    axios.get("/api/routes/published").then((res) => setPublishedRoutes(res.data));
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

  const saveSock = async () => {
    if (!editingSock) return;
    await axios.put("/api/admin/content/socks", editingSock);
    setSocks((prev) =>
      prev.map((s) => (s.id === editingSock.id ? editingSock : s))
    );
    setEditingSock(null);
  };

  const deleteSock = async (id: number) => {
    await axios.delete(`/api/admin/content/socks/${id}`);
    setSocks((prev) => prev.filter((s) => s.id !== id));
  };

  const saveSpatula = async () => {
    if (!editingSpatula) return;
    await axios.put("/api/admin/content/spatulas", editingSpatula);
    setSpatulas((prev) =>
      prev.map((s) => (s.id === editingSpatula.id ? editingSpatula : s))
    );
    setEditingSpatula(null);
  };

  const deleteSpatula = async (id: number) => {
    await axios.delete(`/api/admin/content/spatulas/${id}`);
    setSpatulas((prev) => prev.filter((s) => s.id !== id));
  };

  const saveGuide = async () => {
    if (!editingGuide) return;
    await axios.put("/api/admin/content/guides", editingGuide);
    setGuides((prev) =>
      prev.map((g) => (g.id === editingGuide.id ? editingGuide : g))
    );
    setEditingGuide(null);
  };

  const deleteGuide = async (id: number) => {
    await axios.delete(`/api/admin/content/guides/${id}`);
    setGuides((prev) => prev.filter((g) => g.id !== id));
  };

  const saveGlossary = async () => {
    if (!editingGlossary) return;
    await axios.put("/api/admin/content/glossary", editingGlossary);
    setGlossary((prev) =>
      prev.map((g) => (g.id === editingGlossary.id ? editingGlossary : g))
    );
    setEditingGlossary(null);
  };

  const deleteGlossary = async (id: number) => {
    await axios.delete(`/api/admin/content/glossary/${id}`);
    setGlossary((prev) => prev.filter((g) => g.id !== id));
  };

  const saveSockStrategy = async () => {
    if (!editingSockStrat) return;
    await axios.put("/api/admin/content/sockStrategies", editingSockStrat);
    setSockStrategies((prev) =>
      prev.map((s) => (s.id === editingSockStrat.id ? editingSockStrat : s))
    );
    setEditingSockStrat(null);
  };

  const deleteSockStrategy = async (id: number) => {
    await axios.delete(`/api/admin/content/sockStrategies/${id}`);
    setSockStrategies((prev) => prev.filter((s) => s.id !== id));
  };

  const unpublishRoute = async (id: string) => {
    await axios.patch(`/api/routes/${id}/publish`);
    setPublishedRoutes((prev) => prev.filter((r) => r.id !== id));
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

  const filteredSocks = socks.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.level.toLowerCase().includes(search.toLowerCase()) ||
      (s.area && s.area.toLowerCase().includes(search.toLowerCase()))
  );

  const filteredSpatulas = spatulas.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.level.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGuides = guides.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGlossary = glossary.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.description.toLowerCase().includes(search.toLowerCase())
  );

  const filteredSockStrategies = sockStrategies.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.sock.toLowerCase().includes(search.toLowerCase()) ||
      s.level.toLowerCase().includes(search.toLowerCase())
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
          <button
            onClick={() => setTab("socks")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === "socks"
                ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
                : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
            }`}
          >
            Socks ({socks.length})
          </button>
          <button
            onClick={() => setTab("spatulas")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === "spatulas"
                ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
                : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
            }`}
          >
            Spatulas ({spatulas.length})
          </button>
          <button
            onClick={() => setTab("guides")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === "guides"
                ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
                : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
            }`}
          >
            Guides ({guides.length})
          </button>
          <button
            onClick={() => setTab("glossary")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === "glossary"
                ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
                : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
            }`}
          >
            Glossary ({glossary.length})
          </button>
          <button
            onClick={() => setTab("sockStrategies")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === "sockStrategies"
                ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
                : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
            }`}
          >
            Sock Strats ({sockStrategies.length})
          </button>
          <button
            onClick={() => setTab("routes")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
              tab === "routes"
                ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
                : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
            }`}
          >
            Routes ({publishedRoutes.length})
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
                  <div className="space-y-2">
                    <input
                      value={editingStrat.level}
                      onChange={(e) =>
                        setEditingStrat({ ...editingStrat, level: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Level"
                    />
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">Spatulas</label>
                      {editingStrat.spatulas.map((spat, i) => (
                        <div key={i} className="flex gap-1">
                          <input
                            value={spat}
                            onChange={(e) => {
                              const updated = [...editingStrat.spatulas];
                              updated[i] = e.target.value;
                              setEditingStrat({ ...editingStrat, spatulas: updated });
                            }}
                            className={inputClass}
                            placeholder="e.g. On Top of the Pineapple"
                          />
                          <button
                            onClick={() => {
                              const updated = editingStrat.spatulas.filter((_, j) => j !== i);
                              setEditingStrat({ ...editingStrat, spatulas: updated });
                            }}
                            className="px-2 text-red-400 hover:text-red-300 cursor-pointer text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setEditingStrat({ ...editingStrat, spatulas: [...editingStrat.spatulas, ""] })
                        }
                        className="text-xs text-[#fff67b] hover:underline cursor-pointer"
                      >
                        + Add spatula
                      </button>
                    </div>
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
                      {strat.level} — {strat.spatulas.filter(s => s !== "N/A").join(", ") || "General"}
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
                    <select
                      value={editingMethod.difficulty}
                      onChange={(e) =>
                        setEditingMethod({
                          ...editingMethod,
                          difficulty: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      {["Beginner", "Intermediate", "Advanced", "Expert", "Experimental"].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
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
                  <div className="space-y-1">
                    <label className="text-xs text-gray-400">Video URLs</label>
                    {editingMethod.videoURLs.map((url, i) => (
                      <div key={i} className="flex gap-1">
                        <input
                          value={url}
                          onChange={(e) => {
                            const updated = [...editingMethod.videoURLs];
                            updated[i] = e.target.value;
                            setEditingMethod({ ...editingMethod, videoURLs: updated });
                          }}
                          className={inputClass}
                          placeholder="https://..."
                        />
                        <button
                          onClick={() => {
                            const updated = editingMethod.videoURLs.filter((_, j) => j !== i);
                            setEditingMethod({ ...editingMethod, videoURLs: updated });
                          }}
                          className="px-2 text-red-400 hover:text-red-300 cursor-pointer text-sm"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() =>
                        setEditingMethod({ ...editingMethod, videoURLs: [...editingMethod.videoURLs, ""] })
                      }
                      className="text-xs text-[#fff67b] hover:underline cursor-pointer"
                    >
                      + Add video URL
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-xs text-gray-400">Prerequisites</label>
                      {editingMethod.prerequisites.map((prereq, i) => (
                        <div key={i} className="flex gap-1">
                          <input
                            value={prereq}
                            onChange={(e) => {
                              const updated = [...editingMethod.prerequisites];
                              updated[i] = e.target.value;
                              setEditingMethod({ ...editingMethod, prerequisites: updated });
                            }}
                            className={inputClass}
                            placeholder="e.g. Bubble Bowl"
                          />
                          <button
                            onClick={() => {
                              const updated = editingMethod.prerequisites.filter((_, j) => j !== i);
                              setEditingMethod({ ...editingMethod, prerequisites: updated });
                            }}
                            className="px-2 text-red-400 hover:text-red-300 cursor-pointer text-sm"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() =>
                          setEditingMethod({ ...editingMethod, prerequisites: [...editingMethod.prerequisites, ""] })
                        }
                        className="text-xs text-[#fff67b] hover:underline cursor-pointer"
                      >
                        + Add prerequisite
                      </button>
                    </div>
                    <select
                      value={editingMethod.hans}
                      onChange={(e) =>
                        setEditingMethod({ ...editingMethod, hans: e.target.value })
                      }
                      className={inputClass}
                    >
                      <option value="N/A">Hans: N/A</option>
                      <option value="Enabled">Hans: Enabled</option>
                      <option value="Disabled">Hans: Disabled</option>
                    </select>
                    <label className="flex items-center gap-2 text-xs text-gray-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={editingMethod.obsolete}
                        onChange={(e) =>
                          setEditingMethod({ ...editingMethod, obsolete: e.target.checked })
                        }
                      />
                      Obsolete
                    </label>
                  </div>
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
                    {method.obsolete && (
                      <span className="text-xs text-red-400 ml-2 font-semibold">Obsolete</span>
                    )}
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

        {/* Spatulas */}
        {tab === "spatulas" && (
          <div className="space-y-2">
            {filteredSpatulas.map((spatula) =>
              editingSpatula?.id === spatula.id ? (
                <div
                  key={spatula.id}
                  className="container-bg rounded-lg p-4 border border-[#fff67b]/50 space-y-2"
                >
                  <input
                    value={editingSpatula.name}
                    onChange={(e) =>
                      setEditingSpatula({ ...editingSpatula, name: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Name"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      value={editingSpatula.level}
                      onChange={(e) =>
                        setEditingSpatula({ ...editingSpatula, level: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Level"
                    />
                    <input
                      type="number"
                      value={editingSpatula.pos}
                      onChange={(e) =>
                        setEditingSpatula({
                          ...editingSpatula,
                          pos: parseInt(e.target.value) || 0,
                        })
                      }
                      className={inputClass}
                      placeholder="Position"
                    />
                    <input
                      type="number"
                      value={editingSpatula.min_spatula_requirement}
                      onChange={(e) =>
                        setEditingSpatula({
                          ...editingSpatula,
                          min_spatula_requirement: parseInt(e.target.value) || 0,
                        })
                      }
                      className={inputClass}
                      placeholder="Min spatulas"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={saveSpatula}
                      className="px-3 py-1 rounded text-xs bg-green-600/20 text-green-400 border border-green-600/50 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSpatula(null)}
                      className="px-3 py-1 rounded text-xs text-gray-400 border border-gray-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={spatula.id}
                  className="container-bg rounded-lg p-3 flex items-center justify-between border border-transparent hover:border-blue-700"
                >
                  <div>
                    <span className="text-sm font-semibold text-white">
                      {spatula.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {spatula.level} — Pos: {spatula.pos} — Min: {spatula.min_spatula_requirement}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingSpatula(spatula)}
                      className="px-2 py-1 rounded text-xs text-[#fff67b] border border-[#fff67b]/30 hover:bg-[#fff67b]/10 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSpatula(spatula.id)}
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

        {/* Socks */}
        {tab === "socks" && (
          <div className="space-y-2">
            {filteredSocks.map((sock) =>
              editingSock?.id === sock.id ? (
                <div
                  key={sock.id}
                  className="container-bg rounded-lg p-4 border border-[#fff67b]/50 space-y-2"
                >
                  <input
                    value={editingSock.name}
                    onChange={(e) =>
                      setEditingSock({ ...editingSock, name: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Name"
                  />
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      value={editingSock.level}
                      onChange={(e) =>
                        setEditingSock({ ...editingSock, level: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Level"
                    />
                    <input
                      value={editingSock.area ?? ""}
                      onChange={(e) =>
                        setEditingSock({ ...editingSock, area: e.target.value || null })
                      }
                      className={inputClass}
                      placeholder="Area"
                    />
                    <input
                      type="number"
                      value={editingSock.min_spat_requirement}
                      onChange={(e) =>
                        setEditingSock({
                          ...editingSock,
                          min_spat_requirement: parseInt(e.target.value) || 0,
                        })
                      }
                      className={inputClass}
                      placeholder="Min spatulas"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={saveSock}
                      className="px-3 py-1 rounded text-xs bg-green-600/20 text-green-400 border border-green-600/50 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSock(null)}
                      className="px-3 py-1 rounded text-xs text-gray-400 border border-gray-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={sock.id}
                  className="container-bg rounded-lg p-3 flex items-center justify-between border border-transparent hover:border-blue-700"
                >
                  <div>
                    <span className="text-sm font-semibold text-white">
                      {sock.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {sock.level}{sock.area ? ` — ${sock.area}` : ""} — Min: {sock.min_spat_requirement}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingSock(sock)}
                      className="px-2 py-1 rounded text-xs text-[#fff67b] border border-[#fff67b]/30 hover:bg-[#fff67b]/10 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSock(sock.id)}
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

        {/* Guides */}
        {tab === "guides" && (
          <div className="space-y-2">
            {filteredGuides.map((guide) =>
              editingGuide?.id === guide.id ? (
                <div
                  key={guide.id}
                  className="container-bg rounded-lg p-4 border border-[#fff67b]/50 space-y-2"
                >
                  <input
                    value={editingGuide.name}
                    onChange={(e) =>
                      setEditingGuide({ ...editingGuide, name: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Name"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={editingGuide.difficulty}
                      onChange={(e) =>
                        setEditingGuide({ ...editingGuide, difficulty: e.target.value })
                      }
                      className={inputClass}
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                      <option value="Expert">Expert</option>
                      <option value="Experimental">Experimental</option>
                    </select>
                    <input
                      value={editingGuide.category}
                      onChange={(e) =>
                        setEditingGuide({ ...editingGuide, category: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Category"
                    />
                  </div>
                  <input
                    value={editingGuide.link}
                    onChange={(e) =>
                      setEditingGuide({ ...editingGuide, link: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Link URL"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveGuide}
                      className="px-3 py-1 rounded text-xs bg-green-600/20 text-green-400 border border-green-600/50 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingGuide(null)}
                      className="px-3 py-1 rounded text-xs text-gray-400 border border-gray-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={guide.id}
                  className="container-bg rounded-lg p-3 flex items-center justify-between border border-transparent hover:border-blue-700"
                >
                  <div>
                    <span className="text-sm font-semibold text-white">
                      {guide.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {guide.category || "No category"} — {guide.difficulty}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingGuide(guide)}
                      className="px-2 py-1 rounded text-xs text-[#fff67b] border border-[#fff67b]/30 hover:bg-[#fff67b]/10 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteGuide(guide.id)}
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

        {/* Glossary */}
        {tab === "glossary" && (
          <div className="space-y-2">
            {filteredGlossary.map((entry) =>
              editingGlossary?.id === entry.id ? (
                <div
                  key={entry.id}
                  className="container-bg rounded-lg p-4 border border-[#fff67b]/50 space-y-2"
                >
                  <input
                    value={editingGlossary.name}
                    onChange={(e) =>
                      setEditingGlossary({ ...editingGlossary, name: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Term name"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={editingGlossary.difficulty}
                      onChange={(e) =>
                        setEditingGlossary({
                          ...editingGlossary,
                          difficulty: e.target.value,
                        })
                      }
                      className={inputClass}
                    >
                      {["Beginner", "Intermediate", "Advanced", "Expert", "Experimental"].map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <input
                      value={editingGlossary.videoURL}
                      onChange={(e) =>
                        setEditingGlossary({ ...editingGlossary, videoURL: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Video URL"
                    />
                  </div>
                  <textarea
                    value={editingGlossary.description}
                    onChange={(e) =>
                      setEditingGlossary({
                        ...editingGlossary,
                        description: e.target.value,
                      })
                    }
                    className={inputClass}
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={saveGlossary}
                      className="px-3 py-1 rounded text-xs bg-green-600/20 text-green-400 border border-green-600/50 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingGlossary(null)}
                      className="px-3 py-1 rounded text-xs text-gray-400 border border-gray-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={entry.id}
                  className="container-bg rounded-lg p-3 flex items-center justify-between border border-transparent hover:border-blue-700"
                >
                  <div>
                    <span className="text-sm font-semibold text-white">
                      {entry.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      Difficulty: {entry.difficulty}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingGlossary(entry)}
                      className="px-2 py-1 rounded text-xs text-[#fff67b] border border-[#fff67b]/30 hover:bg-[#fff67b]/10 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteGlossary(entry.id)}
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

        {/* Sock Strategies */}
        {tab === "sockStrategies" && (
          <div className="space-y-2">
            {filteredSockStrategies.map((ss) =>
              editingSockStrat?.id === ss.id ? (
                <div
                  key={ss.id}
                  className="container-bg rounded-lg p-4 border border-[#fff67b]/50 space-y-2"
                >
                  <input
                    value={editingSockStrat.name}
                    onChange={(e) =>
                      setEditingSockStrat({ ...editingSockStrat, name: e.target.value })
                    }
                    className={inputClass}
                    placeholder="Name"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      value={editingSockStrat.sock}
                      onChange={(e) =>
                        setEditingSockStrat({ ...editingSockStrat, sock: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Sock"
                    />
                    <input
                      value={editingSockStrat.level}
                      onChange={(e) =>
                        setEditingSockStrat({ ...editingSockStrat, level: e.target.value })
                      }
                      className={inputClass}
                      placeholder="Level"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={saveSockStrategy}
                      className="px-3 py-1 rounded text-xs bg-green-600/20 text-green-400 border border-green-600/50 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingSockStrat(null)}
                      className="px-3 py-1 rounded text-xs text-gray-400 border border-gray-600 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={ss.id}
                  className="container-bg rounded-lg p-3 flex items-center justify-between border border-transparent hover:border-blue-700"
                >
                  <div>
                    <span className="text-sm font-semibold text-white">
                      {ss.name}
                    </span>
                    <span className="text-xs text-gray-400 ml-2">
                      {ss.level} — {ss.sock}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setEditingSockStrat(ss)}
                      className="px-2 py-1 rounded text-xs text-[#fff67b] border border-[#fff67b]/30 hover:bg-[#fff67b]/10 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteSockStrategy(ss.id)}
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

        {/* Published Routes */}
        {tab === "routes" && (
          <div className="space-y-2">
            {publishedRoutes.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">No published routes.</p>
            ) : (
              publishedRoutes.map((route) => (
                <div
                  key={route.id}
                  className="container-bg rounded-lg p-3 flex items-center justify-between border border-transparent hover:border-blue-700"
                >
                  <div className="flex items-center gap-3">
                    {route.author.image && (
                      <Image
                        src={route.author.image}
                        alt={route.author.name ?? "User"}
                        width={24}
                        height={24}
                        className="rounded-full"
                      />
                    )}
                    <div>
                      <span className="text-sm font-semibold text-white">
                        {route.name}
                      </span>
                      <span className="text-xs text-gray-400 ml-2">
                        by {route.author.name ?? "Unknown"}
                        {route.category && ` — ${route.category}`}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => unpublishRoute(route.id)}
                    className="px-2 py-1 rounded text-xs text-red-400 border border-red-500/30 hover:bg-red-500/10 cursor-pointer"
                  >
                    Unpublish
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
