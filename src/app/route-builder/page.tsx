"use client";
import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import axios from "axios";

interface Spatula {
  id: number;
  pos: number;
  name: string;
  level: string;
  min_spatula_requirement: number;
}

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

interface Sock {
  id: number;
  name: string;
  area?: string;
  level: string;
  min_spat_requirement: number;
}

interface SpatulaEntry {
  type: "spatula";
  spatula: Spatula;
  strategy: Strategy | null;
}

interface SockEntry {
  type: "sock";
  sock: Sock;
}

type RouteEntry = SpatulaEntry | SockEntry;

interface SavedRouteInfo {
  id: string;
  name: string;
  category: string | null;
  published: boolean;
  updatedAt: string;
}

interface PublishedRoute {
  id: string;
  name: string;
  category: string | null;
  data: { category: string | null; entries: RouteEntry[] } | RouteEntry[];
  updatedAt: string;
  author: { name: string | null; image: string | null };
}

export default function RouteBuilder() {
  const { data: session } = useSession();
  const [spatulaData, setSpatulaData] = useState<Spatula[]>([]);
  const [stratsData, setStratsData] = useState<Strategy[]>([]);
  const [socksData, setSocksData] = useState<Sock[]>([]);
  const [route, setRoute] = useState<RouteEntry[]>([]);
  const [showSpatulaPicker, setShowSpatulaPicker] = useState(false);
  const [showSockPicker, setShowSockPicker] = useState(false);
  const [pickerLevel, setPickerLevel] = useState<string | null>(null);
  const [pickerSearch, setPickerSearch] = useState("");
  const [sockPickerSearch, setSockPickerSearch] = useState("");
  const [stratPickerIndex, setStratPickerIndex] = useState<number | null>(null);

  // Category state
  const [category, setCategory] = useState<string | null>(null);

  // Save/Load state
  const [publishedRoutes, setPublishedRoutes] = useState<PublishedRoute[]>([]);
  const [savedRoutes, setSavedRoutes] = useState<SavedRouteInfo[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [saveName, setSaveName] = useState("");
  const [activeRouteId, setActiveRouteId] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [submitPending, setSubmitPending] = useState(false);

  useEffect(() => {
    axios.get("/api/data/spatulas").then((res) => setSpatulaData(res.data));
    axios.get("/api/data/strategies").then((res) => setStratsData(res.data));
    axios.get("/api/data/socks").then((res) => setSocksData(res.data));
  }, []);

  useEffect(() => {
    axios.get("/api/routes/published").then((res) => setPublishedRoutes(res.data)).catch(() => {});
    if (session) {
      axios.get("/api/routes").then((res) => setSavedRoutes(res.data)).catch(() => {});
    }
  }, [session]);

  const saveRoute = async () => {
    if (!saveName.trim()) return;
    try {
      const saveData = { category, entries: route };
      if (activeRouteId) {
        await axios.put(`/api/routes/${activeRouteId}`, { name: saveName, data: saveData });
        setSavedRoutes((prev) =>
          prev.map((r) => (r.id === activeRouteId ? { ...r, name: saveName, category, updatedAt: new Date().toISOString() } : r))
        );
      } else {
        const res = await axios.post("/api/routes", { name: saveName, data: saveData });
        setActiveRouteId(res.data.id);
        setSavedRoutes((prev) => [{ id: res.data.id, name: saveName, category, published: false, updatedAt: new Date().toISOString() }, ...prev]);
      }
      setSaveMessage("Route saved!");
      setTimeout(() => setSaveMessage(""), 2000);
      setShowSaveModal(false);
    } catch {
      setSaveMessage("Failed to save.");
      setTimeout(() => setSaveMessage(""), 2000);
    }
  };

  const loadRoute = async (id: string) => {
    try {
      const res = await axios.get(`/api/routes/${id}`);
      const loaded = res.data.data;
      // Support both old format (array) and new format ({ category, entries })
      if (Array.isArray(loaded)) {
        setRoute(loaded);
        setCategory(null);
      } else {
        setRoute(loaded.entries || []);
        setCategory(loaded.category || null);
      }
      setActiveRouteId(id);
      setSaveName(res.data.name);
      setShowLoadModal(false);
      setStratPickerIndex(null);
      setShowSpatulaPicker(false);
      setShowSockPicker(false);
    } catch {
      // handled
    }
  };

  const deleteRoute = async (id: string) => {
    try {
      await axios.delete(`/api/routes/${id}`);
      setSavedRoutes((prev) => prev.filter((r) => r.id !== id));
      if (activeRouteId === id) {
        setActiveRouteId(null);
        setSaveName("");
      }
    } catch {
      // handled
    }
  };

  const togglePublish = async () => {
    if (!activeRouteId) return;
    try {
      const res = await axios.patch(`/api/routes/${activeRouteId}/publish`);
      setSavedRoutes((prev) =>
        prev.map((r) => (r.id === activeRouteId ? { ...r, published: res.data.published } : r))
      );
      setSaveMessage(res.data.published ? "Route published!" : "Route unpublished");
      setTimeout(() => setSaveMessage(""), 2000);
      // Refresh published routes list
      axios.get("/api/routes/published").then((r) => setPublishedRoutes(r.data)).catch(() => {});
    } catch {
      // handled
    }
  };

  const submitForPublishing = async () => {
    if (!activeRouteId || route.length === 0) return;
    setSubmitPending(true);
    try {
      await axios.post("/api/submissions", {
        type: "route",
        data: {
          name: saveName || "Untitled Route",
          category,
          routeId: activeRouteId,
          entryCount: route.length,
          routeData: { category, entries: route },
        },
      });
      setSaveMessage("Submitted for review!");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch {
      setSaveMessage("Failed to submit.");
      setTimeout(() => setSaveMessage(""), 2000);
    }
    setSubmitPending(false);
  };

  const loadPublishedRoute = (pub: PublishedRoute) => {
    const data = pub.data;
    if (Array.isArray(data)) {
      setRoute(data);
      setCategory(null);
    } else {
      setRoute(data.entries || []);
      setCategory(data.category || null);
    }
    setActiveRouteId(null);
    setSaveName("");
    setStratPickerIndex(null);
    setShowSpatulaPicker(false);
    setShowSockPicker(false);
  };

  const newRoute = () => {
    setRoute([]);
    setCategory(null);
    setActiveRouteId(null);
    setSaveName("");
    setStratPickerIndex(null);
    setShowSpatulaPicker(false);
    setShowSockPicker(false);
  };

  const levels = [
    "Bikini Bottom", "Jellyfish Fields", "Downtown Bikini Bottom",
    "Goo Lagoon", "Poseidome", "Rock Bottom", "Mermalair",
    "Sand Mountain", "Industrial Park", "Kelp Forest",
    "Flying Dutchman's Graveyard", "SpongeBob's Dream", "Chum Bucket Lab",
    "Mr. Krabs", "Patrick"
  ];

  const spatulaCount = route.filter((e) => e.type === "spatula").length;

  const addSpatula = (spatula: Spatula) => {
    setRoute([...route, { type: "spatula", spatula, strategy: null }]);
    setShowSpatulaPicker(false);
    setShowSockPicker(false);
    setPickerLevel(spatula.level);
    setPickerSearch("");
  };

  const addSock = (sock: Sock) => {
    setRoute([...route, { type: "sock", sock }]);
    setShowSockPicker(false);
    setShowSpatulaPicker(false);
    setSockPickerSearch("");
  };

  const setStrategy = (index: number, strategy: Strategy) => {
    const updated = [...route];
    const entry = updated[index];
    if (entry.type === "spatula") {
      updated[index] = { ...entry, strategy };
      setRoute(updated);
    }
    setStratPickerIndex(null);
  };

  const removeEntry = (index: number) => {
    setRoute(route.filter((_, i) => i !== index));
    if (stratPickerIndex === index) setStratPickerIndex(null);
  };

  const moveEntry = (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= route.length) return;
    const updated = [...route];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    setRoute(updated);
  };

  const getStratsForSpatula = (spatula: Spatula) => {
    return stratsData.filter(
      (s) => s.spatula === spatula.name && s.level === spatula.level
    );
  };

  const closePickers = () => {
    setShowSpatulaPicker(false);
    setShowSockPicker(false);
  };

  const usedSpatulaIds = new Set(route.filter((e) => e.type === "spatula").map((e) => (e as SpatulaEntry).spatula.id));
  const usedSockIds = new Set(route.filter((e) => e.type === "sock").map((e) => (e as SockEntry).sock.id));
  const sockCount = route.filter((e) => e.type === "sock").length;

  const filteredSpatulas = spatulaData.filter((s) => {
    if (usedSpatulaIds.has(s.id)) return false;
    if (s.min_spatula_requirement > spatulaCount) return false;
    if (s.level === "Patrick") {
      const requiredSocks = s.pos * 10;
      if (sockCount < requiredSocks) return false;
    }
    if (pickerLevel && s.level !== pickerLevel) return false;
    if (pickerSearch) {
      const q = pickerSearch.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.level.toLowerCase().includes(q);
    }
    return true;
  });

  const groupedSpatulas: Record<string, Spatula[]> = {};
  filteredSpatulas.forEach((s) => {
    if (!groupedSpatulas[s.level]) groupedSpatulas[s.level] = [];
    groupedSpatulas[s.level].push(s);
  });

  const pickerOpen = showSpatulaPicker || showSockPicker;

  // Picker content (shared between desktop sidebar and mobile modal)
  const pickerContent = (
    <>
      {/* Spatula Picker */}
      {(showSpatulaPicker || (!showSpatulaPicker && !showSockPicker)) && (
        <>
          <h3 className="text-xl lg:text-2xl font-bold text-yellow mb-3 text-center">Pick a Spatula</h3>

          <input
            type="text"
            placeholder="Search spatulas..."
            value={pickerSearch}
            onChange={(e) => setPickerSearch(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-blue-950/60 border border-blue-700 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#fff67b] transition-colors duration-200 mb-3"
          />

          <div className="flex flex-wrap gap-1 mb-3">
            <button
              onClick={() => setPickerLevel(null)}
              className={`text-xs px-2 py-1 rounded cursor-pointer transition-colors duration-200 ${
                !pickerLevel
                  ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
                  : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
              }`}
            >
              All
            </button>
            {levels.map((level) => (
              <button
                key={level}
                onClick={() => setPickerLevel(pickerLevel === level ? null : level)}
                className={`text-xs px-2 py-1 rounded cursor-pointer transition-colors duration-200 ${
                  pickerLevel === level
                    ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
                    : "text-gray-400 border border-gray-600 hover:border-[#fff67b]"
                }`}
              >
                {level}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto min-h-0 space-y-1">
            {Object.entries(groupedSpatulas).map(([level, spatulas]) => (
              <div key={level}>
                <p className="text-xs text-gray-400 font-semibold mt-2 mb-1 sticky top-0 bg-[rgba(1,0,72,0.95)] py-1 px-1 rounded">
                  {level}
                </p>
                {spatulas.map((spatula) => (
                  <button
                    key={spatula.id}
                    onClick={() => addSpatula(spatula)}
                    className="w-full text-left px-3 py-2 rounded-md text-sm text-white hover:bg-blue-900/60 hover:border-[#fff67b] border border-transparent transition-colors duration-200 cursor-pointer flex items-center gap-2"
                  >
                    <Image
                      src="/assets/spatula_golden_straight.png"
                      alt=""
                      width={20}
                      height={20}
                      className="flex-shrink-0"
                    />
                    {spatula.name}
                  </button>
                ))}
              </div>
            ))}
            {filteredSpatulas.length === 0 && (
              <p className="text-gray-500 text-sm text-center py-4">No spatulas match your search.</p>
            )}
          </div>
        </>
      )}

      {/* Sock Picker */}
      {showSockPicker && (() => {
        const availableSocks = socksData.filter((sock) => {
          if (usedSockIds.has(sock.id)) return false;
          if (sock.min_spat_requirement > spatulaCount) return false;
          if (sockPickerSearch) {
            const q = sockPickerSearch.toLowerCase();
            return sock.name.toLowerCase().includes(q) || sock.level.toLowerCase().includes(q);
          }
          return true;
        });

        const groupedSocks: Record<string, Sock[]> = {};
        availableSocks.forEach((s) => {
          if (!groupedSocks[s.level]) groupedSocks[s.level] = [];
          groupedSocks[s.level].push(s);
        });

        return (
          <>
            <h3 className="text-xl lg:text-2xl font-bold text-purple-300 mb-3 text-center">Pick a Sock</h3>

            <input
              type="text"
              placeholder="Search socks..."
              value={sockPickerSearch}
              onChange={(e) => setSockPickerSearch(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-blue-950/60 border border-purple-700 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-purple-400 transition-colors duration-200 mb-3"
            />

            <p className="text-xs text-gray-400 mb-3">
              Showing socks requiring ≤ <span className="text-yellow font-semibold">{spatulaCount}</span> spatulas
            </p>

            <div className="flex-1 overflow-y-auto min-h-0 space-y-1">
              {Object.entries(groupedSocks).map(([level, socks]) => (
                <div key={level}>
                  <p className="text-xs text-gray-400 font-semibold mt-2 mb-1 sticky top-0 bg-[rgba(1,0,72,0.95)] py-1 px-1 rounded">
                    {level}
                  </p>
                  {socks.map((sock) => (
                    <button
                      key={sock.id}
                      onClick={() => addSock(sock)}
                      className="w-full text-left px-3 py-2 rounded-md text-sm text-white hover:bg-purple-900/40 hover:border-purple-400 border border-transparent transition-colors duration-200 cursor-pointer flex items-center gap-2"
                    >
                      <Image
                        src="/assets/pat_sock.png"
                        alt=""
                        width={48}
                        height={48}
                        className="flex-shrink-0"
                      />
                      <span className="flex-1">{sock.name}</span>
                      {sock.min_spat_requirement > 0 && (
                        <span className="text-xs text-gray-500">{sock.min_spat_requirement} spats</span>
                      )}
                    </button>
                  ))}
                </div>
              ))}
              {availableSocks.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-4">No socks available at your current spatula count.</p>
              )}
            </div>
          </>
        );
      })()}
    </>
  );

  const categories = ["Any%", "100%", "Custom"];

  if (!category) {
    return (
      <div className="h-[calc(100vh-6rem)] flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center p-4 font-bob">
          <h1 className="text-2xl sm:text-4xl font-bold text-yellow mb-2">Route Builder</h1>
          <p className="text-gray-300 text-sm mb-8">Select a category to get started</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className="py-4 px-6 rounded-lg container-bg border border-blue-700 hover:border-[#fff67b] text-white text-lg font-medium transition-colors cursor-pointer"
              >
                {cat}
              </button>
            ))}
          </div>
          {publishedRoutes.length > 0 && (
            <div className="mt-8 w-full max-w-md">
              <p className="text-gray-400 text-sm text-center mb-3">Community Presets</p>
              <div className="space-y-2">
                {publishedRoutes.map((pub) => (
                  <button
                    key={pub.id}
                    onClick={() => loadPublishedRoute(pub)}
                    className="w-full container-bg rounded-lg p-3 border border-blue-700 hover:border-[#fff67b] transition-colors cursor-pointer text-left flex items-center gap-3"
                  >
                    {pub.author.image && (
                      <Image
                        src={pub.author.image}
                        alt={pub.author.name ?? ""}
                        width={24}
                        height={24}
                        className="rounded-full flex-shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate">{pub.name}</div>
                      <div className="text-xs text-gray-400">
                        {pub.author.name}
                        {pub.category && <span className="ml-2 text-gray-500">{pub.category}</span>}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {session && savedRoutes.length > 0 && (
            <div className="mt-6 w-full max-w-md">
              <p className="text-gray-400 text-sm text-center mb-3">Your Saved Routes</p>
              <button
                onClick={() => setShowLoadModal(true)}
                className="w-full py-3 rounded-lg border-2 border-dashed border-[#fff67b]/50 text-[#fff67b] hover:bg-[#fff67b]/10 cursor-pointer text-sm"
              >
                Load Saved Route
              </button>
            </div>
          )}

          {/* Load Modal */}
          {showLoadModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              <div className="absolute inset-0 bg-black/60" onClick={() => setShowLoadModal(false)} />
              <div className="relative container-bg rounded-lg p-6 w-full max-w-md max-h-[70vh] flex flex-col">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-yellow">Load Route</h3>
                  <button
                    onClick={() => setShowLoadModal(false)}
                    className="text-gray-400 hover:text-white text-xl cursor-pointer"
                  >
                    ×
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                  {savedRoutes.map((r) => (
                    <div
                      key={r.id}
                      className="rounded-lg p-3 flex items-center justify-between border border-blue-700 hover:border-[#fff67b]/30"
                    >
                      <button
                        onClick={() => loadRoute(r.id)}
                        className="flex-1 text-left cursor-pointer"
                      >
                        <div className="text-sm font-semibold text-white">{r.name}{r.category && <span className="ml-2 text-xs font-normal text-gray-400">{r.category}</span>}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(r.updatedAt).toLocaleDateString()}
                        </div>
                      </button>
                      <button
                        onClick={() => deleteRoute(r.id)}
                        className="text-gray-500 hover:text-red-400 text-lg px-2 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-6rem)] flex flex-col">
      <main className="flex-1 flex flex-col p-3 sm:p-4 font-bob min-h-0">
        {/* Header */}
        <div className="flex justify-between items-center mb-2 flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-4">
            <h1 className="text-xl sm:text-2xl font-bold text-yellow">Route Builder</h1>
            <span className="text-xs px-2 py-1 rounded-md border border-[#fff67b]/30 text-[#fff67b]">{category}</span>
            {session && (
              <div className="flex items-center gap-1 sm:gap-2">
                <button
                  onClick={() => { setSaveName(saveName || ""); setShowSaveModal(true); }}
                  className="px-2 sm:px-3 py-1 rounded-md text-xs font-medium border border-[#fff67b]/30 text-[#fff67b] hover:bg-[#fff67b]/10 cursor-pointer"
                >
                  Save
                </button>
                <button
                  onClick={() => setShowLoadModal(true)}
                  className="px-2 sm:px-3 py-1 rounded-md text-xs font-medium border border-gray-600 text-gray-300 hover:border-[#fff67b] hover:text-[#fff67b] cursor-pointer"
                >
                  Load
                </button>
                <button
                  onClick={newRoute}
                  className="px-2 sm:px-3 py-1 rounded-md text-xs font-medium border border-gray-600 text-gray-300 hover:border-[#fff67b] hover:text-[#fff67b] cursor-pointer"
                >
                  New
                </button>
                {session.user?.role === "admin" && activeRouteId && (
                  <button
                    onClick={togglePublish}
                    className={`px-2 sm:px-3 py-1 rounded-md text-xs font-medium border cursor-pointer ${
                      savedRoutes.find((r) => r.id === activeRouteId)?.published
                        ? "border-green-500/50 text-green-400 hover:bg-green-500/10"
                        : "border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-400"
                    }`}
                  >
                    {savedRoutes.find((r) => r.id === activeRouteId)?.published ? "Published" : "Publish"}
                  </button>
                )}
                {session.user?.role !== "admin" && activeRouteId && route.length > 0 && (
                  <button
                    onClick={submitForPublishing}
                    disabled={submitPending}
                    className="px-2 sm:px-3 py-1 rounded-md text-xs font-medium border border-gray-600 text-gray-300 hover:border-green-500 hover:text-green-400 cursor-pointer disabled:opacity-50"
                  >
                    {submitPending ? "Submitting..." : "Submit as Preset"}
                  </button>
                )}
              </div>
            )}
            {saveMessage && (
              <span className="text-xs text-green-400">{saveMessage}</span>
            )}
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1 sm:gap-2">
              <Image
                src="/assets/spatula_golden.png"
                alt="Spatula count"
                width={24}
                height={24}
              />
              <span className="text-xl pl-8 sm:text-3xl font-bold text-yellow">{spatulaCount}</span>
            </div>
            <div className="flex items-center gap-4 sm:gap-8">
              <Image
                src="/assets/pat_sock.png"
                alt="Sock count"
                width={48}
                height={48}
              />
              <span className="text-xl sm:text-3xl font-bold text-purple-300">{sockCount}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 flex-1 min-h-0">
          {/* Route List */}
          <div className="container-bg rounded-lg p-6 lg:w-2/3 w-full flex flex-col min-h-0">
            <h3 className="text-lg sm:text-2xl font-bold text-yellow mb-2 sm:mb-4 text-center">
              {activeRouteId && saveName ? saveName : "Your Route"}
            </h3>

            <div className="flex-1 overflow-y-auto min-h-0 space-y-2">
              {route.length === 0 ? (
                <div className="text-center py-8 sm:py-16">
                  <Image
                    src="/assets/spatula_silver_straight.png"
                    alt="No spatulas"
                    width={48}
                    height={48}
                    className="mx-auto mb-3 opacity-40"
                  />
                  <p className="text-gray-400 text-sm sm:text-lg">No items added yet.</p>
                  <p className="text-gray-500 text-xs sm:text-sm mt-1">Tap &quot;Add Spatula&quot; or &quot;Add Sock&quot; to start!</p>
                </div>
              ) : (
                route.map((entry, index) => {
                  {/* const spatCountBefore = route.slice(0, index).filter((e) => e.type === "spatula").length; */}
                  {/* const spatNumber = entry.type === "spatula" ? spatCountBefore + 1 : null; */}

                  return (
                    <div
                      key={index}
                      className={`rounded-lg border flex flex-col gap-2 ${
                        entry.type === "sock"
                          ? "bg-purple-900/60 border-purple-700 p-2 sm:p-3"
                          : "bg-blue-900/80 border-blue-700 py-1 px-2 sm:py-1.5 sm:px-3"
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* Icon */}
                        {entry.type === "spatula" ? (
                          <Image
                            src="/assets/spatula_golden_straight.png"
                            alt="Spatula"
                            width={16}
                            height={16}
                            className="flex-shrink-0 mx-2"
                          />
                        ) : (
                          <Image
                            src="/assets/pat_sock.png"
                            alt="Sock"
                            width={32}
                            height={32}
                            className="flex-shrink-0"
                          />
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          {entry.type === "spatula" ? (
                            <>
                              <div className="text-xs sm:text-sm font-semibold text-white truncate">
                                {entry.spatula.name}
                              </div>
                              <div className="text-[10px] sm:text-xs text-gray-400">{entry.spatula.level}</div>
                            </>
                          ) : (
                            <>
                              <div className="text-xs sm:text-sm font-semibold text-white truncate">
                                {entry.sock.name}
                              </div>
                              <div className="text-[10px] sm:text-xs text-gray-400">{entry.sock.level}{entry.sock.area ? ` — ${entry.sock.area}` : ""}</div>
                            </>
                          )}
                        </div>

                        {/* Strategy badge (spatula only) */}
                        {entry.type === "spatula" && (
                          <button
                            className={`text-[10px] sm:text-xs px-2 sm:px-3 py-1 rounded-md border transition-colors duration-200 flex-shrink-0 cursor-pointer ${
                              entry.strategy
                                ? "border-[#fff67b]/50 bg-[#fff67b]/10 text-[#fff67b] hover:bg-[#fff67b]/20"
                                : "border-gray-500 bg-gray-800/50 text-gray-400 hover:border-[#fff67b] hover:text-[#fff67b]"
                            }`}
                            onClick={() => setStratPickerIndex(stratPickerIndex === index ? null : index)}
                          >
                            {entry.strategy ? entry.strategy.name : "Strategy"}
                          </button>
                        )}

                        {/* Reorder + Remove */}
                        <div className="flex items-center gap-0.5 sm:gap-1 flex-shrink-0">
                          <button
                            onClick={() => moveEntry(index, -1)}
                            className="text-gray-400 hover:text-yellow text-xs sm:text-sm px-1 cursor-pointer disabled:opacity-30"
                            disabled={index === 0}
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveEntry(index, 1)}
                            className="text-gray-400 hover:text-yellow text-xs sm:text-sm px-1 cursor-pointer disabled:opacity-30"
                            disabled={index === route.length - 1}
                          >
                            ▼
                          </button>
                          <button
                            onClick={() => removeEntry(index)}
                            className="text-gray-500 hover:text-red-400 text-sm sm:text-lg px-1 cursor-pointer"
                          >
                            ×
                          </button>
                        </div>
                      </div>

                      {/* Strategy Picker Dropdown (spatula only) */}
                      {entry.type === "spatula" && stratPickerIndex === index && (
                        <div className="mt-1 bg-blue-950/80 rounded-md border border-blue-800 p-2 sm:p-3 space-y-1">
                          <p className="text-[10px] sm:text-xs text-gray-400 mb-2">Select a strategy for {entry.spatula.name}:</p>
                          {getStratsForSpatula(entry.spatula).length === 0 ? (
                            <p className="text-[10px] sm:text-xs text-gray-500 py-2">No strategies available for this spatula.</p>
                          ) : (
                            getStratsForSpatula(entry.spatula).map((strat) => (
                              <button
                                key={strat.id}
                                onClick={() => setStrategy(index, strat)}
                                className={`w-full text-left px-2 sm:px-3 py-2 rounded-md text-[10px] sm:text-xs transition-colors duration-200 cursor-pointer ${
                                  entry.strategy?.id === strat.id
                                    ? "bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50"
                                    : "hover:bg-blue-900/60 text-white border border-transparent"
                                }`}
                              >
                                <span className="font-semibold">{strat.name}</span>
                                {strat.prerequisites.length > 0 && strat.prerequisites[0] !== "TBA" && (
                                  <span className="text-gray-400 ml-1 sm:ml-2 hidden sm:inline">
                                    (requires: {strat.prerequisites.join(", ")})
                                  </span>
                                )}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Add Buttons */}
            <div className="mt-2 sm:mt-4 flex-shrink-0 flex gap-2 sm:gap-3">
              <button
                onClick={() => {
                  setShowSpatulaPicker(!showSpatulaPicker);
                  setShowSockPicker(false);
                  setStratPickerIndex(null);
                }}
                className={`flex-1 py-2 sm:py-3 rounded-lg border-2 border-dashed transition-colors duration-200 cursor-pointer flex items-center justify-center gap-2 text-sm sm:text-lg ${
                  showSpatulaPicker
                    ? "border-[#fff67b] bg-[#fff67b]/10 text-[#fff67b]"
                    : "border-[#fff67b]/50 text-[#fff67b] hover:bg-[#fff67b]/10 hover:border-[#fff67b]"
                }`}
              >
                <Image
                  src="/assets/spatula_golden.png"
                  alt=""
                  width={20}
                  height={20}
                />
                <span className="pl-8">Add Spatula</span>
              </button>
              <button
                onClick={() => {
                  setShowSockPicker(!showSockPicker);
                  setShowSpatulaPicker(false);
                  setStratPickerIndex(null);
                }}
                className={`flex-1 rounded-lg border-2 border-dashed transition-colors duration-200 cursor-pointer flex items-center justify-center gap-8 text-sm sm:text-lg ${
                  showSockPicker
                    ? "border-purple-400 bg-purple-400/10 text-purple-300"
                    : "border-purple-400/50 text-purple-300 hover:bg-purple-400/10 hover:border-purple-400"
                }`}
              >
                <Image
                  src="/assets/pat_sock.png"
                  alt=""
                  width={48}
                  height={48}
                />
                Add Sock
              </button>
            </div>
          </div>

          {/* Desktop Picker Panel (hidden on mobile) */}
          <div className={`hidden lg:flex container-bg rounded-lg p-4 lg:w-1/3 flex-col min-h-0 transition-opacity duration-200 ${pickerOpen ? "opacity-100" : "opacity-50 pointer-events-none"}`}>
            {pickerContent}
          </div>

          {/* Mobile Picker Modal (hidden on desktop) */}
          {pickerOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex flex-col">
              {/* Backdrop */}
              <div className="absolute inset-0 bg-black/60" onClick={closePickers} />
              {/* Modal */}
              <div className="relative mt-auto container-bg rounded-t-2xl p-4 flex flex-col max-h-[80vh] min-h-[50vh]">
                <button
                  onClick={closePickers}
                  className="absolute top-3 right-4 text-gray-400 hover:text-white text-2xl cursor-pointer"
                >
                  ×
                </button>
                {pickerContent}
              </div>
            </div>
          )}
        </div>

        {/* Save Modal */}
        {showSaveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowSaveModal(false)} />
            <div className="relative container-bg rounded-lg p-6 w-full max-w-sm space-y-4">
              <h3 className="text-lg font-bold text-yellow">
                {activeRouteId ? "Update Route" : "Save Route"}
              </h3>
              <input
                type="text"
                value={saveName}
                onChange={(e) => setSaveName(e.target.value)}
                placeholder="Route name..."
                className="w-full px-3 py-2 rounded-lg bg-blue-950/60 border border-blue-700 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#fff67b]"
                autoFocus
                onKeyDown={(e) => e.key === "Enter" && saveRoute()}
              />
              <div className="flex gap-2">
                <button
                  onClick={saveRoute}
                  disabled={!saveName.trim()}
                  className="flex-1 py-2 rounded-lg bg-[#fff67b]/20 text-[#fff67b] border border-[#fff67b]/50 font-medium hover:bg-[#fff67b]/30 cursor-pointer disabled:opacity-50"
                >
                  {activeRouteId ? "Update" : "Save"}
                </button>
                {activeRouteId && (
                  <button
                    onClick={() => { setActiveRouteId(null); setSaveName(""); }}
                    className="py-2 px-3 rounded-lg text-xs text-gray-400 border border-gray-600 hover:text-white cursor-pointer"
                  >
                    Save as New
                  </button>
                )}
                <button
                  onClick={() => setShowSaveModal(false)}
                  className="py-2 px-4 rounded-lg text-gray-400 border border-gray-600 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Load Modal */}
        {showLoadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowLoadModal(false)} />
            <div className="relative container-bg rounded-lg p-6 w-full max-w-md max-h-[70vh] flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-yellow">Load Route</h3>
                <button
                  onClick={() => setShowLoadModal(false)}
                  className="text-gray-400 hover:text-white text-xl cursor-pointer"
                >
                  ×
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-2 min-h-0">
                {savedRoutes.length === 0 ? (
                  <p className="text-gray-400 text-sm text-center py-8">No saved routes.</p>
                ) : (
                  savedRoutes.map((r) => (
                    <div
                      key={r.id}
                      className={`rounded-lg p-3 flex items-center justify-between border transition-colors ${
                        activeRouteId === r.id
                          ? "border-[#fff67b]/50 bg-[#fff67b]/5"
                          : "border-blue-700 hover:border-[#fff67b]/30"
                      }`}
                    >
                      <button
                        onClick={() => loadRoute(r.id)}
                        className="flex-1 text-left cursor-pointer"
                      >
                        <div className="text-sm font-semibold text-white">{r.name}{r.category && <span className="ml-2 text-xs font-normal text-gray-400">{r.category}</span>}</div>
                        <div className="text-xs text-gray-400">
                          {new Date(r.updatedAt).toLocaleDateString()}
                        </div>
                      </button>
                      <button
                        onClick={() => deleteRoute(r.id)}
                        className="text-gray-500 hover:text-red-400 text-lg px-2 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
