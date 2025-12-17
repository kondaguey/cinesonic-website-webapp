"use client";

import React from "react";
import { useTheme } from "./ThemeContext";
import { Sparkles, Zap, Clapperboard } from "lucide-react";

export default function CineSonicToggle() {
  const { isCinematic, setIsCinematic } = useTheme();

  const VIOLET = "#7c3aed";

  return (
    // 🟢 Z-INDEX 10000 ensures this is ALWAYS clickable, even if the world is exploding
    <div className="relative z-[10000] flex flex-col items-center gap-4 py-8 animate-fade-in-up">
      <div className="flex items-center gap-6">
        {/* Label Left */}
        <span
          className={`text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase transition-all duration-500 ${
            !isCinematic
              ? "text-white opacity-100"
              : "text-white opacity-30 blur-[1px]"
          }`}
        >
          Sonic
        </span>

        {/* THE SWITCH */}
        <button
          // 🟢 Pointer Events Auto ensures it catches clicks
          className="relative w-24 h-12 rounded-full border bg-black/50 transition-all duration-700 shadow-inner group overflow-hidden cursor-pointer"
          onClick={(e) => {
            // Prevent event bubbling just in case
            e.stopPropagation();
            setIsCinematic(!isCinematic);
          }}
          style={{
            borderColor: isCinematic ? VIOLET : "rgba(255,255,255,0.1)",
            boxShadow: isCinematic
              ? `0 0 30px ${VIOLET}40, inset 0 0 20px ${VIOLET}20`
              : "inset 0 0 10px rgba(0,0,0,0.8)",
          }}
        >
          {/* Violet Energy Background */}
          <div
            className="absolute inset-0 transition-opacity duration-700 pointer-events-none"
            style={{
              opacity: isCinematic ? 0.4 : 0,
              background: `linear-gradient(90deg, transparent, ${VIOLET}, transparent)`,
            }}
          />

          {/* The Knob */}
          <div
            className="absolute top-1 left-1 w-10 h-10 rounded-full bg-white shadow-lg transition-all duration-700 cubic-bezier(0.34, 1.56, 0.64, 1) flex items-center justify-center z-10 pointer-events-none"
            style={{
              transform: isCinematic ? "translateX(100%)" : "translateX(0)",
              backgroundColor: isCinematic ? VIOLET : "white",
              boxShadow: isCinematic
                ? `0 0 20px ${VIOLET}`
                : "0 2px 5px rgba(0,0,0,0.5)",
            }}
          >
            {isCinematic ? (
              <Clapperboard size={16} className="text-white animate-pulse" />
            ) : (
              <Zap size={16} className="text-black/50" />
            )}
          </div>
        </button>

        {/* Label Right */}
        <span
          className={`text-[10px] md:text-xs font-bold tracking-[0.25em] uppercase transition-all duration-500 flex items-center gap-2 ${
            isCinematic
              ? "text-[#7c3aed] opacity-100"
              : "text-white opacity-30 blur-[1px]"
          }`}
          style={{ textShadow: isCinematic ? `0 0 20px ${VIOLET}` : "none" }}
        >
          CineSonic
        </span>
      </div>

      {/* Helper Text */}
      <p className="text-[9px] text-white/30 uppercase tracking-widest font-mono select-none">
        {isCinematic ? "Audio Drama Mode: ON" : "Standard Production"}
      </p>
    </div>
  );
}
