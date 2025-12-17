"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js"; // Direct import if lib alias fails
import ActorCard from "./ActorCard"; // Ensure this path is correct based on folder structure
import { ArrowRight, RefreshCw, Layers, Sparkles } from "lucide-react";

// --- CONFIG ---
const DISPLAY_COUNT = 4;

// Initialize Supabase Client locally if global lib isn't available in this context yet
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

export default function RosterPreview({ theme = "gold" }) {
  // 1. LOCAL COLOR MAP (Standardizing the Pattern)
  const themeConfig = {
    gold: { hex: "#d4af37" },
    pink: { hex: "#ff3399" },
    fire: { hex: "#ff4500" },
    cyan: { hex: "#00f0ff" },
    system: { hex: "#3b82f6" },
  };

  const activeTheme = themeConfig[theme] || themeConfig.gold;
  const accentColor = activeTheme.hex;

  const [allActors, setAllActors] = useState([]);
  const [previewActors, setPreviewActors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isShuffling, setIsShuffling] = useState(false);

  // --- 2. DATA FETCHING ---
  useEffect(() => {
    async function fetchRoster() {
      try {
        if (!supabase) {
          // Fallback Mock Data if Supabase isn't connected
          const mocks = Array.from({ length: 8 }).map((_, i) => ({
            id: i,
            name: `Talent ${i + 1}`,
            voice_type: "Professional",
            isRevealed: true,
          }));
          setAllActors(mocks);
          setPreviewActors(mocks.slice(0, DISPLAY_COUNT));
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("actor_db")
          .select("*")
          .eq("coming_soon", false)
          .order("name", { ascending: true });

        if (error) throw error;

        const mapped = data.map((actor) => ({
          ...actor,
          isRevealed: true,
        }));

        setAllActors(mapped);

        // Initial Randomize
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

  // --- 3. SHUFFLE MECHANIC ---
  const runShuffle = () => {
    if (allActors.length === 0 || isShuffling) return;
    setIsShuffling(true);

    // Cinematic delay sequence
    setTimeout(() => {
      let shuffled = [...allActors];
      // Fisher-Yates Shuffle
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Ensure we don't just show the same first person if possible
      if (
        previewActors.length > 0 &&
        shuffled.length > 4 &&
        shuffled[0].id === previewActors[0].id
      ) {
        shuffled.shift();
      }

      setPreviewActors(shuffled.slice(0, DISPLAY_COUNT));

      // End animation
      setTimeout(() => setIsShuffling(false), 500);
    }, 300); // Wait for fade out to complete
  };

  return (
    <section
      className="relative py-24 md:py-32 bg-[#020010] overflow-hidden"
      style={{ "--theme-glow": accentColor }}
    >
      {/* --- ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Dynamic Color Glow */}
        <div
          className="absolute top-0 right-0 w-[50vw] h-[50vh] opacity-[0.08] blur-[150px] rounded-full translate-x-1/2 -translate-y-1/2 transition-colors duration-1000"
          style={{ backgroundColor: "var(--theme-glow)" }}
        />
        {/* Grain */}
        <div className="absolute inset-0 opacity-[0.04] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8 animate-fade-in-up">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 mb-6">
              <Sparkles
                className="w-4 h-4 transition-colors duration-500"
                style={{ color: "var(--theme-glow)" }}
                strokeWidth={1.5}
              />
              <span
                className="text-[10px] font-bold uppercase tracking-[0.3em] opacity-80 transition-colors duration-500"
                style={{ color: "var(--theme-glow)" }}
              >
                The Ensemble
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-[1.1]">
              Voices that <br />
              <span
                className="bg-clip-text text-transparent italic transition-all duration-500"
                style={{
                  backgroundImage: `linear-gradient(to right, white, white, var(--theme-glow))`,
                }}
              >
                command attention.
              </span>
            </h2>

            <p className="text-white/40 font-light text-lg max-w-lg leading-relaxed">
              Precision casting for immersive narratives. A curated roster of
              industry-defining talent, tailored to your genre.
            </p>
          </div>

          {/* DESKTOP CONTROLS */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={runShuffle}
              disabled={loading}
              className="group flex items-center gap-3 px-6 py-3 rounded-full border border-white/10 bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-300"
              style={{
                borderColor: isShuffling
                  ? "var(--theme-glow)"
                  : "rgba(255,255,255,0.1)",
              }}
            >
              <RefreshCw
                size={14}
                className={`text-white/50 transition-all duration-700 ${
                  isShuffling
                    ? "animate-spin text-[var(--theme-glow)]"
                    : "group-hover:text-white"
                }`}
              />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/50 group-hover:text-white transition-colors">
                Shuffle
              </span>
            </button>

            <Link
              href="/roster"
              className="group flex items-center gap-3 px-6 py-3 rounded-full text-[#020010] hover:scale-105 transition-all duration-300 shadow-lg"
              style={{ backgroundColor: "var(--theme-glow)" }}
            >
              <span className="text-[11px] font-bold uppercase tracking-widest">
                Full Roster
              </span>
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>

        {/* --- GRID --- */}
        <div className="relative min-h-[400px]">
          {loading ? (
            // Loading Skeleton
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-2xl bg-white/5 animate-pulse"
                />
              ))}
            </div>
          ) : (
            // Active Grid
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
              {previewActors.map((actor, index) => (
                <div
                  key={actor.id}
                  // Staggered Entrance + Shuffle Animation Logic
                  style={{ animationDelay: `${index * 100}ms` }}
                  className={`
                    block group relative transition-all duration-500 ease-out
                    ${
                      isShuffling
                        ? "opacity-0 scale-95 blur-md translate-y-4"
                        : "opacity-100 scale-100 blur-0 translate-y-0"
                    }
                  `}
                >
                  <div className="transform transition-transform duration-500 group-hover:-translate-y-2 h-full">
                    {/* Pass the dynamic color down to the card */}
                    <ActorCard
                      actor={actor}
                      color={accentColor}
                      onClick={() => {}} // Could link to modal if desired
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* --- MOBILE CONTROLS (Bottom) --- */}
        <div className="mt-12 flex flex-col gap-4 md:hidden animate-fade-in-up">
          <button
            onClick={runShuffle}
            disabled={loading}
            className="w-full flex justify-center items-center gap-3 px-6 py-4 rounded-xl border border-white/10 bg-white/[0.02] active:bg-white/5 transition-all"
            style={{
              borderColor: isShuffling
                ? "var(--theme-glow)"
                : "rgba(255,255,255,0.1)",
            }}
          >
            <RefreshCw
              size={16}
              className={`text-[var(--theme-glow)] ${
                isShuffling ? "animate-spin" : ""
              }`}
            />
            <span className="text-xs font-bold uppercase tracking-widest text-white/80">
              Refresh Selection
            </span>
          </button>

          <Link
            href="/roster"
            className="w-full flex justify-center items-center gap-3 px-6 py-4 rounded-xl text-[#020010] font-bold shadow-lg"
            style={{ backgroundColor: "var(--theme-glow)" }}
          >
            <span className="text-xs uppercase tracking-widest">
              View Full Roster
            </span>
            <Layers size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
