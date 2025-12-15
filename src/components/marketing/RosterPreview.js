"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import ActorCard from "./ActorCard";
import { ArrowRight, Shuffle, Sparkles, Users } from "lucide-react";

// --- CONFIGURATION ---
const DISPLAY_COUNT = 4;

export default function RosterPreview({ accentColor = "#d4af37" }) {
  const [allActors, setAllActors] = useState([]);
  const [previewActors, setPreviewActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);

  useEffect(() => {
    async function fetchRoster() {
      try {
        const { data, error } = await supabase
          .from("actor_db")
          .select("*")
          .order("name", { ascending: true });

        if (error) throw error;

        const mapped = data.map((actor) => ({
          ...actor,
          isRevealed: !actor.coming_soon,
          roleName: cleanVoiceType(actor.voice_type),
          headshotUrl: actor.headshot_url,
        }));

        setAllActors(mapped);

        const initial = [...mapped].sort(() => 0.5 - Math.random());
        setPreviewActors(initial.slice(0, DISPLAY_COUNT));
      } catch (err) {
        console.error("Error fetching preview:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchRoster();
  }, []);

  const runShuffle = () => {
    if (allActors.length === 0) return;
    setIsShuffling(true);

    let shuffled = [...allActors];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    if (
      previewActors.length > 0 &&
      shuffled[0].id === previewActors[0].id &&
      shuffled.length > 1
    ) {
      const first = shuffled.shift();
      shuffled.push(first);
    }

    setPreviewActors(shuffled.slice(0, DISPLAY_COUNT));
    setTimeout(() => setIsShuffling(false), 600);
  };

  const cleanVoiceType = (rawInput) => {
    if (!rawInput) return "Voice Actor";
    try {
      if (rawInput.trim().startsWith("[")) {
        const parsed = JSON.parse(rawInput.replace(/'/g, '"'));
        return parsed.join("  •  ");
      }
      return rawInput;
    } catch (e) {
      return rawInput.replace(/[\[\]"]/g, "");
    }
  };

  return (
    <section
      className="relative py-24 bg-[#020014] overflow-hidden"
      style={{ "--color-gold": accentColor }}
    >
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[var(--color-gold)]/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-3xl">
            <h5 className="text-[var(--color-gold)] font-bold text-xs tracking-widest uppercase mb-4 flex items-center gap-2">
              <Sparkles size={12} className="text-[var(--color-gold)]" />
              Production Intelligence
            </h5>

            <h2 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif font-light tracking-tight leading-tight mb-4">
              The Art of <br className="hidden md:block" />
              <span className="text-[var(--color-gold)] font-normal">
                Human Performance.
              </span>
            </h2>

            <p className="text-white/40 font-light text-lg max-w-xl leading-relaxed">
              Precision casting for immersive narratives. A curated ensemble of
              industry-defining talent.
            </p>
          </div>

          {/* ACTIONS (Desktop) */}
          <div className="hidden md:flex flex-col items-end gap-4 mb-2">
            <div className="flex gap-4">
              <button
                onClick={runShuffle}
                disabled={loading || isShuffling}
                className="group relative px-6 py-3 rounded-full bg-[var(--color-gold)]/5 border border-[var(--color-gold)]/30 text-[var(--color-gold)] text-[11px] font-bold uppercase tracking-widest hover:bg-[var(--color-gold)]/10 transition-all duration-300 flex items-center gap-3 w-fit"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--color-gold)] opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--color-gold)]"></span>
                </span>
                <span>Random Selection</span>
                <Shuffle
                  size={14}
                  className={`transition-transform duration-700 ease-in-out ${
                    isShuffling
                      ? "rotate-180 scale-110"
                      : "group-hover:rotate-12"
                  }`}
                />
              </button>

              <Link
                href="/roster"
                className="group relative px-6 py-3 rounded-full bg-[var(--color-gold)] text-[#020014] text-[11px] font-bold uppercase tracking-widest hover:bg-white transition-all duration-300 flex items-center gap-2 shadow-lg shadow-[var(--color-gold)]/20"
              >
                <Users size={14} />
                <span>View Full Roster</span>
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>

            <span className="text-[10px] text-gray-600 uppercase tracking-widest pr-4">
              {allActors.length} Active Voices Available
            </span>
          </div>
        </div>

        {/* --- GRID LAYOUT (FIXED FOR MOBILE) --- */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-2 border-white/10 border-t-[var(--color-gold)] rounded-full animate-spin" />
          </div>
        ) : (
          // 🟢 FIX HERE: grid-cols-1 on mobile, sm:grid-cols-2 on tablet, md:grid-cols-4 on desktop
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 min-h-[400px]">
            {previewActors.map((actor, index) => (
              <Link
                key={`${actor.id}-${index}`}
                href="/roster"
                className={`block h-full transition-all duration-700 ${
                  isShuffling
                    ? "opacity-50 scale-95 blur-sm"
                    : "opacity-100 scale-100 blur-0"
                }`}
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <div className="transform hover:-translate-y-2 transition-transform duration-500 h-full">
                  <ActorCard actor={actor} />
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* MOBILE CONTROLS */}
        <div className="mt-12 flex flex-col items-center gap-4 md:hidden">
          <button
            onClick={runShuffle}
            className="flex items-center gap-2 text-[var(--color-gold)] text-xs font-bold uppercase tracking-widest border border-[var(--color-gold)]/30 px-6 py-3 rounded-full hover:bg-[var(--color-gold)]/10"
          >
            <Shuffle size={14} /> Random Selection
          </button>

          <Link
            href="/roster"
            className="w-full text-center px-8 py-4 bg-[var(--color-gold)] text-black font-bold text-xs uppercase tracking-widest rounded shadow-lg"
          >
            View Full Roster
          </Link>
        </div>
      </div>
    </section>
  );
}
