"use client";
import React from "react";
import ActorCard from "./ActorCard";
import { MicOff, Sparkles } from "lucide-react";

const MainRoster = ({ actors, onSelectActor, theme = "gold" }) => {
  // 1. LOCAL COLOR MAP
  const themeConfig = {
    gold: { hex: "#d4af37" },
    pink: { hex: "#ff3399" },
    fire: { hex: "#ff4500" },
    cyan: { hex: "#00f0ff" },
    system: { hex: "#3b82f6" },
  };

  const activeTheme = themeConfig[theme] || themeConfig.gold;
  const color = activeTheme.hex;

  // --- 2. CINEMATIC EMPTY STATE ---
  if (!actors || actors.length === 0) {
    return (
      <div className="w-full min-h-[50vh] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.02] animate-fade-in-up">
        <div className="relative mb-6">
          <div
            className="absolute inset-0 blur-xl rounded-full opacity-50 transition-colors duration-500"
            style={{ backgroundColor: `${color}33` }} // ~20%
          />
          <MicOff
            size={48}
            className="relative z-10 text-white/20"
            strokeWidth={1}
          />
        </div>
        <h3 className="text-2xl font-serif text-white/40 mb-2">
          The Stage is Silent
        </h3>
        <p className="text-xs uppercase tracking-widest text-white/20">
          No talent currently cast.
        </p>
      </div>
    );
  }

  // --- 3. THE GALLERY GRID ---
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
      {actors.map((actor, index) => {
        const isInteractive = actor.isRevealed;

        return (
          <div
            key={actor.id}
            onClick={() => {
              if (isInteractive) {
                onSelectActor(actor);
              }
            }}
            // Staggered Animation Delay for entrance
            style={{ animationDelay: `${index * 100}ms` }}
            className={`
              group relative animate-fade-in-up
              ${
                isInteractive
                  ? "cursor-pointer"
                  : "cursor-default opacity-80 grayscale"
              }
            `}
          >
            {/* Hover Spotlight (Only for Revealed Actors) */}
            {isInteractive && (
              <div
                className="absolute -inset-4 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10"
                style={{
                  background: `linear-gradient(to bottom, ${color}1A, transparent)`,
                }}
              />
            )}

            {/* The Card - Passing Color Down */}
            <div
              className={`transition-transform duration-500 ${
                isInteractive ? "group-hover:-translate-y-2" : ""
              }`}
            >
              <ActorCard actor={actor} color={color} />
            </div>

            {/* Interactive Hint (Only for Revealed) */}
            {isInteractive && (
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-2 group-hover:translate-y-0">
                <div
                  className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest transition-colors duration-500"
                  style={{ color: color }}
                >
                  <Sparkles size={10} />
                  <span>View Profile</span>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Animation Styles */}
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; /* "Heavy" cinematic ease */
          opacity: 0; /* Start hidden for animation */
        }
      `}</style>
    </div>
  );
};

export default MainRoster;
