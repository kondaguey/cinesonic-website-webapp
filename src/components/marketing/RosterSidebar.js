"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import {
  Users,
  X,
  Play,
  Pause,
  Search,
  ChevronRight,
  Filter,
  Music,
} from "lucide-react";

// Initialize Supabase Client locally
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function RosterSidebar({ theme = "cyan" }) {
  const [isOpen, setIsOpen] = useState(false);
  const [roster, setRoster] = useState([]);
  const [filteredRoster, setFilteredRoster] = useState([]);

  // 1. LOCAL COLOR MAP
  const themeConfig = {
    gold: { hex: "#d4af37" },
    pink: { hex: "#ff3399" },
    fire: { hex: "#ff4500" },
    cyan: { hex: "#00f0ff" },
    system: { hex: "#3b82f6" },
  };

  // Defaulting to Cyan/Sci-Fi for this specific tool if no theme provided,
  // but respects the passed theme prop.
  const activeTheme = themeConfig[theme] || themeConfig.cyan;
  const color = activeTheme.hex;

  // FILTERS
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // AUDIO
  const [playingUrl, setPlayingUrl] = useState(null);
  const audioRef = useRef(null);

  // 2. FETCH DATA
  useEffect(() => {
    async function fetchRoster() {
      if (!supabase) {
        // Mock data if no DB connection
        const mocks = Array.from({ length: 10 }).map((_, i) => ({
          id: i,
          name: `Talent ${i + 1}`,
          gender: i % 2 === 0 ? "Female" : "Male",
          voice_type: ["Professional"],
          headshot_url: `https://placehold.co/100x100/1a1a1a/${color.replace(
            "#",
            ""
          )}?text=${i + 1}`,
          demo_url:
            "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        }));
        setRoster(mocks);
        setFilteredRoster(mocks);
        return;
      }

      const { data } = await supabase
        .from("actor_db")
        .select("id, name, gender, voice_type, headshot_url, demo_url")
        .eq("coming_soon", false)
        .order("name");

      if (data) {
        setRoster(data);
        setFilteredRoster(data);
      }
    }
    fetchRoster();
  }, [color]);

  // 3. FILTER LOGIC
  useEffect(() => {
    let result = roster;
    if (filter !== "All") {
      result = result.filter(
        (actor) => (actor.gender || "").toLowerCase() === filter.toLowerCase()
      );
    }
    if (search) {
      result = result.filter(
        (actor) =>
          actor.name.toLowerCase().includes(search.toLowerCase()) ||
          (actor.voice_type &&
            JSON.stringify(actor.voice_type)
              .toLowerCase()
              .includes(search.toLowerCase()))
      );
    }
    setFilteredRoster(result);
  }, [search, filter, roster]);

  // 4. AUDIO LOGIC
  const toggleAudio = (url) => {
    if (!url) return;
    if (playingUrl === url) {
      audioRef.current.pause();
      setPlayingUrl(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      setPlayingUrl(url);
      audioRef.current = new Audio(url);
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingUrl(null);
    }
  };

  return (
    <>
      {/* --- TRIGGER BUTTON --- */}
      {/* Positioned differently than QuickAccess to avoid collision (Lower down) */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed right-0 top-[60%] -translate-y-1/2 z-[50] flex flex-col items-center justify-center gap-3 py-6 px-2 bg-[#020010]/90 border-y border-l rounded-l-xl backdrop-blur-md hover:pl-4 transition-all duration-500 group
        ${
          isOpen
            ? "translate-x-full opacity-0 pointer-events-none"
            : "translate-x-0 opacity-100"
        }
        `}
        style={{
          borderColor: `${color}30`,
          boxShadow: `0 0 20px ${color}10`,
        }}
      >
        <Users size={16} className="animate-pulse" style={{ color: color }} />
        <span className="text-[10px] uppercase font-bold text-white/50 [writing-mode:vertical-rl] tracking-[0.2em] group-hover:text-white transition-colors duration-300">
          Scout Talent
        </span>
      </button>

      {/* --- SIDEBAR PANEL --- */}
      <div
        className={`fixed inset-y-0 right-0 z-[60] w-[85vw] md:w-[340px] bg-[#050505] border-l border-white/10 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="p-5 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-serif text-white tracking-wider flex items-center gap-2">
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${color}`,
                }}
              />
              Talent Matrix
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-white hover:rotate-90 transition-all p-2"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="relative group">
              <Search className="absolute left-3 top-2.5 text-gray-500 w-3 h-3 group-focus-within:text-white transition-colors" />
              <input
                type="text"
                placeholder="Search by name or style..."
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-xs text-white focus:bg-white/10 focus:outline-none transition-all placeholder:text-gray-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={(e) => (e.target.style.borderColor = color)}
                onBlur={(e) =>
                  (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                }
              />
            </div>

            <div className="flex p-1 bg-white/5 rounded-lg border border-white/5">
              {["All", "Male", "Female"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all ${
                    filter === f
                      ? "text-opacity-100 shadow-lg"
                      : "text-gray-500 hover:text-white"
                  }`}
                  style={{
                    backgroundColor:
                      filter === f ? `${color}20` : "transparent", // 12% opacity
                    color: filter === f ? color : undefined,
                  }}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ROSTER LIST */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 relative">
          {/* Background FX */}
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay pointer-events-none" />

          {filteredRoster.length === 0 ? (
            <div className="text-center py-10 opacity-50 text-xs text-white animate-fade-in-up">
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No actors found matching criteria.
            </div>
          ) : (
            filteredRoster.map((actor) => (
              <div
                key={actor.id}
                className="group relative flex items-center gap-3 p-2 pr-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] transition-all duration-300 animate-fade-in-up"
                style={{
                  borderColor: "rgba(255,255,255,0.05)", // Base border
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = `${color}40`)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)")
                }
              >
                <div className="relative w-12 h-12 shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={actor.headshot_url}
                    alt={actor.name}
                    className="w-full h-full rounded-lg object-cover border border-white/10 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#050505] rounded-full flex items-center justify-center border border-black">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate transition-colors group-hover:text-white">
                    {actor.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 group-hover:text-gray-400">
                    <span className="truncate max-w-[80px]">
                      {Array.isArray(actor.voice_type)
                        ? actor.voice_type[0]
                        : actor.voice_type || "Voice Actor"}
                    </span>
                    <span className="w-0.5 h-0.5 bg-gray-500 rounded-full" />
                    <span>{actor.gender}</span>
                  </div>
                </div>

                {actor.demo_url ? (
                  <button
                    onClick={() => toggleAudio(actor.demo_url)}
                    className="w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg text-white hover:scale-110"
                    style={{
                      backgroundColor:
                        playingUrl === actor.demo_url
                          ? color
                          : "rgba(255,255,255,0.1)",
                      color:
                        playingUrl === actor.demo_url ? "#000000" : "white",
                      boxShadow:
                        playingUrl === actor.demo_url
                          ? `0 0 15px ${color}60`
                          : "none",
                    }}
                  >
                    {playingUrl === actor.demo_url ? (
                      <Pause size={12} fill="currentColor" />
                    ) : (
                      <Play size={12} fill="currentColor" className="ml-0.5" />
                    )}
                  </button>
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center opacity-20 text-white">
                    <Music size={12} />
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-md">
          <Link
            href="/roster"
            className="flex items-center justify-center gap-2 w-full py-3 bg-white/5 border border-white/10 rounded-lg text-xs font-bold uppercase tracking-widest hover:text-black transition-all group"
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = color;
              e.currentTarget.style.borderColor = color;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)";
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
            }}
          >
            Full Roster View{" "}
            <ChevronRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in"
        />
      )}
    </>
  );
}
