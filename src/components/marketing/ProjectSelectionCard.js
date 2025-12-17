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
  // 1. PALETTE
  const COLORS = {
    Solo: { hex: "#d4af37", hybrid: "text-shimmer-gold-violet" },
    Dual: { hex: "#ff3399", hybrid: "text-shimmer-pink-violet" },
    Duet: { hex: "#ff4500", hybrid: "text-shimmer-fire-violet" },
    Multi: { hex: "#00f0ff", hybrid: "text-shimmer-cyan-violet" },
  };

  const config = COLORS[baseType] || COLORS.Solo;
  const baseColor = config.hex;
  const violetColor = "#7c3aed";

  // 2. ACTIVE STYLES
  const activeBorderColor = isDrama ? violetColor : baseColor;

  return (
    <button
      type="button"
      onClick={() => onSelect(id, baseType, isDrama)}
      className={`relative h-44 w-full rounded-2xl border transition-all duration-500 overflow-hidden group text-left p-5 flex flex-col justify-between isolate
        ${
          isSelected
            ? "shadow-2xl scale-[1.02] bg-[#0a0a15]"
            : "border-white/10 bg-[#0a0a15] hover:border-white/30 hover:bg-white/5"
        }`}
      style={{
        // BORDERS
        borderTopColor: isSelected ? activeBorderColor : undefined,
        borderRightColor: isSelected ? activeBorderColor : undefined,
        borderBottomColor: isSelected ? activeBorderColor : undefined,
        borderLeftColor: isSelected && !isDrama ? baseColor : "transparent",
        borderLeftWidth:
          isSelected && !isDrama ? "1px" : isDrama ? "0px" : "1px",

        // GLOW (Only when selected)
        boxShadow: isSelected
          ? `0 0 40px ${isDrama ? `${violetColor}30` : `${baseColor}20`}`
          : undefined,
      }}
    >
      {/* 🔴 BUG FIX 1: SIDE BAR OVERFLOW 
          Added 'rounded-tl-2xl rounded-bl-2xl' to match the parent card's curvature.
      */}
      {isDrama && isSelected && (
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5 z-20 animate-pulse rounded-tl-2xl rounded-bl-2xl"
          style={{
            background: `linear-gradient(to bottom, ${violetColor}, ${baseColor})`,
            boxShadow: `2px 0 15px ${violetColor}60`,
          }}
        />
      )}

      {/* VISUAL ENGINE */}
      <div
        className={`absolute inset-0 transition-opacity duration-1000 ${
          isSelected ? "opacity-100" : "opacity-0"
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

      {/* TOP ROW */}
      <div className="flex justify-between items-start relative z-10 pl-2">
        <div
          className="p-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-md transition-colors duration-300"
          style={{
            borderColor: isSelected
              ? activeBorderColor
              : "rgba(255,255,255,0.1)",
          }}
        >
          <Icon
            size={20}
            className="transition-colors duration-300"
            style={{ color: isSelected ? activeBorderColor : "#6b7280" }}
          />
        </div>
        <span
          className="text-xs font-mono font-bold tracking-wider opacity-80"
          style={{ color: isSelected ? activeBorderColor : "#6b7280" }}
        >
          {price}
        </span>
      </div>

      {/* BOTTOM ROW */}
      <div className="relative z-10 pl-2">
        <h3
          className={`text-sm font-bold uppercase tracking-wide transition-all duration-300 ${
            isSelected
              ? isDrama
                ? config.hybrid
                : "text-white"
              : "text-gray-300 group-hover:text-white"
          }`}
        >
          {title}
        </h3>
        <p className="text-[10px] text-gray-500 mt-1 group-hover:text-gray-400 transition-colors">
          {desc}
        </p>
      </div>
    </button>
  );
}
