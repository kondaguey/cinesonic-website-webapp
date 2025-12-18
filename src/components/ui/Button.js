"use client";
import React from "react";

export default function Button({
  children,
  onClick,
  disabled,
  variant = "solid",
  theme = "gold",
  color, // 🟢 NEW: Direct Hex override
  className = "",
  title,
  type = "button",
}) {
  // 1. HARDCODED HEX FALLBACKS (No more relying on CSS vars)
  const themeMap = {
    gold: "#d4af37",
    pink: "#ff3399",
    fire: "#ff4500",
    cyan: "#00f0ff",
    danger: "#ef4444",
    system: "#3b82f6",
    white: "#ffffff",
  };

  // 🟢 PRIORITY LOGIC: Prop Color > Hardcoded Theme > Default Gold
  const activeColor = color || themeMap[theme] || themeMap.gold;

  // 2. BASE STYLES
  const base =
    "relative inline-flex items-center justify-center font-bold uppercase tracking-[0.15em] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 group overflow-hidden z-10";

  // Default size (can be overridden by className)
  const sizeStyles =
    variant === "icon"
      ? "w-10 h-10 rounded-lg"
      : "px-6 py-3 h-10 text-[10px] rounded-lg";

  // 3. VARIANT STYLES
  const getVariantStyles = () => {
    switch (variant) {
      case "solid":
        return {
          backgroundColor: activeColor, // Explicit camelCase for React
          color: "#000000", // Black text on solid colors ensures contrast
          boxShadow: `0 4px 20px -5px ${activeColor}`,
          border: `1px solid ${activeColor}`, // Border matches fill to prevent hairline gaps
        };
      case "outline":
        return {
          backgroundColor: "transparent",
          color: activeColor,
          border: `1px solid ${activeColor}`,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: activeColor,
          border: "1px solid transparent",
        };
      case "glow":
        return {
          backgroundColor: activeColor,
          color: "#000000",
          boxShadow: `0 0 30px ${activeColor}`, // Intense glow
          border: `1px solid ${activeColor}`,
          animation: "pulseSlow 4s ease-in-out infinite",
        };
      case "glass":
        return {
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: activeColor,
        };
      case "link":
        return {
          backgroundColor: "transparent",
          color: activeColor,
          padding: "0",
          height: "auto",
          letterSpacing: "0.1em",
          border: "none",
        };
      case "icon":
        return {
          backgroundColor: "transparent",
          border: `1px solid ${activeColor}`,
          color: activeColor,
          opacity: 0.8,
        };
      default:
        return {};
    }
  };

  // 4. HOVER LOGIC (Applied via className using CSS variables setup below)
  let hoverClass = "";
  if (!disabled) {
    if (variant === "solid" || variant === "glow") {
      hoverClass =
        "hover:brightness-110 hover:shadow-2xl hover:-translate-y-0.5";
    } else if (variant === "outline" || variant === "icon") {
      // Logic: On hover, fill the button with the active color and turn text black
      hoverClass =
        "hover:bg-[var(--btn-color)] hover:text-black hover:shadow-[0_0_15px_var(--btn-color)]";
    } else if (variant === "ghost") {
      hoverClass = "hover:bg-white/10 hover:border-white/20 hover:text-white";
    } else if (variant === "link") {
      hoverClass = "hover:underline underline-offset-4 hover:brightness-125";
    }
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={`${base} ${sizeStyles} ${hoverClass} ${className}`}
      style={{
        ...getVariantStyles(),
        "--btn-color": activeColor, // Allows Tailwind to use this arbitrary value
      }}
    >
      {/* Shimmer Effect for Solid/Glow */}
      {(variant === "solid" || variant === "glow") && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/40 to-transparent z-0 pointer-events-none" />
      )}

      <span className="relative z-10 flex items-center justify-center gap-2 w-full">
        {children}
      </span>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </button>
  );
}
