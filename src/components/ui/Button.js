"use client";
import React from "react";

export default function Button({
  children,
  onClick,
  disabled,
  variant = "solid",
  theme = "gold",
  className = "",
  title,
  type = "button",
}) {
  // 1. MAP TO CSS VARIABLES
  const themeMap = {
    gold: "var(--color-gold)",
    pink: "var(--color-pink-neon)",
    fire: "var(--color-fire)",
    cyan: "var(--color-cyan)",
    danger: "#ef4444",
    system: "#3b82f6",
  };

  const activeColor = themeMap[theme] || themeMap.gold;

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
          background: activeColor,
          color: "#020010",
          boxShadow: `0 4px 20px -5px ${activeColor}`,
          border: "1px solid transparent",
        };
      case "outline":
        return {
          background: "transparent",
          color: activeColor,
          border: `1px solid ${activeColor}`,
        };
      case "ghost":
        return {
          background: "transparent",
          color: activeColor,
          border: "1px solid transparent",
        };
      case "glow":
        return {
          background: activeColor,
          color: "#020010",
          boxShadow: `0 0 30px ${activeColor}`, // Intense glow
          animation: "pulseSlow 4s ease-in-out infinite",
        };
      case "glass":
        return {
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          color: activeColor,
        };
      case "link":
        return {
          background: "transparent",
          color: activeColor,
          padding: "0",
          height: "auto",
          letterSpacing: "0.1em",
        };
      case "icon":
        return {
          background: "transparent",
          border: `1px solid ${activeColor}`,
          color: activeColor,
          opacity: 0.8,
        };
      default:
        return {};
    }
  };

  // 4. HOVER FILTERS
  let hoverClass = "";
  if (!disabled) {
    if (variant === "solid" || variant === "glow") {
      hoverClass =
        "hover:brightness-110 hover:shadow-2xl hover:-translate-y-0.5";
    } else if (variant === "outline" || variant === "icon") {
      hoverClass =
        "hover:bg-[var(--btn-color)] hover:text-[#020010] hover:shadow-[0_0_15px_var(--btn-color)]";
    } else if (variant === "ghost" || variant === "glass") {
      hoverClass = "hover:bg-white/10 hover:border-white/20";
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
      // 'className' comes last to allow you to override height/padding
      className={`${base} ${sizeStyles} ${hoverClass} ${className}`}
      style={{
        ...getVariantStyles(),
        "--btn-color": activeColor,
      }}
    >
      {(variant === "solid" || variant === "glow") && (
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0 pointer-events-none" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
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
