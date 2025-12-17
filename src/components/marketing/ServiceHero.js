"use client";

import React from "react";
import CineSonicToggle from "../ui/CineSonicToggle";
import { useTheme } from "../ui/ThemeContext";
import ParticleFx from "../ui/ParticleFx";

export default function ServiceHero({
  title = "Solo Production",
  subtitle = "The Single Voice.",
  vector = "solo", // 🟢 NEW PROP: Pass 'solo', 'dual', 'duet', 'multi'
}) {
  const { isCinematic, activeStyles } = useTheme();

  // Helper to determine text class
  const shimmerClass = activeStyles?.shimmer || "text-shimmer-gold-violet";

  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-20 bg-[#020010]">
      {/* 🟢 1. REPLACED IMAGE WITH PARTICLE FX */}
      <div className="absolute inset-0 z-0 select-none">
        {/* We fade the opacity slightly based on mode for depth */}
        <div
          className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
          style={{ opacity: isCinematic ? 0.8 : 0.5 }}
        >
          <ParticleFx mode="hero" vector={vector} />
        </div>

        {/* Vignette Overlay to help text pop */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020010] via-transparent to-[#020010]/50" />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#020010]/80" />
      </div>

      {/* 2. CONTENT */}
      <div className="relative z-50 text-center px-4 max-w-5xl mx-auto space-y-10 pointer-events-none">
        {/* 🟢 2. SMOOTH TEXT (No Weight Jump) */}
        {/* - font-bold is ALWAYS applied.
            - transition-all duration-1000 handles the color fade.
            - We overlay the shimmer class when cinematic.
        */}
        <h1
          className={`text-5xl md:text-7xl lg:text-8xl font-serif tracking-tight transition-all duration-[1500ms] ease-in-out transform-gpu pointer-events-auto font-bold
            ${
              isCinematic ? `${shimmerClass} scale-105` : "text-white scale-100"
            }`}
        >
          {title}
        </h1>

        <p
          className={`text-lg md:text-2xl font-light tracking-wide max-w-2xl mx-auto pointer-events-auto transition-all duration-1000 ease-in-out
          ${isCinematic ? "text-gray-200" : "text-gray-400"}`}
        >
          {subtitle}
        </p>

        {/* 3. THE TOGGLE */}
        <div className="pt-8 flex justify-center relative z-[100] pointer-events-auto">
          <CineSonicToggle />
        </div>
      </div>

      {/* Bottom Fade to blend into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#050505] to-transparent z-10 pointer-events-none" />
    </section>
  );
}
