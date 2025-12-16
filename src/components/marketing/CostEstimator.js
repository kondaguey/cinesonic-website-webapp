"use client";

import React, { useState, useEffect } from "react";
import { Calculator, Music, Volume2, Check, ArrowRight } from "lucide-react";

export default function CostEstimator() {
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
    <div className="w-full max-w-4xl mx-auto p-1">
      {/* GLASS CONTAINER (Uses global utility) */}
      <div className="glass-panel overflow-hidden flex flex-col md:flex-row">
        {/* === LEFT: CONTROLS === */}
        <div className="p-8 md:p-10 space-y-10 border-r border-white/5 flex-1 relative">
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gold/10 rounded-lg text-gold">
              <Calculator size={20} />
            </div>
            <div>
              <h3 className="text-white leading-none">Production Estimator</h3>
              <p className="text-xs text-white/40 font-mono mt-1">
                V1.4 CALCULATOR
              </p>
            </div>
          </div>

          {/* SLIDER CONTROL */}
          <div className="space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs font-bold uppercase tracking-widest text-white/50">
                Manuscript Size
              </span>
              <span className="text-xl font-serif text-white">
                {wordCount.toLocaleString()}{" "}
                <span className="text-sm text-white/40 font-sans">Words</span>
              </span>
            </div>

            <div className="relative h-6 flex items-center">
              {/* Custom Track */}
              <input
                type="range"
                min="5000"
                max="150000"
                step="1000"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full absolute z-20 opacity-0 cursor-pointer"
              />
              <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden relative z-10">
                <div
                  className="h-full bg-gold transition-all duration-100 ease-out"
                  style={{
                    width: `${((wordCount - 5000) / (150000 - 5000)) * 100}%`,
                  }}
                />
              </div>
              {/* Custom Thumb (Visual Only) */}
              <div
                className="absolute w-4 h-4 bg-gold rounded-full shadow-[0_0_10px_#d4af37] z-10 pointer-events-none transition-all duration-100 ease-out"
                style={{
                  left: `calc(${
                    ((wordCount - 5000) / (150000 - 5000)) * 100
                  }% - 8px)`,
                }}
              />
            </div>

            <div className="flex justify-between text-[10px] uppercase tracking-wider text-gold/60 font-mono">
              <span>~{finishedHours} Finished Hours</span>
              <span>Standard Rate</span>
            </div>
          </div>

          {/* TOGGLES (DRY Component) */}
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
            />

            <ToggleCard
              active={addSFX}
              onClick={() => setAddSFX(!addSFX)}
              icon={Volume2}
              label="Immersive SFX"
              sub="Foley & environmental sound"
            />
          </div>
        </div>

        {/* === RIGHT: OUTPUT (The 'Screen') === */}
        <div className="p-8 md:p-10 bg-black/40 flex flex-col justify-center relative overflow-hidden md:w-[320px]">
          {/* Glow FX */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gold/5 blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 text-center space-y-2">
            <span className="text-white/40 text-[10px] uppercase tracking-[0.2em]">
              Estimated Investment
            </span>

            {/* THE GOLD SHIMMER PRICE */}
            <div className="font-serif text-5xl md:text-6xl text-shimmer-gold font-medium py-2">
              {formatCurrency(totalCost)}
            </div>

            <p className="text-white/30 text-[10px] leading-relaxed max-w-[200px] mx-auto mt-2">
              *Preliminary estimate for standard distribution rights. Not a
              binding contract.
            </p>
          </div>

          {/* CTA BUTTON with SPOTLIGHT SWEEP */}
          <div className="mt-8">
            <button className="shine-sweep w-full py-4 bg-white/5 border border-gold/30 text-gold uppercase tracking-[0.2em] text-xs font-bold hover:bg-gold hover:text-black transition-all duration-300 flex items-center justify-center gap-2 group">
              Formal Quote{" "}
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

// --- SUB-COMPONENTS (DRY) ---

function ToggleCard({ active, onClick, icon: Icon, label, sub }) {
  return (
    <button
      onClick={onClick}
      className={`
              w-full flex items-center justify-between p-4 rounded-xl border transition-all duration-300 group
              ${
                active
                  ? "bg-gold/10 border-gold shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                  : "bg-white/5 border-transparent hover:border-white/20 hover:bg-white/10"
              }
            `}
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-2 rounded-lg transition-colors ${
            active
              ? "bg-gold text-black"
              : "bg-white/10 text-white/40 group-hover:text-white"
          }`}
        >
          <Icon size={18} />
        </div>
        <div className="text-left">
          <div
            className={`font-bold text-sm ${
              active ? "text-white" : "text-white/60 group-hover:text-white"
            }`}
          >
            {label}
          </div>
          <div className="text-xs text-white/30">{sub}</div>
        </div>
      </div>

      <div
        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
          active ? "border-gold bg-gold text-black" : "border-white/20"
        }`}
      >
        {active && <Check size={12} strokeWidth={4} />}
      </div>
    </button>
  );
}
