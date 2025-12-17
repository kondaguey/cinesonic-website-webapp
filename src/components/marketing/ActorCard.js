"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Play, Pause, Lock, Mic, BarChart2 } from "lucide-react";

export default function ActorCard({ actor, onClick, color = "#d4af37" }) {
  // --- HELPER: Handle diverse DB formats for tags ---
  const getPrimaryTag = (raw) => {
    if (!raw) return "Voice Actor";
    if (Array.isArray(raw)) return raw[0];
    try {
      // Handle stringified JSON from Supabase text columns
      if (typeof raw === "string" && raw.startsWith("[")) {
        const parsed = JSON.parse(raw.replace(/'/g, '"'));
        return parsed[0] || "Voice Actor";
      }
    } catch (e) {
      // Fallback
    }
    return raw; // It was just a simple string
  };

  // --- HELPER: Safe Hex for Image Service ---
  // If color is a CSS var (var(--color-gold)), fallback to a hardcoded safe gold for the placeholder image
  const safeHex = color.startsWith("var") ? "d4af37" : color.replace("#", "");

  // --- 1. SAFE DATA NORMALIZATION ---
  const data = {
    id: actor?.id || 0,
    name: actor?.name || "Unknown Talent",
    voice_type: getPrimaryTag(actor?.voice_type),
    headshotUrl:
      actor?.headshotUrl ||
      actor?.headshot_url ||
      `https://placehold.co/400x600/0a0a0a/${safeHex}?text=No+Image`,
    isRevealed: actor?.isRevealed !== false,
    demoUrl:
      actor?.demo_url ||
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  };

  // --- 2. AUDIO ENGINE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    if (!data.demoUrl) return;
    const audio = new Audio(data.demoUrl);

    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener("ended", handleEnded);
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.removeEventListener("ended", handleEnded);
    };
  }, [data.demoUrl]);

  const toggleAudio = (e) => {
    e.stopPropagation(); // Prevent card click
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((err) => console.error("Playback failed", err));
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      onClick={onClick}
      className="group relative w-full h-[450px] rounded-2xl overflow-hidden cursor-pointer bg-[#0a0a0a] border border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
      style={{ "--theme-color": color }}
    >
      {/* --- DYNAMIC GLOW EFFECTS --- */}
      <div className="absolute inset-0 rounded-2xl border border-transparent group-hover:border-[var(--theme-color)]/50 transition-colors duration-500 pointer-events-none z-30" />

      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none z-20"
        style={{ boxShadow: `inset 0 0 60px ${color}20` }} // 20 = ~12% opacity hex
      />

      {/* --- BACKGROUND IMAGE --- */}
      <div className="absolute inset-0 bg-gray-900">
        <Image
          src={data.headshotUrl}
          alt={data.name}
          fill
          unoptimized={true}
          className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
            !data.isRevealed ? "blur-2xl grayscale opacity-20" : "opacity-90"
          }`}
        />
        {/* Gradient Overlay: Deep Space to Transparent */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020010] via-[#020010]/50 to-transparent" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end h-full">
        {data.isRevealed ? (
          <>
            {/* TOP LABEL (Badge) */}
            <div className="mb-auto pt-2 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -translate-y-2 group-hover:translate-y-0">
              <div
                className="px-3 py-1 bg-black/60 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-2"
                style={{ borderColor: `${color}40` }}
              >
                <Mic size={10} style={{ color: color }} />
                <span className="text-[10px] uppercase tracking-widest font-bold text-white">
                  {data.voice_type}
                </span>
              </div>
            </div>

            {/* NAME & ACTIONS */}
            <div className="space-y-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-3xl font-serif text-white font-bold leading-none drop-shadow-lg">
                {data.name}
              </h3>

              <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                {/* We use a manual button here instead of the Atom because we need
                   specific play/pause logic and icon swapping that is unique to this card context.
                   However, we matched the styling perfectly to the 'solid' Atom variant.
                */}
                <button
                  onClick={toggleAudio}
                  aria-label={isPlaying ? "Pause Demo" : "Play Demo"}
                  className="flex items-center gap-2 px-5 py-2.5 text-[#020010] text-[10px] font-bold uppercase tracking-[0.15em] rounded-lg hover:brightness-110 transition-all shadow-lg active:scale-95"
                  style={{ backgroundColor: color }}
                >
                  {isPlaying ? (
                    <>
                      <Pause size={12} fill="currentColor" /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={12} fill="currentColor" /> Play Demo
                    </>
                  )}
                </button>

                {/* Visualizer Animation */}
                {isPlaying && (
                  <div className="flex gap-1 h-4 items-end">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-1 rounded-full animate-music-bar"
                        style={{
                          backgroundColor: color,
                          animationDelay: `${i * 0.1}s`,
                          height: "100%",
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* --- LOCKED STATE --- */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4 animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md shadow-2xl">
              <Lock size={24} className="text-gray-500" />
            </div>
            <div>
              <h3 className="text-2xl font-serif text-gray-500 mb-1">
                Restricted
              </h3>
              <p
                className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-60"
                style={{ color: color }}
              >
                Clearance Required
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 3. LOCAL ANIMATIONS */}
      <style jsx>{`
        @keyframes music-bar {
          0%,
          100% {
            height: 20%;
          }
          50% {
            height: 100%;
          }
        }
        .animate-music-bar {
          animation: music-bar 0.8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
