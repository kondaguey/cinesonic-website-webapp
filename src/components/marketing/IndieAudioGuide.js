"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Coins,
  Mic2,
  Share2,
  Lock,
  Unlock,
  Info,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// ATOMS
import ParticleFx from "../ui/ParticleFx";

export default function IndieAudioGuide({ theme = "gold" }) {
  const [activeTab, setActiveTab] = useState("prep");

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

  // --- DYNAMIC DATA GENERATION ---
  const PROTOCOLS = [
    {
      id: "prep",
      label: "Act I",
      title: "The Blueprint",
      icon: BookOpen,
      description:
        "Great audiobooks aren't read; they are performed. Before a mic turns on, the manuscript must be analyzed for sonic architecture.",
      content: (
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-6">
            <ProtocolStep number="01" title="Sonic Archetypes" color={color}>
              Don't just list names. Define the vocal texture. Is the antagonist
              gravelly? Is the love interest breathless? We build a "Casting
              Frequency" chart before the first audition.
            </ProtocolStep>
            <ProtocolStep number="02" title="Format Selection" color={color}>
              Solo (Intimate), Dual (The Romance Standard), or Duet (High
              Chemistry). Your genre dictates the format, not your budget.
            </ProtocolStep>
            <ProtocolStep number="03" title="Script Sanitation" color={color}>
              Visual cues vanish in audio. We scrub dialogue tags ("he said,"
              "she said") that clutter the listener's ear, ensuring a seamless
              flow.
            </ProtocolStep>
          </div>
        </div>
      ),
    },
    {
      id: "budget",
      label: "Act II",
      title: "Resource Allocation",
      icon: Coins,
      description:
        "Audio production is an investment asset. You generally have two paths to finance this asset, each with different long-term yields.",
      content: (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Option A */}
            <div className="group p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
              <div className="flex items-center gap-3 mb-4 text-white/40 group-hover:text-white transition-colors">
                <Lock size={18} />
                <h4 className="font-serif text-lg tracking-wide">
                  Royalty Share
                </h4>
              </div>
              <p className="text-sm text-white/50 leading-relaxed font-light">
                <strong className="text-white/80 block mb-2">
                  Low Upfront Risk.
                </strong>
                You pay nothing now, but split royalties (usually 50/50) with
                the narrator for 7 years. You forfeit long-term scaling revenue.
              </p>
            </div>

            {/* Option B (Highlighted) */}
            <div
              className="relative group p-6 rounded-2xl bg-gradient-to-b from-transparent to-transparent border transition-colors duration-500"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${color}15, transparent)`,
                borderColor: `${color}30`,
              }}
            >
              <div className="absolute top-0 right-0 p-3">
                <Sparkles className="w-4 h-4" style={{ color: color }} />
              </div>
              <div
                className="flex items-center gap-3 mb-4 transition-colors duration-500"
                style={{ color: color }}
              >
                <Unlock size={18} />
                <h4 className="font-serif text-lg tracking-wide">
                  Asset Ownership
                </h4>
              </div>
              <p className="text-sm text-white/70 leading-relaxed font-light">
                <strong
                  className="block mb-2 transition-colors duration-500"
                  style={{ color: color }}
                >
                  Maximum Control.
                </strong>
                Pay a Per Finished Hour (PFH) rate. You own the masters 100%.
                You keep 100% of net royalties forever.
              </p>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: "prod",
      label: "Act III",
      title: "The Signal",
      icon: Mic2,
      description:
        "A great story is ruined by a noise floor louder than -60dB. The technical deliverables are non-negotiable.",
      content: (
        <div className="space-y-6 animate-fade-in">
          <p className="text-white/60 font-light italic">
            We adhere to the "Gold Standard" of audio engineering.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <TechSpec label="RMS Levels" value="-23dB to -18dB" color={color} />
            <TechSpec label="Noise Floor" value="< -60dB" color={color} />
            <TechSpec label="Peak Level" value="-3.0dB" color={color} />
          </div>
          <div
            className="p-6 border-l bg-gradient-to-r from-transparent to-transparent transition-all duration-500"
            style={{
              borderColor: `${color}50`,
              backgroundImage: `linear-gradient(to right, ${color}0D, transparent)`,
            }}
          >
            <h4 className="text-white font-serif mb-2">
              The "Room Tone" Factor
            </h4>
            <p className="text-sm text-white/50 font-light">
              Pure digital silence feels unnatural to the human ear. We stitch
              edits using captured "Room Tone"—the living breath of the
              studio—to create an organic listening experience.
            </p>
          </div>
        </div>
      ),
    },
    {
      id: "distro",
      label: "Act IV",
      title: "Distribution",
      icon: Share2,
      description:
        "The final strategic choice. Do you lock yourself into the biggest ecosystem, or cast a wide net?",
      content: (
        <div className="space-y-8 animate-fade-in">
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 md:items-start">
              <div className="shrink-0 w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 font-serif text-xl">
                A
              </div>
              <div>
                <h4 className="text-white text-lg font-serif mb-2">
                  The Exclusive Route
                </h4>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Higher royalty rate (40%) on Audible, but you cannot sell your
                  audiobook anywhere else (Spotify, Libraries, Direct) for 7
                  years.
                </p>
              </div>
            </div>

            <div className="w-full h-px bg-white/5" />

            <div className="flex flex-col md:flex-row gap-6 md:items-start">
              <div
                className="shrink-0 w-12 h-12 rounded-full flex items-center justify-center font-serif text-xl transition-colors duration-500"
                style={{ backgroundColor: `${color}15`, color: color }}
              >
                B
              </div>
              <div>
                <h4
                  className="text-lg font-serif mb-2 transition-colors duration-500"
                  style={{ color: color }}
                >
                  The Wide Route
                </h4>
                <p className="text-sm text-white/50 font-light leading-relaxed">
                  Lower royalty rate on Audible (25%), but you gain access to
                  40+ other retailers, library systems (Hoopla/Overdrive), and
                  direct sales.
                  <span className="italic text-white/30 ml-2">
                    Recommended for long-term IP growth.
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const activeContent = PROTOCOLS.find((p) => p.id === activeTab);

  return (
    <section className="relative py-32 px-6 bg-[#020010] overflow-hidden group">
      {/* --- ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 1. Subtle Background Particles */}
        <div className="opacity-30">
          <ParticleFx variant="solo" count={5} color={color} />
        </div>

        {/* 2. Soft Side Glow */}
        <div
          className="absolute top-1/2 left-0 -translate-y-1/2 w-[30vw] h-[60vh] blur-[120px] rounded-full opacity-40 transition-colors duration-1000"
          style={{ backgroundColor: `${color}0D` }}
        />

        {/* 3. Grain */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="mb-20 max-w-2xl animate-fade-in-up">
          <div className="inline-flex items-center gap-2 mb-6">
            <div
              className="w-8 h-px transition-colors duration-500"
              style={{ backgroundColor: color }}
            />
            <span
              className="text-xs font-bold uppercase tracking-[0.2em] transition-colors duration-500"
              style={{ color: color }}
            >
              The Protocol
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 leading-[1.1]">
            From Manuscript <br />
            <span className="text-white/30 italic">to Masterpiece.</span>
          </h2>
          <p className="text-lg text-white/50 font-light max-w-lg leading-relaxed">
            A tactical breakdown of how we shift your intellectual property from
            text to performance.
          </p>
        </div>

        {/* --- INTERFACE --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* LEFT: NAV (The Timeline) */}
          <div className="lg:col-span-4 flex flex-col gap-2">
            {PROTOCOLS.map((phase) => {
              const isActive = activeTab === phase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => setActiveTab(phase.id)}
                  className={`group/btn relative flex items-center gap-6 p-4 md:p-6 text-left transition-all duration-500 rounded-xl animate-fade-in-up
                    ${isActive ? "bg-white/[0.03]" : "hover:bg-white/[0.01]"}
                  `}
                >
                  {/* Active Indicator Line */}
                  <div
                    className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 rounded-r-full transition-all duration-500
                        ${
                          isActive
                            ? "opacity-100 scale-y-100"
                            : "opacity-0 scale-y-0"
                        }
                    `}
                    style={{ backgroundColor: color }}
                  />

                  <div
                    className={`shrink-0 transition-colors duration-300 ${
                      isActive
                        ? ""
                        : "text-white/20 group-hover/btn:text-white/40"
                    }`}
                    style={{ color: isActive ? color : undefined }}
                  >
                    <phase.icon size={24} strokeWidth={1} />
                  </div>

                  <div>
                    <span
                      className={`block text-[10px] uppercase tracking-widest font-bold mb-1 transition-colors duration-300
                            ${isActive ? "" : "text-white/20"}
                        `}
                      style={{ color: isActive ? color : undefined }}
                    >
                      {phase.label}
                    </span>
                    <h3
                      className={`text-xl font-serif transition-colors duration-300
                      ${
                        isActive
                          ? "text-white"
                          : "text-white/40 group-hover/btn:text-white/70"
                      }
                    `}
                    >
                      {phase.title}
                    </h3>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT: CONTENT (The Revelation) */}
          <div className="lg:col-span-8 relative min-h-[500px]">
            {/* Content Container */}
            <div key={activeTab} className="animate-fade-in-up">
              {/* Header of Content */}
              <div className="mb-10 pb-10 border-b border-white/5">
                <h3 className="text-3xl md:text-4xl font-serif text-white mb-6">
                  {activeContent.title}
                </h3>
                <p className="text-xl text-white/60 font-light leading-relaxed max-w-2xl">
                  {activeContent.description}
                </p>
              </div>

              {/* Body of Content */}
              <div className="relative">{activeContent.content}</div>
            </div>
          </div>
        </div>

        {/* --- FOOTER NOTE --- */}
        <div className="mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 animate-fade-in-up">
          <div className="flex items-start gap-4 max-w-2xl">
            <Info
              className="shrink-0 mt-1 transition-colors duration-500"
              size={18}
              style={{ color: color }}
            />
            <p className="text-sm text-white/40 font-light leading-relaxed">
              <span className="text-white/80 font-medium">Studio Note:</span>{" "}
              CineSonic currently operates exclusively on a "Work for Hire"
              model. This ensures you retain 100% of your rights and royalties
              from day one.
            </p>
          </div>
          <Link
            href="/blog"
            className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
          >
            Read Full Production FAQ
            <ArrowRight
              size={14}
              className="group-hover:translate-x-1 transition-transform"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}

// --- SUB COMPONENTS ---

function ProtocolStep({ number, title, children, color }) {
  return (
    <div className="flex gap-6 items-start group">
      <span
        className="shrink-0 font-mono text-sm pt-1 transition-colors duration-500"
        style={{ color: `${color}80` }}
      >
        {number}
      </span>
      <div>
        <h4 className="text-white text-lg font-medium mb-2">{title}</h4>
        <p className="text-white/50 text-sm font-light leading-relaxed max-w-xl">
          {children}
        </p>
      </div>
    </div>
  );
}

function TechSpec({ label, value, color }) {
  return (
    <div className="p-4 rounded-lg bg-white/[0.03] border border-white/5 text-center transition-colors duration-500 hover:bg-white/[0.05]">
      <div className="text-xs text-white/30 uppercase tracking-widest mb-2">
        {label}
      </div>
      <div
        className="font-mono text-lg transition-colors duration-500"
        style={{ color: color }}
      >
        {value}
      </div>
    </div>
  );
}
