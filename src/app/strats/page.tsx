"use client";

import Image from 'next/image'

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Difficulty } from "@/components/ui/Difficulty";




const getYouTubeEmbedUrl = (url: string): string | null => {
  try {
    const u = new URL(url);
    let videoId: string | null = null;
    if (u.hostname === 'youtu.be') {
      videoId = u.pathname.slice(1);
    } else if (u.hostname.includes('youtube.com')) {
      videoId = u.searchParams.get('v');
    }
    if (!videoId) return null;
    const t = u.searchParams.get('t');
    return `https://www.youtube-nocookie.com/embed/${videoId}${t ? `?start=${t.replace('s', '')}` : ''}`;
  } catch {
    return null;
  }
};

const LevelStrategies: React.FC = () => {
  const [levelSubTab, setLevelSubTab] = useState<"spatulas" | "socks" | "general">("spatulas");
  const [activeLevel, setActiveLevel] = useState("All Strats")
  const [activeSpatula, setActiveSpatula] = useState(1)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stratsData, setStratsData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [spatulaData, setSpatulaData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [methodsData, setMethodsData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [sockStratsData, setSockStratsData] = useState<any[]>([]);
  const [expandedStrat, setExpandedStrat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    axios
      .get("/api/data/strategies")
      .then((res) => {
        setStratsData(res.data);
      })
      .catch((err) => console.log(err));
    axios
      .get("/api/data/spatulas")
      .then((res) => {
        setSpatulaData(res.data);
      })
      .catch((err) => console.log(err));
    axios
      .get("/api/data/methods")
      .then((res) => {
        setMethodsData(res.data);
      })
      .catch((err) => console.log(err));
    axios
      .get("/api/data/sockStrategies")
      .then((res) => {
        setSockStratsData(res.data);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  }, []);

  const levels = [
    { id: 0, label: 'All Strats', image: '' },
    { id: 1, label: 'Bikini Bottom', image: '', totalSpats: 8 },
    { id: 2, label: 'Jellyfish Fields', image: '', totalSpats: 8 },
    { id: 3, label: 'Downtown Bikini Bottom', image: '', totalSpats: 8 },
    { id: 4, label: 'Goo Lagoon', image: '', totalSpats: 8 },
    { id: 5, label: 'Poseidome', image: '', totalSpats: 1 },
    { id: 6, label: 'Rock Bottom', image: '', totalSpats: 8 },
    { id: 7, label: 'Mermalair', image: '', totalSpats: 8 },
    { id: 8, label: 'Sand Mountain', image: '', totalSpats: 8 },
    { id: 9, label: 'Industrial Park', image: '', totalSpats: 1 },
    { id: 10, label: 'Kelp Forest', image: '', totalSpats: 8 },
    { id: 11, label: "Flying Dutchman's Graveyard", image: '', totalSpats: 8 },
    { id: 12, label: "SpongeBob's Dream", image: '', totalSpats: 8 },
    { id: 13, label: 'Chum Bucket Lab', image: '', totalSpats: 2 },
  ];

  const getActiveLevel = () => levels.find((l) => l.label === activeLevel);

  const incrementSpatCounter = () => {
    const total = getActiveLevel()?.totalSpats ?? 8;
    setExpandedStrat(null);
    setActiveSpatula(activeSpatula < total ? activeSpatula + 1 : 1);
  };

  const decrementSpatCounter = () => {
    const total = getActiveLevel()?.totalSpats ?? 8;
    setExpandedStrat(null);
    setActiveSpatula(activeSpatula > 1 ? activeSpatula - 1 : total);
  };

  const getActiveSpatulaName = () => {
    try {
      return spatulaData.filter(spatula => spatula.level == activeLevel).filter(spatula => spatula.pos == activeSpatula)[0].name
    } catch {
      return "TESTING"
    }
  };

  const effectiveLevel = isMobile ? "All Strats" : activeLevel;

  return (
    <>
      <div className="min-h-[calc(100vh-18rem)] flex flex-col">
        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-8 font-bob">

          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 sm:mb-8 gap-2">
            <h1 className="text-2xl sm:text-4xl font-bold text-yellow">Strats</h1>
            <h2 className="hidden lg:block text-4xl font-bold text-yellow px-4 py-2 rounded-lg">
              {effectiveLevel}
            </h2>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 lg:h-[calc(100vh-16rem)]">
            {/* Level Selection */}
            <div className="container-bg rounded-lg p-3 sm:p-4 lg:w-1/3 w-full hidden lg:flex flex-col">
              <h3 className="text-xl sm:text-2xl font-bold text-yellow mb-3 sm:mb-4 text-center">Select Level</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-2 gap-2 sm:gap-3 xl:gap-2 flex-1 auto-rows-fr content-start lg:overflow-y-scroll">
                {levels.map((level) => (
                  <button
                    key={`${level.id}-${level.label}`}
                    className={`
                      border-2 rounded-lg p-2 sm:p-3 flex items-center justify-center text-center
                      transition-all duration-200 cursor-pointer
                      ${level.label === activeLevel
                        ? 'border-[#fff67b] bg-[#fff67b]/20 text-[#fff67b] shadow-lg'
                        : 'border-gray-400 hover:border-[#fff67b] hover:bg-blue-900/30'
                      }
                      text-xs sm:text-sm 2xl:text-lg leading-tight min-h-[2.5rem]
                    `}
                    style={{
                      backgroundImage: level.image ? `url(${level.image})` : 'none',
                      backgroundSize: `${level.label === "Flying Dutchman's Graveyard" || level.label === "Downtown Bikini Bottom" ? "contain" : "cover"}`,
                      backgroundPosition: "center"
                    }}
                    onClick={() => { setActiveLevel(level.label); setActiveSpatula(1); setExpandedStrat(null); setSearchQuery(""); setLevelSubTab("spatulas"); }}
                  >
                    <span className="drop-shadow-lg font-semibold">
                      {level.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {/* Level Content */}
            <div className="container-bg rounded-lg p-4 sm:p-6 lg:w-2/3 w-full flex flex-col min-h-0">

              {/* Search Bar (All Strats only) */}
              {effectiveLevel === "All Strats" && (
                <div className="mb-4 flex-shrink-0">
                  <input
                    type="text"
                    placeholder="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-blue-950/60 border border-blue-700 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#fff67b] transition-colors duration-200"
                  />
                </div>
              )}

              {/* Level Sub-Tabs (only when a specific level is selected) */}
              {effectiveLevel !== "All Strats" && (
                <div className="flex gap-2 mb-4 flex-shrink-0">
                  {(["spatulas", "socks", "general"] as const).map((st) => (
                    <button
                      key={st}
                      className={`px-3 py-1 rounded-md text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        levelSubTab === st
                          ? 'bg-[#fff67b]/20 border border-[#fff67b] text-[#fff67b]'
                          : 'border border-gray-500 hover:border-[#fff67b] hover:bg-blue-900/30'
                      }`}
                      onClick={() => { setLevelSubTab(st); setExpandedStrat(null); }}
                    >
                      {st.charAt(0).toUpperCase() + st.slice(1)}
                    </button>
                  ))}
                </div>
              )}

              {/* Spatula Navigation (spatulas sub-tab only) */}
              {effectiveLevel !== "All Strats" && levelSubTab === "spatulas" && (
                <>
                  <div className="flex flex-row items-center justify-center gap-3 sm:gap-6 mb-4 sm:mb-8 flex-shrink-0">
                    <button
                      className="text-2xl sm:text-4xl text-yellow hover:text-white transition-colors duration-200 hover:scale-110 transform"
                      onClick={decrementSpatCounter}
                      aria-label="Previous spatula"
                    >
                      ←
                    </button>

                    <div className="flex flex-wrap justify-center gap-1 sm:gap-3">
                      {spatulaData
                        .filter(spatula => spatula.level == activeLevel)
                        .map((spatula, spatIdx) => (
                          <div key={spatula.id} className="flex flex-col items-center">
                            <Image
                              src={spatIdx+1 === activeSpatula ? "/assets/spatula_golden_straight.png" : "/assets/spatula_silver_straight.png"}
                              alt={`Spatula ${spatIdx+1}`}
                              width={97}
                              height={340}
                              className={`w-auto h-20 sm:h-32 transition-all duration-200 ${spatIdx+1 === activeSpatula ? 'scale-110 drop-shadow-lg' : 'opacity-60 hover:opacity-80'}`}
                            />
                          </div>
                        ))}
                    </div>

                    <button
                      className="text-2xl sm:text-4xl text-yellow hover:text-white transition-colors duration-200 hover:scale-110 transform"
                      onClick={incrementSpatCounter}
                      aria-label="Next spatula"
                    >
                      →
                    </button>
                  </div>
                  <div className="text-center mb-4 sm:mb-6 flex-shrink-0">
                    {spatulaData
                      .filter(spatula => spatula.level == activeLevel)
                      .filter(spatula => spatula.pos == activeSpatula)
                      .map((spatula) => (
                        <div key={spatula.id}>
                          <h3 key={spatula.id} className="text-lg sm:text-2xl font-bold text-yellow">
                            {spatula.name}
                          </h3>
                        </div>
                      ))}
                  </div>
                </>
              )}

              {/* Strategy Entries */}
              {!loading && (() => {
                const isGeneral = (s: typeof stratsData[0]) => !s.spatulas || s.spatulas.length === 0 || (s.spatulas.length === 1 && s.spatulas[0] === "N/A");

                const searchFilter = (strat: typeof stratsData[0]) => {
                  if (!searchQuery) return true;
                  const q = searchQuery.toLowerCase();
                  const methods = methodsData.filter(m => m.strat === strat.name);
                  return strat.name.toLowerCase().includes(q) || methods.some(m => m.name.toLowerCase().includes(q));
                };

                const showExtraInfo = effectiveLevel === "All Strats";

                const renderSockStrat = (ss: typeof sockStratsData[0]) => {
                  const stratKey = `sock-${ss.id}`;
                  const isExpanded = expandedStrat === stratKey;
                  const diffOrder: Record<string, number> = { Beginner: 0, Intermediate: 1, Advanced: 2, Expert: 3, Experimental: 4 };
                  const methods = methodsData.filter(m => m.strat === ss.name).sort((a, b) => (diffOrder[a.difficulty] ?? 99) - (diffOrder[b.difficulty] ?? 99));
                  return (
                    <div key={ss.id} className="bg-blue-900/80 rounded-lg border border-blue-700 hover:border-[#fff67b] transition-colors duration-200">
                      <button
                        className="w-full p-2 flex justify-between items-center cursor-pointer"
                        onClick={() => setExpandedStrat(isExpanded ? null : stratKey)}
                      >
                        <span className="text-xs font-semibold text-white">{ss.name}</span>
                        <div>
                          <span className="text-xs text-gray-400 mx-2">{showExtraInfo && ss.level}{showExtraInfo && " — "}{ss.sock}</span>
                          <span className={`text-yellow text-xl transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-3 pb-3 space-y-2">
                          {methods.length === 0 ? (
                            <p className="text-xs text-gray-400 py-2">No methods added for this strat.</p>
                          ) : methods.map((method, mIndex) => (
                            <div key={mIndex} className="bg-blue-950/60 rounded-md p-3 border border-blue-800">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-semibold text-yellow">
                                  {method.name}
                                  {method.obsolete && (
                                    <span className="ml-2 text-xs text-red-400 font-semibold">Obsolete</span>
                                  )}
                                </span>
                                <Difficulty className="text-sm" level={method.difficulty} />
                              </div>
                              {method.hans && method.hans !== "N/A" && (
                                <p className="text-xs text-gray-400 mt-1">Hans: {method.hans}</p>
                              )}
                              {method.prerequisites && method.prerequisites.length > 0 && (
                                <p className="text-xs text-gray-400 mt-1">Requires: {method.prerequisites.join(", ")}</p>
                              )}
                              {method.description && method.description !== "N/A" && (
                                <p className="font-mono text-sm text-gray-300 mt-1">{method.description}</p>
                              )}
                              {method.videoURLs && method.videoURLs.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {method.videoURLs.map((url: string, vi: number) => {
                                    const embedUrl = getYouTubeEmbedUrl(url);
                                    return embedUrl ? (
                                      <div key={vi} className="relative w-1/2" style={{ paddingBottom: '28.125%' }}>
                                        <iframe
                                          className="absolute top-0 left-0 w-full h-full rounded-md"
                                          src={embedUrl}
                                          title={`${method.name} video ${vi + 1}`}
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                        />
                                      </div>
                                    ) : (
                                      <a
                                        key={vi}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-[#fff67b] hover:underline block truncate"
                                      >
                                        {url}
                                      </a>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                };

                const renderStrat = (strat: typeof stratsData[0]) => {
                  const stratKey = `${strat.id}`;
                  const isExpanded = expandedStrat === stratKey;
                  const diffOrder: Record<string, number> = { Beginner: 0, Intermediate: 1, Advanced: 2, Expert: 3, Experimental: 4 };
                  const methods = methodsData.filter(m => m.strat === strat.name).sort((a, b) => (diffOrder[a.difficulty] ?? 99) - (diffOrder[b.difficulty] ?? 99));
                  return (
                    <div key={strat.id} className="bg-blue-900/80 rounded-lg border border-blue-700 hover:border-[#fff67b] transition-colors duration-200">
                      <button
                        className="w-full p-2 flex justify-between items-center cursor-pointer"
                        onClick={() => setExpandedStrat(isExpanded ? null : stratKey)}
                      >
                        <span className="text-xs font-semibold text-white">{strat.name} {showExtraInfo && !isGeneral(strat) && (
                              <span className="text-xs text-gray-400 mx-2">{strat.spatulas.filter((s: string) => s !== "N/A").join(", ")}</span>
                            )}</span>
                        <div>
                          <span>
                            {showExtraInfo && (
                              <span className="text-xs text-gray-400 mx-2">{strat.level}</span>
                            )}
                          </span>
                          <span className={`text-yellow text-xl transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
                            ▼
                          </span>
                        </div>
                      </button>
                      {isExpanded && (
                        <div className="px-3 pb-3 space-y-2">
                          <p className="font-mono">{strat.description}</p>
                          {methods.length === 0 ? (
                            <p className="text-xs text-gray-400 py-2">No methods added for this strat.</p>
                          ) : methods.map((method, mIndex) => (
                            <div key={mIndex} className="bg-blue-950/60 rounded-md p-3 border border-blue-800">
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-semibold text-yellow">
                                  {method.name}
                                  {method.obsolete && (
                                    <span className="ml-2 text-xs text-red-400 font-semibold">Obsolete</span>
                                  )}
                                </span>
                                <Difficulty className="text-sm" level={method.difficulty} />
                              </div>
                              {method.hans && method.hans !== "N/A" && (
                                <p className="text-xs text-gray-400 mt-1">Hans: {method.hans}</p>
                              )}
                              {method.prerequisites && method.prerequisites.length > 0 && (
                                <p className="text-xs text-gray-400 mt-1">Requires: {method.prerequisites.join(", ")}</p>
                              )}
                              {method.description && method.description !== "N/A" && (
                                <p className="font-mono text-sm text-gray-300 mt-1">{method.description}</p>
                              )}
                              {method.videoURLs && method.videoURLs.length > 0 && (
                                <div className="mt-2 space-y-2">
                                  {method.videoURLs.map((url: string, vi: number) => {
                                    const embedUrl = getYouTubeEmbedUrl(url);
                                    return embedUrl ? (
                                      <div key={vi} className="relative w-1/2" style={{ paddingBottom: '28.125%' }}>
                                        <iframe
                                          className="absolute top-0 left-0 w-full h-full rounded-md"
                                          src={embedUrl}
                                          title={`${method.name} video ${vi + 1}`}
                                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                          allowFullScreen
                                        />
                                      </div>
                                    ) : (
                                      <a
                                        key={vi}
                                        href={url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-[#fff67b] hover:underline block truncate"
                                      >
                                        {url}
                                      </a>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                };

                // All Strats: two-column layout
                if (effectiveLevel === "All Strats") {
                  const all = stratsData.filter(searchFilter);
                  const spatStrats = all.filter(s => !isGeneral(s));
                  const genStrats = all.filter(isGeneral);
                  const q = searchQuery.toLowerCase();
                  const filteredSockStrats = sockStratsData.filter(ss => {
                    if (!searchQuery) return true;
                    const methods = methodsData.filter(m => m.strat === ss.name);
                    return ss.name.toLowerCase().includes(q) || ss.sock.toLowerCase().includes(q) || methods.some(m => m.name.toLowerCase().includes(q));
                  });
                  return (
                    <div className="flex flex-col lg:flex-row gap-4 flex-1 min-h-0">
                      <div className="lg:w-1/2 w-full flex flex-col min-h-0">
                        <div className="space-y-1 flex-1 lg:overflow-y-auto min-h-0">
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Spatula Strats</h4>
                          {spatStrats.length > 0 ? spatStrats.map(renderStrat) : (
                            <p className="text-gray-500 text-sm text-center py-4">No spatula strats found</p>
                          )}
                          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mt-3 mb-1">Sock Strats</h4>
                          {filteredSockStrats.length > 0 ? filteredSockStrats.map(renderSockStrat) : (
                            <p className="text-gray-500 text-sm text-center py-4">No sock strats found</p>
                          )}
                        </div>
                      </div>
                      <div className="lg:w-1/2 w-full flex flex-col min-h-0">
                        <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1 flex-shrink-0">General Strats</h4>
                        <div className="space-y-1 flex-1 lg:overflow-y-auto min-h-0">
                          {genStrats.length > 0 ? genStrats.map(renderStrat) : (
                            <p className="text-gray-500 text-sm text-center py-4">No general strats found</p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                }

                // Spatulas sub-tab
                if (levelSubTab === "spatulas") {
                  const spatName = getActiveSpatulaName();
                  const strats = stratsData
                    .filter(strat => strat.level == effectiveLevel)
                    .filter(strat => strat.spatulas && strat.spatulas.includes(spatName));
                  return (
                    <div className="space-y-1 flex-1 lg:overflow-y-auto min-h-0">
                      {strats.length > 0 ? strats.map(renderStrat) : (
                        <div className="text-center py-12">
                          <div className="text-gray-400 text-xl mb-2">No strategies found</div>
                          <div className="text-gray-500 text-sm">Try selecting a different spatula</div>
                        </div>
                      )}
                    </div>
                  );
                }

                // Socks sub-tab
                if (levelSubTab === "socks") {
                  const levelSockStrats = sockStratsData.filter(ss => ss.level === effectiveLevel);
                  return (
                    <div className="space-y-1 flex-1 lg:overflow-y-auto min-h-0">
                      {levelSockStrats.length > 0 ? levelSockStrats.map(renderSockStrat) : (
                        <div className="text-center py-12">
                          <div className="text-gray-400 text-xl mb-2">No sock strategies found</div>
                          <div className="text-gray-500 text-sm">No sock strategies for this level yet</div>
                        </div>
                      )}
                    </div>
                  );
                }

                // General sub-tab
                if (levelSubTab === "general") {
                  const genStrats = stratsData.filter(s => s.level === effectiveLevel && isGeneral(s));
                  return (
                    <div className="space-y-1 flex-1 lg:overflow-y-auto min-h-0">
                      {genStrats.length > 0 ? genStrats.map(renderStrat) : (
                        <div className="text-center py-12">
                          <div className="text-gray-400 text-xl mb-2">No general strategies found</div>
                          <div className="text-gray-500 text-sm">No general strategies for this level yet</div>
                        </div>
                      )}
                    </div>
                  );
                }

                return null;
              })()}
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default LevelStrategies;
