"use client";
import React from "react";
import { Mic2, FileText, Headphones, Send, Sparkles } from "lucide-react";

// ATOMS
import ParticleFx from "../ui/ParticleFx";

const STEPS = [
  {
    icon: FileText,
    title: "Onboarding & Script Prep",
    desc: "We analyze your manuscript to build the sonic architecture. Pronunciation guides are built, and character archetypes are defined.",
  },
  {
    icon: Mic2,
    title: "Casting & Auditions",
    desc: "We source talent from our elite roster based on your archetype data. You receive a curated shortlist of audition tapes to approve.",
  },
  {
    icon: Headphones,
    title: "Principal Photography",
    desc: "Production begins. Our directors guide the talent through every chapter to ensure emotional resonance and narrative pacing.",
  },
  {
    icon: Sparkles,
    title: "Post-Production",
    desc: "The cinematic touch. Editing, mixing, and mastering. We remove breaths, clicks, and noise, hitting strict -60dB noise floor standards.",
  },
  {
    icon: Send,
    title: "Delivery & Launch",
    desc: "You receive retail-ready master files formatted for ACX, Audible, and Spotify. Tagged, polished, and ready for upload.",
  },
];

export default function ProductionPipeline({ theme = "gold" }) {
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

  return (
    <section className="relative py-24 px-6 bg-[#020010] overflow-hidden group">
      {/* --- ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 1. Particles */}
        <div className="opacity-40">
          <ParticleFx variant="solo" count={8} color={color} />
        </div>

        {/* 2. Grain */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        {/* 3. Central Glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[60vh] blur-[120px] rounded-full pointer-events-none transition-colors duration-1000"
          style={{ backgroundColor: `${color}0D` }} // ~5% opacity
        />
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* HEADER */}
        <div className="text-center mb-20 max-w-2xl mx-auto animate-fade-in-up">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6 tracking-tight">
            From Page to{" "}
            <span
              className="bg-clip-text text-transparent transition-all duration-500"
              style={{
                backgroundImage: `linear-gradient(to bottom, ${color}, ${color}80)`,
                textShadow: `0 0 30px ${color}20`,
              }}
            >
              Performance.
            </span>
          </h2>
          <p className="text-white/50 font-light text-lg">
            Our rigorous 5-step production standard ensures your story
            translates perfectly to audio.
          </p>
        </div>

        {/* TIMELINE CONTAINER */}
        <div className="relative">
          {/* THE LINE (Responsive Positioning) */}
          <div
            className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2 transition-colors duration-1000"
            style={{
              background: `linear-gradient(to bottom, transparent, ${color}4D, transparent)`, // 30% opacity
            }}
          />

          <div className="space-y-12 md:space-y-0">
            {STEPS.map((step, index) => (
              <TimelineNode
                key={index}
                data={step}
                index={index}
                color={color}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineNode({ data, index, color }) {
  const isEven = index % 2 === 0;
  const Icon = data.icon;

  return (
    <div
      className={`relative flex items-start md:items-center animate-fade-in-up 
        ${isEven ? "md:flex-row" : "md:flex-row-reverse"}
      `}
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* --- THE CONTENT CARD --- */}
      {/* Mobile: Full width with left margin. Desktop: 45% width. */}
      <div className="ml-20 md:ml-0 md:w-[45%] group/card">
        <div className="p-6 md:p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-all duration-500 relative overflow-hidden group-hover/card:shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          {/* Dynamic Hover Border via inline style */}
          <div
            className="absolute inset-0 rounded-2xl border border-transparent group-hover/card:border-opacity-30 transition-colors duration-500 pointer-events-none"
            style={{ borderColor: color }}
          />

          {/* Hover Glow Effect */}
          <div
            className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `linear-gradient(135deg, ${color}0D, transparent)`,
            }} // 5% opacity
          />

          <div className="relative z-10">
            <span
              className="block text-[10px] font-bold uppercase tracking-[0.2em] mb-3 transition-colors duration-500"
              style={{ color: `${color}80` }}
            >
              Step 0{index + 1}
            </span>
            <h3
              className="text-xl font-serif text-white mb-3 transition-colors duration-300"
              // We can use style injection via group hover if we wanted to avoid inline event listeners,
              // but for specific color inheritance without extensive CSS variables, inline style is okay here.
              // Better approach for consistency:
              style={{
                textShadow: "0 0 0 transparent",
              }}
            >
              {/* Optional: Span wrapper for hover color effect */}
              <span
                className="group-hover/card:text-[var(--node-color)] transition-colors duration-300"
                style={{ "--node-color": color }}
              >
                {data.title}
              </span>
            </h3>
            <p className="text-white/50 text-sm leading-relaxed font-light">
              {data.desc}
            </p>
          </div>
        </div>
      </div>

      {/* --- THE NODE (ICON) --- */}
      {/* Mobile: Fixed left position. Desktop: Centered. */}
      <div className="absolute left-8 md:left-1/2 -translate-x-1/2 flex items-center justify-center mt-1 md:mt-0">
        {/* Outer Ring */}
        <div
          className="w-12 h-12 rounded-full bg-[#050505] border flex items-center justify-center shadow-[0_0_20px_rgba(0,0,0,1)] z-10 transition-colors duration-500"
          style={{ borderColor: `${color}33` }} // 20% opacity
        >
          {/* Inner Circle */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-500"
            style={{ backgroundColor: `${color}1A`, color: color }} // 10% opacity bg
          >
            <Icon size={14} strokeWidth={1.5} />
          </div>
        </div>
      </div>

      {/* --- SPACER FOR DESKTOP GRID --- */}
      <div className="hidden md:block md:w-[45%]" />
    </div>
  );
}
