"use client";

import React from "react";
import { useTheme } from "./ThemeContext";
import {
  Mic,
  Music,
  Users,
  Flame,
  Rocket,
  Zap,
  Heart,
  Sparkles,
} from "lucide-react";

export default function CineSonicToggle() {
  const { theme, isCinematic, setIsCinematic, activeStyles } = useTheme();

  // 1. DYNAMIC ICON MAPPING
  const getIcons = () => {
    switch (theme) {
      case "pink":
        return { Standard: Users, Cinematic: Heart };
      case "fire":
        return { Standard: Flame, Cinematic: Zap };
      case "cyan":
        return { Standard: Rocket, Cinematic: Sparkles };
      case "gold":
      default:
        return { Standard: Mic, Cinematic: Music };
    }
  };

  const Icons = getIcons();

  // 2. COLOR LOGIC
  const activeColor = isCinematic
    ? "#7c3aed"
    : activeStyles?.color || "#d4af37";

  return (
    <div className="flex items-center gap-4 md:gap-6 pointer-events-auto">
      {/* 🟢 LEFT LABEL: Sonic Mode (Solid Theme Color) */}
      <span
        className={`text-xs md:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer ${
          !isCinematic
            ? "opacity-100 scale-105"
            : "opacity-40 scale-100 text-gray-500"
        }`}
        style={{
          color: !isCinematic ? activeColor : undefined,
          textShadow: !isCinematic ? `0 0 15px ${activeColor}60` : "none",
        }}
        onClick={() => setIsCinematic(false)}
      >
        Sonic Mode
      </span>

      {/* 🟢 THE SWITCH */}
      <button
        onClick={() => setIsCinematic(!isCinematic)}
        className="group relative inline-flex items-center justify-center cursor-pointer transition-transform active:scale-95"
        aria-label="Toggle Cinematic Mode"
      >
        {/* Track */}
        <div
          className="w-20 h-10 rounded-full border transition-all duration-500 ease-out flex items-center justify-between px-2 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
          style={{
            borderColor: activeColor,
            backgroundColor: isCinematic
              ? "rgba(124, 58, 237, 0.2)"
              : `${activeColor}20`,
            boxShadow: `0 0 20px ${activeColor}40`,
          }}
        >
          {/* Left Icon Placeholder */}
          <div
            className={`transition-opacity duration-300 ${
              isCinematic ? "opacity-30 blur-[1px]" : "opacity-100"
            }`}
          >
            <Icons.Standard
              size={14}
              color={isCinematic ? "#ffffff" : activeColor}
            />
          </div>

          {/* Right Icon Placeholder */}
          <div
            className={`transition-opacity duration-300 ${
              isCinematic ? "opacity-100" : "opacity-30 blur-[1px]"
            }`}
          >
            <Icons.Cinematic
              size={14}
              color={isCinematic ? "#ffffff" : activeColor}
            />
          </div>
        </div>

        {/* Knob */}
        <div
          className="absolute left-1 top-1 w-8 h-8 rounded-full shadow-lg transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center border border-white/20"
          style={{
            backgroundColor: activeColor,
            transform: isCinematic ? "translateX(125%)" : "translateX(0%)",
            boxShadow: `0 0 15px ${activeColor}`,
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Icons.Standard
              size={16}
              className={`absolute transition-all duration-300 text-[#020010] ${
                isCinematic
                  ? "opacity-0 scale-50 rotate-[-90deg]"
                  : "opacity-100 scale-100 rotate-0"
              }`}
            />
            <Icons.Cinematic
              size={16}
              className={`absolute transition-all duration-300 text-white ${
                isCinematic
                  ? "opacity-100 scale-100 rotate-0"
                  : "opacity-0 scale-50 rotate-[90deg]"
              }`}
            />
          </div>
        </div>
      </button>

      {/* 🟢 RIGHT LABEL: CineSonic Mode (The Shimmer!) */}
      <span
        className={`text-xs md:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer ${
          isCinematic
            ? `${activeStyles?.shimmer} opacity-100 scale-105` // Applies the oily flow class
            : "opacity-40 scale-100 text-gray-500"
        }`}
        onClick={() => setIsCinematic(true)}
      >
        CineSonic Mode
      </span>
    </div>
  );
}
