"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient"; // Adjust path if needed
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

export default function RosterSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [roster, setRoster] = useState([]);
  const [filteredRoster, setFilteredRoster] = useState([]);

  // FILTERS
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  // AUDIO
  const [playingUrl, setPlayingUrl] = useState(null);
  const audioRef = useRef(null);

  // 1. FETCH DATA
  useEffect(() => {
    async function fetchRoster() {
      // Safety check for supabase
      if (!supabase) return;

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
  }, []);

  // 2. FILTER LOGIC
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
          (actor.voice_type && actor.voice_type.includes(search))
      );
    }
    setFilteredRoster(result);
  }, [search, filter, roster]);

  // 3. AUDIO LOGIC
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
      {/* --- TRIGGER BUTTON (Vertical Pill) --- */}
      {/* MOVED TO TOP-[60%] */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-0 top-[60%] -translate-y-1/2 z-[50] flex flex-col items-center justify-center gap-3 py-6 px-2 bg-[#020010]/80 border-y border-l border-[#00f0ff]/20 rounded-l-xl backdrop-blur-md hover:pl-4 transition-all group shadow-[0_0_20px_rgba(0,240,255,0.05)]"
        >
          <Users size={16} className="text-[#00f0ff] animate-pulse" />
          <span className="text-[10px] uppercase font-bold text-white/50 [writing-mode:vertical-rl] tracking-[0.2em] group-hover:text-white transition-colors">
            Scout Talent
          </span>
        </button>
      )}

      {/* --- SIDEBAR PANEL --- */}
      <div
        className={`fixed inset-y-0 right-0 z-[60] w-[320px] bg-[#050505]/95 backdrop-blur-xl border-l border-white/10 shadow-2xl transform transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* HEADER */}
        <div className="p-5 border-b border-white/10 bg-gradient-to-r from-[#0a0a15] to-[#020010]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-serif text-white tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#00f0ff] rounded-full shadow-[0_0_10px_#00f0ff]" />
              Talent Matrix
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-500 hover:text-white hover:rotate-90 transition-all"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-gray-500 w-3 h-3" />
              <input
                type="text"
                placeholder="Search by name or style..."
                className="w-full bg-white/5 border border-white/10 rounded-lg py-2 pl-8 pr-3 text-xs text-white focus:border-[#00f0ff] focus:bg-white/10 focus:outline-none transition-all placeholder:text-gray-600"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="flex p-1 bg-white/5 rounded-lg border border-white/5">
              {["All", "Male", "Female"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex-1 py-1.5 text-[10px] uppercase font-bold tracking-wider rounded-md transition-all ${
                    filter === f
                      ? "bg-[#00f0ff]/10 text-[#00f0ff] shadow-[0_0_10px_rgba(0,240,255,0.1)]"
                      : "text-gray-500 hover:text-white"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ROSTER LIST (SCROLLABLE) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
          {filteredRoster.length === 0 ? (
            <div className="text-center py-10 opacity-50 text-xs text-white">
              <Filter className="w-8 h-8 mx-auto mb-2 opacity-50" />
              No actors found matching criteria.
            </div>
          ) : (
            filteredRoster.map((actor) => (
              <div
                key={actor.id}
                className="group relative flex items-center gap-3 p-2 pr-3 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.06] hover:border-[#00f0ff]/30 transition-all duration-300"
              >
                <div className="relative w-12 h-12 shrink-0">
                  <img
                    src={actor.headshot_url}
                    alt={actor.name}
                    className="w-full h-full rounded-lg object-cover border border-white/10 group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#050505] rounded-full flex items-center justify-center">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-white truncate group-hover:text-[#00f0ff] transition-colors">
                    {actor.name}
                  </h4>
                  <div className="flex items-center gap-2 text-[10px] text-gray-500 group-hover:text-gray-400">
                    <span className="truncate max-w-[80px]">
                      {actor.voice_type?.[0] || "Voice Actor"}
                    </span>
                    <span className="w-0.5 h-0.5 bg-gray-500 rounded-full" />
                    <span>{actor.gender}</span>
                  </div>
                </div>

                {actor.demo_url ? (
                  <button
                    onClick={() => toggleAudio(actor.demo_url)}
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-lg ${
                      playingUrl === actor.demo_url
                        ? "bg-[#00f0ff] text-black scale-110"
                        : "bg-white/10 text-white hover:bg-[#00f0ff] hover:text-black hover:scale-110"
                    }`}
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
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#00f0ff]/10 border border-[#00f0ff]/30 rounded-lg text-[#00f0ff] text-xs font-bold uppercase tracking-widest hover:bg-[#00f0ff] hover:text-black transition-all"
          >
            Full Roster View <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity"
        />
      )}
    </>
  );
}
