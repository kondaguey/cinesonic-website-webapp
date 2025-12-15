"use client"; // Required for Next.js App Router interactivity

import React, { useState, useEffect } from "react";
import { Calculator, Music, Volume2, Check } from "lucide-react";

const CostEstimator = () => {
  // --- State ---
  const [wordCount, setWordCount] = useState(50000);
  const [addMusic, setAddMusic] = useState(false);
  const [addSFX, setAddSFX] = useState(false);
  const [totalCost, setTotalCost] = useState(0);

  // --- Constants ---
  const RATE_PER_WORD = 0.25; // Base rate
  const MUSIC_FEE = 500; // Flat fee
  const SFX_FEE = 750; // Flat fee

  // Calculate hours based on 9300 words per finished hour (industry avg)
  const finishedHours = (wordCount / 9300).toFixed(1);

  // --- Effect: Recalculate Total ---
  useEffect(() => {
    let cost = wordCount * RATE_PER_WORD;
    if (addMusic) cost += MUSIC_FEE;
    if (addSFX) cost += SFX_FEE;
    setTotalCost(cost);
  }, [wordCount, addMusic, addSFX]);

  // --- Helpers ---
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-1">
      {/* Glass Container */}
      <div className="relative bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl shadow-2xl">
        {/* Header */}
        <div className="p-8 border-b border-white/5 flex items-center gap-3">
          <Calculator className="text-[#d4af37]" size={24} />
          <h2 className="font-serif text-2xl text-white tracking-wide">
            Production Estimator
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* LEFT: Inputs */}
          <div className="p-8 space-y-10 border-r border-white/5">
            {/* Word Count Slider */}
            <div>
              <div className="flex justify-between text-white/60 text-sm uppercase tracking-wider mb-4">
                <span>Manuscript Length</span>
                <span className="text-white font-mono">
                  {wordCount.toLocaleString()} Words
                </span>
              </div>
              <input
                type="range"
                min="5000"
                max="150000"
                step="1000"
                value={wordCount}
                onChange={(e) => setWordCount(Number(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-[#d4af37] hover:accent-[#f5cc55] transition-all"
              />
              <div className="mt-2 text-xs text-[#d4af37]/80 font-mono">
                ~{finishedHours} Finished Audio Hours
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-4">
              <label className="text-white/60 text-sm uppercase tracking-wider block mb-2">
                Enhancements
              </label>

              {/* Music Toggle */}
              <button
                onClick={() => setAddMusic(!addMusic)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                  addMusic
                    ? "bg-[#d4af37]/10 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                    : "bg-white/5 border-transparent hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-md ${
                      addMusic
                        ? "bg-[#d4af37] text-black"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    <Music size={18} />
                  </div>
                  <div className="text-left">
                    <div
                      className={`font-bold ${
                        addMusic ? "text-white" : "text-white/50"
                      }`}
                    >
                      Original Score
                    </div>
                    <div className="text-xs text-white/30">
                      Cinematic musical backing
                    </div>
                  </div>
                </div>
                {addMusic && <Check className="text-[#d4af37]" size={18} />}
              </button>

              {/* SFX Toggle */}
              <button
                onClick={() => setAddSFX(!addSFX)}
                className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                  addSFX
                    ? "bg-[#d4af37]/10 border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.1)]"
                    : "bg-white/5 border-transparent hover:border-white/10"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-md ${
                      addSFX
                        ? "bg-[#d4af37] text-black"
                        : "bg-white/10 text-white/40"
                    }`}
                  >
                    <Volume2 size={18} />
                  </div>
                  <div className="text-left">
                    <div
                      className={`font-bold ${
                        addSFX ? "text-white" : "text-white/50"
                      }`}
                    >
                      Immersive SFX
                    </div>
                    <div className="text-xs text-white/30">
                      Foley & environmental sound
                    </div>
                  </div>
                </div>
                {addSFX && <Check className="text-[#d4af37]" size={18} />}
              </button>
            </div>
          </div>

          {/* RIGHT: Output */}
          <div className="p-8 bg-black/20 flex flex-col justify-center relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#d4af37] rounded-full blur-[100px] opacity-10"></div>

            <div className="relative z-10 text-center space-y-2">
              <span className="text-white/40 text-sm uppercase tracking-widest">
                Estimated Investment
              </span>
              <div className="font-serif text-6xl text-white font-medium drop-shadow-xl">
                {formatCurrency(totalCost)}
              </div>
              <p className="text-white/30 text-xs mt-4 max-w-xs mx-auto">
                *Preliminary estimate for standard distribution rights. Final
                quote provided after manuscript review.
              </p>
            </div>

            <div className="mt-10 relative z-10">
              <button className="w-full py-4 bg-white/5 border border-[#d4af37]/30 text-[#d4af37] uppercase tracking-widest text-xs font-bold hover:bg-[#d4af37] hover:text-black transition-all duration-300">
                Request Formal Quote
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CostEstimator;
