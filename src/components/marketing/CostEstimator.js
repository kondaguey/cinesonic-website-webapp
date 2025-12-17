"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Music, Volume2, Check, ArrowRight } from "lucide-react";

export default function CostEstimator({ color = "#d4af37" }) {
  // --- STATE ---
  const [wordCount, setWordCount] = useState(50000);
  const [addMusic, setAddMusic] = useState(false);
  const [addSFX, setAddSFX] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  // --- LOGIC ---
  const RATE_PER_WORD = 0.25;
  const MUSIC_FEE = 500;
  const SFX_FEE = 750;

  // 9300 words is roughly 1 finished hour of audio
  const finishedHours = (wordCount / 9300).toFixed(1);

  useEffect(() => {
    let cost = wordCount * RATE_PER_WORD;
    if (addMusic) cost += MUSIC_FEE;
    if (addSFX) cost += SFX_FEE;
    setTotalCost(cost);
  }, [wordCount, addMusic, addSFX]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-1 animate-fade-in-up">
      {/* GLASS CONTAINER */}
      <div
        className="relative overflow-hidden flex flex-col md:flex-row rounded-3xl border border-white/10 bg-[#0a0a0a]"
        style={{ boxShadow: `0 0 0 1px ${color}10` }} // Subtle colored border tint
      >
        {/* === LEFT: CONTROLS === */}
        <div className="p-8 md:p-10 space-y-10 border-r border-white/5 flex-1 relative bg-white/[0.02]">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div
              className="p-2 rounded-lg transition-colors duration-500"
              style={{ backgroundColor: `${color}15`, color: color }}
            >
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="text-white leading-none font-serif tracking-wide text-lg">
                Production Estimator
              </h3>
              <p className="text-[10px] text-white/40 font-mono mt-1 uppercase tracking-wider">
                Real-time Calculator
              </p>
            </div>
          </div>

          {/* SLIDER CONTROL */}
          <div className="space-y-6">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">
                Manuscript Size
              </span>
              <span className="text-2xl font-serif text-white">
                {wordCount.toLocaleString()}{" "}
                <span className="text-sm text-white/40 font-sans">Words</span>
              </span>
            </div>

            <div className="relative h-6 flex items-center group">
              {/* Native Input (Hidden but functional) */}
              <input
                type="range"
                min="5000"
                max="150000"
                step="1000"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full absolute z-20 opacity-0 cursor-pointer h-full"
                aria-label="Word Count Slider"
              />

              {/* Custom Track Background */}
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative z-10">
                {/* Active Fill Track */}
                <div
                  className="h-full transition-all duration-100 ease-out"
                  style={{
                    width: `${((wordCount - 5000) / (150000 - 5000)) * 100}%`,
                    backgroundColor: color,
                  }}
                />
              </div>

              {/* Custom Thumb (Visual Only) */}
              <div
                className="absolute w-5 h-5 rounded-full border-2 border-white z-10 pointer-events-none transition-all duration-100 ease-out group-hover:scale-110 shadow-lg"
                style={{
                  left: `calc(${
                    ((wordCount - 5000) / (150000 - 5000)) * 100
                  }% - 10px)`,
                  backgroundColor: color,
                  boxShadow: `0 0 15px ${color}60`,
                }}
              />
            </div>

            <div
              className="flex justify-between text-[10px] uppercase tracking-wider font-mono transition-colors duration-500"
              style={{ color: `${color}80` }}
            >
              <span>~{finishedHours} Finished Hours</span>
              <span>Standard Rate ($0.25/word)</span>
            </div>
          </div>

          {/* TOGGLES */}
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-white/50">
              Enhancements
            </span>

            <ToggleCard
              active={addMusic}
              onClick={() => setAddMusic(!addMusic)}
              icon={Music}
              label="Original Score"
              sub="Cinematic musical backing"
              color={color}
            />

            <ToggleCard
              active={addSFX}
              onClick={() => setAddSFX(!addSFX)}
              icon={Volume2}
              label="Immersive SFX"
              sub="Foley & environmental sound"
              color={color}
            />
          </div>
        </div>

        {/* === RIGHT: OUTPUT (The 'Screen') === */}
        <div className="p-8 md:p-10 bg-black/60 flex flex-col justify-center relative overflow-hidden md:w-[340px] group">
          {/* Ambient Glow FX */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 blur-[100px] rounded-full pointer-events-none opacity-20 transition-colors duration-700"
            style={{ backgroundColor: color }}
          />

          <div className="relative z-10 text-center space-y-4">
            <span className="text-white/40 text-[10px] uppercase tracking-[0.2em] font-bold">
              Estimated Investment
            </span>

            {/* THE PRICE DISPLAY */}
            <div
              className="font-serif text-5xl md:text-6xl font-medium py-2 drop-shadow-2xl transition-all duration-300"
              style={{
                color: color,
                textShadow: `0 0 30px ${color}30`,
              }}
            >
              {formatCurrency(totalCost)}
            </div>

            <p className="text-white/30 text-[10px] leading-relaxed max-w-[200px] mx-auto font-light">
              *Preliminary estimate for standard distribution rights. Includes
              casting, direction, and mastering.
            </p>
          </div>

          {/* CTA BUTTON */}
          <div className="mt-10 relative z-20">
            <button
              className="w-full py-4 text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center gap-2 group transition-all duration-300 rounded-lg"
              style={{
                backgroundColor: `${color}10`,
                border: `1px solid ${color}40`,
                color: color,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = color;
                e.currentTarget.style.color = "#000000";
                e.currentTarget.style.boxShadow = `0 0 20px ${color}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `${color}10`;
                e.currentTarget.style.color = color;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              Request Quote{" "}
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SUB-COMPONENT (Toggle Card) ---
function ToggleCard({ active, onClick, icon: Icon, label, sub, color }) {
  return (
    <button
      onClick={onClick}
      className={`
              w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group
              ${
                active
                  ? "shadow-lg"
                  : "bg-white/[0.02] border-white/5 hover:border-white/10 hover:bg-white/5"
              }
            `}
      style={{
        borderColor: active ? color : "",
        backgroundColor: active ? `${color}10` : "",
        boxShadow: active ? `0 0 15px ${color}10` : "none",
      }}
    >
      <div className="flex items-center gap-4">
        <div
          className="p-2 rounded-lg transition-colors duration-300"
          style={{
            backgroundColor: active ? color : "rgba(255,255,255,0.05)",
            color: active ? "#000000" : "rgba(255,255,255,0.3)",
          }}
        >
          <Icon size={18} />
        </div>
        <div className="text-left">
          <div
            className={`font-bold text-sm transition-colors duration-300 ${
              active ? "text-white" : "text-white/60 group-hover:text-white"
            }`}
          >
            {label}
          </div>
          <div className="text-[10px] text-white/30 tracking-wide">{sub}</div>
        </div>
      </div>

      <div
        className="w-5 h-5 rounded-full border flex items-center justify-center transition-colors duration-300"
        style={{
          borderColor: active ? color : "rgba(255,255,255,0.2)",
          backgroundColor: active ? color : "transparent",
          color: active ? "#000000" : "transparent",
        }}
      >
        <Check size={12} strokeWidth={4} />
      </div>
    </button>
  );
}
