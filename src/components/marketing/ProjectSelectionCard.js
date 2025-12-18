"use client";

import React from "react";
import ParticleFx from "../ui/ParticleFx";

export default function ProjectSelectionCard({
  id,
  title,
  price,
  desc,
  icon: Icon,
  baseType,
  isDrama,
  isSelected,
  onSelect,
}) {
  const COLORS = {
    Solo: { hex: "#d4af37", hybrid: "text-shimmer-gold-violet" },
    Dual: { hex: "#ff3399", hybrid: "text-shimmer-pink-violet" },
    Duet: { hex: "#ff4500", hybrid: "text-shimmer-fire-violet" },
    Multi: { hex: "#00f0ff", hybrid: "text-shimmer-cyan-violet" },
  };

  const config = COLORS[baseType] || COLORS.Solo;
  const baseColor = config.hex;
  const violetColor = "#7c3aed";
  const activeBorderColor = isDrama ? violetColor : baseColor;

  return (
    <button
      type="button"
      onClick={() => onSelect(id, baseType, isDrama)}
      // 🟢 REMOVED overflow-hidden from button to allow the glow to breathe
      className={`relative h-44 w-full rounded-2xl border transition-all duration-500 group text-left p-0 flex flex-col justify-between isolate
        ${
          isSelected
            ? "scale-[1.02] bg-[#0a0a15]"
            : "border-white/10 bg-[#0a0a15] hover:border-white/30 hover:bg-white/5"
        }`}
      style={{
        borderColor: isSelected ? activeBorderColor : "rgba(255,255,255,0.1)",
        borderLeftColor:
          isSelected && !isDrama
            ? baseColor
            : isDrama && isSelected
            ? activeBorderColor
            : "rgba(255,255,255,0.1)",
        // 🟢 GLOW: Now it won't be cut off
        boxShadow: isSelected
          ? `0 0 40px ${isDrama ? `${violetColor}50` : `${baseColor}30`}`
          : undefined,
      }}
    >
      {/* 🟢 INTERNAL CLIPPER: This handles the side bar and particles radius */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        {/* SIDE BAR ACCENT */}
        {isDrama && isSelected && (
          <div
            className="absolute left-0 top-0 bottom-0 w-1.5 z-20 animate-pulse"
            style={{
              background: `linear-gradient(to bottom, ${violetColor}, ${baseColor})`,
              boxShadow: `2px 0 15px ${violetColor}60`,
            }}
          />
        )}

        {/* GLOSS ENGINE */}
        <div
          className={`absolute inset-0 transition-opacity duration-1000 will-change-opacity ${
            isSelected ? "opacity-100" : "opacity-[0.01]"
          }`}
        >
          <ParticleFx
            mode="button"
            vector={baseType.toLowerCase()}
            forceCinematic={isDrama}
            forceTheme={
              baseType === "Solo"
                ? "gold"
                : baseType === "Dual"
                ? "pink"
                : baseType === "Duet"
                ? "fire"
                : "cyan"
            }
          />
        </div>
      </div>

      {/* CONTENT ROW (Z-Index bumped to 20) */}
      <div className="relative z-30 p-5 w-full h-full flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div
            className="p-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-md transition-colors duration-300"
            style={{
              borderColor: isSelected
                ? activeBorderColor
                : "rgba(255,255,255,0.1)",
            }}
          >
            <Icon
              size={18}
              className="transition-colors duration-300"
              style={{ color: isSelected ? activeBorderColor : "#6b7280" }}
            />
          </div>
          <span
            className="text-[10px] font-mono font-bold tracking-wider opacity-80"
            style={{ color: isSelected ? activeBorderColor : "#6b7280" }}
          >
            {price}
          </span>
        </div>

        <div>
          <h3
            className={`text-xs font-bold uppercase tracking-widest transition-all duration-300 ${
              isSelected
                ? isDrama
                  ? config.hybrid
                  : "text-white"
                : "text-gray-400 group-hover:text-white"
            }`}
          >
            {title}
          </h3>
          <p className="text-[10px] text-gray-500 mt-1 leading-tight">{desc}</p>
        </div>
      </div>
    </button>
  );
}
