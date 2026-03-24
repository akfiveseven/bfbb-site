"use client";

import Image from 'next/image'

import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Difficulty } from "@/components/ui/Difficulty";




const LevelStrategies: React.FC = () => {
  // Current active level
  const [activeLevel, setActiveLevel] = useState("All Strats")
  const [activeSpatula, setActiveSpatula] = useState(1)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stratsData, setStratsData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [spatulaData, setSpatulaData] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [methodsData, setMethodsData] = useState<any[]>([]);
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
      .get("/data/Strategies.json")
      .then((res) => {
        console.log(res.data);
        setStratsData(res.data);
      })
      .catch((err) => console.log(err));
    axios
      .get("/data/Spatulas.json")
      .then((res) => {
        console.log(res.data);
        setSpatulaData(res.data);
      })
      .catch((err) => console.log(err));
    axios
      .get("/data/Methods.json")
      .then((res) => {
        setMethodsData(res.data);
      })
      .catch((err) => console.log(err));
    setLoading(false);
  }, []);

  // Array of all levels for mapping
  const levels = [
    { id: 0, label: 'All Strats', image: '' },
    { id: 1, label: 'Bikini Bottom', image: '' },
    { id: 2, label: 'Jellyfish Fields', image: '' },
    { id: 3, label: 'Downtown Bikini Bottom', image: '' },
    { id: 4, label: 'Goo Lagoon', image: '' },
    { id: 5, label: 'Poseidome', image: '' },
    { id: 6, label: 'Rock Bottom', image: '' },
    { id: 7, label: 'Mermalair', image: '' },
    { id: 8, label: 'Sand Mountain', image: '' },
    { id: 9, label: 'Industrial Park', image: '' },
    { id: 10, label: 'Kelp Forest', image: '' },
    { id: 11, label: "Flying Dutchman's Graveyard", image: '' },
    { id: 12, label: "SpongeBob's Dream", image: '' },
    { id: 13, label: 'Chum Bucket Lab', image: '' },
  ];

  const incrementSpatCounter = () => {

    const spat = activeSpatula + 1;

    setExpandedStrat(null);
    if (activeSpatula < 8) {
      setActiveSpatula(spat);
      return
    }

    setActiveSpatula(1);

  };

  const decrementSpatCounter = () => {

    const spat = activeSpatula - 1;

    setExpandedStrat(null);
    if (activeSpatula == 1) {
      setActiveSpatula(8);
      return
    }

    setActiveSpatula(spat);

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
            <h1 className="text-2xl sm:text-4xl font-bold text-yellow">Level Strats</h1>
            <h2 className="hidden lg:block text-4xl font-bold text-yellow px-4 py-2 rounded-lg">
            {effectiveLevel}
            </h2>
          </div>


          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 lg:h-[calc(100vh-16rem)]">
            {/* Level Selection - hidden on mobile */}
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
                    onClick={() => { setActiveLevel(level.label); setExpandedStrat(null); setSearchQuery(""); }}
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

              {effectiveLevel !== "All Strats" && (
                <>
                  {/* Spatula Navigation */}
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
                  {/* Spatula Name */}
                  <div className="text-center mb-4 sm:mb-6 flex-shrink-0">
                    {spatulaData
                      .filter(spatula => spatula.level == activeLevel)
                      .filter(spatula => spatula.pos == activeSpatula)
                      .map((spatula) => (
                        <h3 key={spatula.id} className="text-lg sm:text-2xl font-bold text-yellow">
                          {spatula.name}
                        </h3>
                      ))}
                  </div>
                </>
              )}
              {/* Search Bar (All Strats only) */}
              {effectiveLevel === "All Strats" && (
                <div className="mb-4 flex-shrink-0">
                  <input
                    type="text"
                    placeholder="Search strats..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-blue-950/60 border border-blue-700 text-white placeholder-gray-400 text-sm focus:outline-none focus:border-[#fff67b] transition-colors duration-200"
                  />
                </div>
              )}
              {/* Strategy Entries */}
              <div className="space-y-1 flex-1 lg:overflow-y-auto min-h-0">
                {!loading && (() => {
                  const filteredStrats = effectiveLevel === "All Strats"
                    ? stratsData.filter(strat => {
                        if (!searchQuery) return true;
                        const q = searchQuery.toLowerCase();
                        return strat.name.toLowerCase().includes(q);
                      })
                    : stratsData
                      .filter(strat => strat.level == effectiveLevel)
                      .filter(strat => strat.spatula == getActiveSpatulaName());

                  return filteredStrats.length > 0 ? (
                    <>
                      {filteredStrats.map((strat) => {
                        const stratKey = `${strat.id}`;
                        const isExpanded = expandedStrat === stratKey;
                        const methods = methodsData.filter(m => m.strat === strat.name);
                        return (
                          <div key={strat.id} className="bg-blue-900/80 rounded-lg border border-blue-700 hover:border-[#fff67b] transition-colors duration-200">
                            <button
                              className="w-full p-2 flex justify-between items-center cursor-pointer"
                              onClick={() => setExpandedStrat(isExpanded ? null : stratKey)}
                            >
                              <span className="text-xs font-semibold text-white">{strat.name} {effectiveLevel === "All Strats" && (
                                    <span className="text-xs text-gray-400 mx-2">{strat.spatula}</span>
                                  )}</span>
                              <div>
                                <span>
                                  {effectiveLevel === "All Strats" && (
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
                                {methods.length === 0 ? (
                                  <p className="text-xs text-gray-400 py-2">No methods added for this strat.</p>
                                ) : methods.map((method, mIndex) => (
                                  <div key={mIndex} className="bg-blue-950/60 rounded-md p-3 border border-blue-800">
                                    <div className="flex justify-between items-center mb-1">
                                      <span className="text-sm font-semibold text-yellow">{method.name}</span>
                                      <Difficulty count={Number(method.difficulty)} />
                                    </div>
                                    {method.description && method.description !== "N/A" && (
                                      <p className="text-xs text-gray-300 mt-1">{method.description}</p>
                                    )}
                                    {method.videoURL && method.videoURL !== "N/A" && (
                                      <a
                                        href={method.videoURL}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-[#fff67b] hover:underline mt-2 inline-block"
                                      >
                                        Watch Video →
                                      </a>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </>
                  ) : (
                      <div className="text-center py-12">
                        <div className="text-gray-400 text-xl mb-2">No strategies found</div>
                        <div className="text-gray-500 text-sm">
                          Try selecting a different level or spatula
                        </div>
                      </div>
                    );
                })()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default LevelStrategies;
