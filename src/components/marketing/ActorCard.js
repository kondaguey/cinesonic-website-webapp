"use client";
import React, { useState, useRef } from "react";
import Image from "next/image";
import { Play, Pause, Star, Lock } from "lucide-react";

export default function ActorCard({ actor, onClick }) {
  // --- 1. SAFE DATA HANDLING ---
  // We explicitly map snake_case (DB) to camelCase (Frontend)
  // giving us a reliable data object to work with.
  const data = {
    id: actor?.id || 0,
    name: actor?.name || "Unknown Talent",
    voice_type: actor?.voice_type || "Voice Actor",
    // Use the provided URL, or fall back to a specific Gold placeholder
    headshotUrl:
      actor?.headshotUrl ||
      actor?.headshot_url ||
      "https://placehold.co/400x600/1a1a1a/d4af37?text=No+Image",
    isRevealed: actor?.isRevealed !== false, // Default to true unless explicitly false
    // Dummy audio for testing if none provided
    demoUrl:
      actor?.demo_url ||
      "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  };

  // --- 2. AUDIO STATE ---
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  const toggleAudio = (e) => {
    e.stopPropagation(); // Stop the card click from firing
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div
      onClick={onClick}
      className="group relative w-full h-[450px] rounded-2xl overflow-hidden cursor-pointer bg-black/40 border border-white/10 hover:border-gold/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(212,175,55,0.15)]"
    >
      {/* --- HIDDEN AUDIO ELEMENT --- */}
      <audio
        ref={audioRef}
        src={data.demoUrl}
        onEnded={() => setIsPlaying(false)}
        onError={() => console.log("Audio failed to load")}
      />

      {/* --- BACKGROUND IMAGE --- */}
      <div className="absolute inset-0 bg-gray-900">
        <Image
          src={data.headshotUrl}
          alt={data.name}
          fill
          unoptimized={true} // <--- FIXES THE BROKEN IMAGE ISSUE
          className={`object-cover transition-transform duration-700 group-hover:scale-105 ${
            !data.isRevealed ? "blur-xl grayscale opacity-30" : "opacity-90"
          }`}
        />

        {/* Cinematic Gradient Overlay (Bottom Up) */}
        <div className="absolute inset-0 bg-gradient-to-t from-deep-space via-deep-space/40 to-transparent" />
      </div>

      {/* --- CONTENT LAYER --- */}
      <div className="absolute bottom-0 left-0 w-full p-6 z-20 flex flex-col justify-end h-full">
        {data.isRevealed ? (
          <>
            {/* Top Label */}
            <div className="mb-auto pt-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="px-2 py-1 bg-black/60 backdrop-blur-md rounded border border-white/10">
                <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                  {data.voice_type}
                </span>
              </div>
            </div>

            {/* Name & Sample Button */}
            <div className="space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="text-3xl font-serif text-white font-bold leading-none drop-shadow-md">
                {data.name}
              </h3>

              <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                <button
                  onClick={toggleAudio}
                  className="flex items-center gap-2 px-4 py-2 bg-gold text-black text-xs font-bold uppercase tracking-widest rounded-full hover:bg-white transition-colors shadow-lg"
                >
                  {isPlaying ? (
                    <>
                      <Pause size={12} fill="currentColor" /> Stop
                    </>
                  ) : (
                    <>
                      <Play size={12} fill="currentColor" /> Sample
                    </>
                  )}
                </button>
                {/* Visualizer bars animation (fake) */}
                {isPlaying && (
                  <div className="flex gap-1 h-3 items-end">
                    <div className="w-1 bg-gold animate-[bounce_1s_infinite] h-full"></div>
                    <div className="w-1 bg-gold animate-[bounce_1.2s_infinite] h-2/3"></div>
                    <div className="w-1 bg-gold animate-[bounce_0.8s_infinite] h-full"></div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* LOCKED STATE */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center backdrop-blur-md">
              <Lock size={24} className="text-white/40" />
            </div>
            <div>
              <h3 className="text-2xl font-serif text-white/50 mb-1">
                Restricted
              </h3>
              <p className="text-xs text-gold uppercase tracking-widest">
                Clearance Required
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
