"use client";

import React from "react";
import Image from "next/image";
import CineSonicToggle from "../ui/CineSonicToggle"; // Import the toggle
import { useTheme } from "../ui/ThemeContext";

export default function ServiceHero({
  title = "Solo Production",
  subtitle = "The Single Voice.",
  imagePath = "/images/solo-hero.jpg", // Fallback
}) {
  const { theme, isCinematic } = useTheme();

  // Map theme keys to hex for inline styles
  const COLORS = {
    gold: "#d4af37",
    pink: "#ff3399",
    fire: "#ff4500",
    cyan: "#00f0ff",
    system: "#3b82f6",
  };
  const activeColor = COLORS[theme] || COLORS.gold;

  return (
    <section className="relative min-h-[70vh] flex flex-col items-center justify-center overflow-hidden pt-20">
      {/* 1. Background Image with "Cinematic" Zoom Effect */}
      <div className="absolute inset-0 z-0">
        <Image
          src={imagePath}
          alt={title}
          fill
          className={`object-cover transition-transform duration-[2000ms] ease-in-out ${
            isCinematic ? "scale-110 grayscale-[0.5]" : "scale-100"
          }`}
          priority
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#020010] via-[#020010]/80 to-transparent" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* 2. Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-8">
        {/* Dynamic Title */}
        <h1
          className="text-5xl md:text-7xl lg:text-8xl font-serif text-white drop-shadow-2xl tracking-tight"
          style={{
            textShadow: isCinematic ? `0 0 50px ${activeColor}50` : "none",
          }}
        >
          {title}
        </h1>

        <p className="text-lg md:text-2xl text-gray-300 font-light tracking-wide max-w-2xl mx-auto">
          {subtitle}
        </p>

        {/* 3. THE TRIGGER */}
        <div className="pt-8">
          <CineSonicToggle />
        </div>
      </div>

      {/* 4. Bottom Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#020010] to-transparent z-10" />
    </section>
  );
}
