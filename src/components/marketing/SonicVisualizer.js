"use client";
import React, { useState, useRef, useEffect } from "react";
import { Play, Pause, FastForward, Rewind, Volume2 } from "lucide-react";

export default function SonicVisualizer({
  src,
  title = "Demo Track",
  artist = "CineSonic Production",
}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(180); // Dummy duration (3 mins)

  // Simulation loop for the progress bar
  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.5));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="w-full max-w-3xl mx-auto p-1">
      {/* OUTER GRADIENT BORDER */}
      <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-white/10 via-[#d4af37]/50 to-white/10 shadow-[0_0_50px_rgba(212,175,55,0.15)]">
        {/* INNER CARD - THE GRADIENT REQUESTED */}
        <div className="relative rounded-[23px] bg-gradient-to-br from-[#1a1a1a] via-[#0a0a0a] to-black overflow-hidden backdrop-blur-xl">
          {/* Ambient Noise Texture */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

          {/* Main Content Grid */}
          <div className="relative z-10 p-8 grid grid-cols-1 md:grid-cols-[auto_1fr] gap-8 items-center">
            {/* ALBUM ART / PLAY BUTTON */}
            <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-black/50 border border-white/10 flex items-center justify-center group overflow-hidden">
              {/* Spinning Disc Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-tr from-[#d4af37]/20 to-transparent rounded-full blur-xl ${
                  isPlaying ? "animate-spin-slow" : ""
                }`}
              />

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-16 h-16 rounded-full bg-[#d4af37] flex items-center justify-center text-black hover:scale-110 transition-transform shadow-[0_0_20px_#d4af37]"
              >
                {isPlaying ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={24} fill="currentColor" className="ml-1" />
                )}
              </button>
            </div>

            {/* TRACK INFO & VISUALIZER */}
            <div className="w-full space-y-6">
              {/* Meta Data */}
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-white font-serif text-2xl tracking-tight">
                    {title}
                  </h3>
                  <p className="text-[#d4af37] text-xs font-bold uppercase tracking-widest">
                    {artist}
                  </p>
                </div>
                {/* Fake Duration */}
                <div className="text-white/40 text-xs font-mono">
                  02:14 / 03:00
                </div>
              </div>

              {/* THE WAVEFORM (CSS Animated) */}
              <div className="h-12 flex items-center gap-[3px] opacity-80">
                {[...Array(40)].map((_, i) => (
                  <div
                    key={i}
                    className="w-1 bg-[#d4af37] rounded-full transition-all duration-150"
                    style={{
                      height: isPlaying ? `${Math.random() * 100}%` : "10%",
                      opacity: isPlaying ? 1 : 0.3,
                      // Creates a "wave" delay effect
                      animationDelay: `${i * 0.05}s`,
                    }}
                  />
                ))}
              </div>

              {/* Progress Bar */}
              <div className="relative h-1 w-full bg-white/10 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-[#d4af37] shadow-[0_0_10px_#d4af37] transition-all duration-100 ease-linear"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Controls (Visual Only) */}
              <div className="flex items-center justify-between text-white/40">
                <div className="flex gap-4">
                  <Rewind
                    size={20}
                    className="hover:text-white cursor-pointer"
                  />
                  <FastForward
                    size={20}
                    className="hover:text-white cursor-pointer"
                  />
                </div>
                <Volume2
                  size={20}
                  className="hover:text-white cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
