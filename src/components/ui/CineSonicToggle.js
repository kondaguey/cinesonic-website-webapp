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

// 🟢 HARDCODED PALETTE
const THEME_CONFIG = {
  gold: { hex: "#d4af37", rgb: "212, 175, 55" },
  pink: { hex: "#ff3399", rgb: "255, 51, 153" },
  fire: { hex: "#ff4500", rgb: "255, 69, 0" },
  cyan: { hex: "#00f0ff", rgb: "0, 240, 255" },
  system: { hex: "#3b82f6", rgb: "59, 130, 246" },
  violet: { hex: "#7c3aed", rgb: "124, 58, 237" },
};

export default function CineSonicToggle() {
  const { theme, isCinematic, setIsCinematic, activeStyles } = useTheme();

  const currentTheme = THEME_CONFIG[theme] || THEME_CONFIG.gold;
  const cineTheme = THEME_CONFIG.violet;

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

  return (
    <div
      className="flex items-center gap-4 md:gap-6 pointer-events-auto select-none"
      style={{
        "--sonic-color": currentTheme.hex,
        "--sonic-rgb": currentTheme.rgb,
        "--cine-color": cineTheme.hex,
        "--cine-rgb": cineTheme.rgb,
      }}
    >
      {/* LEFT LABEL */}
      <span
        className={`text-xs md:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer ${
          !isCinematic
            ? "opacity-100 scale-105"
            : "opacity-40 scale-100 text-gray-500"
        }`}
        style={{
          color: !isCinematic ? "var(--sonic-color)" : undefined,
          textShadow: !isCinematic
            ? "0 0 15px rgba(var(--sonic-rgb), 0.6)"
            : "none",
        }}
        onClick={() => setIsCinematic(false)}
      >
        Sonic Mode
      </span>

      {/* THE SWITCH */}
      <button
        onClick={() => setIsCinematic(!isCinematic)}
        className="group relative inline-flex items-center justify-center cursor-pointer active:scale-95 transition-transform duration-200"
        aria-label="Toggle Cinematic Mode"
      >
        {/* TRACK */}
        <div className="relative w-20 h-10 rounded-full overflow-hidden border border-white/10 shadow-inner">
          {/* Layer 1: Sonic Background */}
          <div
            className="absolute inset-0 transition-colors duration-500"
            style={{ backgroundColor: "rgba(var(--sonic-rgb), 0.2)" }}
          />

          {/* Layer 2: Cine Background */}
          <div
            className="absolute inset-0 transition-opacity duration-500 ease-in-out"
            style={{
              backgroundColor: "rgba(var(--cine-rgb), 0.2)",
              opacity: isCinematic ? 1 : 0,
            }}
          />

          {/* Layer 3: Dynamic Border */}
          <div
            className="absolute inset-0 rounded-full border transition-colors duration-500"
            style={{
              borderColor: isCinematic
                ? "var(--cine-color)"
                : "var(--sonic-color)",
              boxShadow: `0 0 20px rgba(${
                isCinematic ? "var(--cine-rgb)" : "var(--sonic-rgb)"
              }, 0.4)`,
            }}
          />

          {/* ICONS ON TRACK */}
          <div className="absolute inset-0 flex items-center justify-between px-2 z-10">
            {/* LEFT ICON (Sonic) */}
            {/* 🟢 TIME MANIPULATION: 
                 We removed 'transition-all'. Now we ONLY animate opacity/filter.
                 The color snaps instantly (0ms), eliminating the white flash interpolation.
             */}
            <div
              className={`transition-[opacity,transform,filter] duration-500 text-[var(--sonic-color)] ${
                isCinematic ? "opacity-30 blur-[1px]" : "opacity-100"
              }`}
            >
              <Icons.Standard size={14} />
            </div>

            {/* RIGHT ICON (Cine) */}
            <div
              className={`transition-[opacity,transform,filter] duration-500 text-[var(--cine-color)] ${
                isCinematic ? "opacity-100" : "opacity-30 blur-[1px]"
              }`}
            >
              <Icons.Cinematic size={14} />
            </div>
          </div>
        </div>

        {/* KNOB */}
        <div
          className="absolute left-1 top-1 w-8 h-8 rounded-full shadow-lg flex items-center justify-center border border-white/20 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-20"
          style={{
            backgroundColor: isCinematic
              ? "var(--cine-color)"
              : "var(--sonic-color)",
            transform: isCinematic ? "translateX(125%)" : "translateX(0%)",
            boxShadow: `0 0 15px ${
              isCinematic ? "var(--cine-color)" : "var(--sonic-color)"
            }`,
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Standard Icon inside Knob */}
            <Icons.Standard
              size={16}
              className={`absolute transition-[opacity,transform] duration-500 text-[#020010] ${
                isCinematic
                  ? "opacity-0 scale-50 rotate-[-90deg]"
                  : "opacity-100 scale-100 rotate-0"
              }`}
            />

            {/* Cinematic Icon inside Knob */}
            <Icons.Cinematic
              size={16}
              className={`absolute transition-[opacity,transform] duration-500 text-white ${
                isCinematic
                  ? "opacity-100 scale-100 rotate-0"
                  : "opacity-0 scale-50 rotate-[90deg]"
              }`}
            />
          </div>
        </div>
      </button>

      {/* RIGHT LABEL */}
      <span
        className={`text-xs md:text-sm font-bold tracking-[0.2em] uppercase transition-all duration-500 cursor-pointer ${
          isCinematic
            ? `${activeStyles?.shimmer} opacity-100 scale-105`
            : "opacity-40 scale-100 text-gray-500"
        }`}
        onClick={() => setIsCinematic(true)}
      >
        CineSonic Mode
      </span>
    </div>
  );
}
