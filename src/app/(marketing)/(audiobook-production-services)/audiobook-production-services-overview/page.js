"use client";
import React from "react";
import Link from "next/link";
import {
  Mic,
  Users,
  Flame,
  Rocket,
  ArrowRight,
  Layers,
  Wand2,
} from "lucide-react";

// 🟢 IMPORT THE MATRIX COMPONENT
// (Adjust the ../ depth if your folder structure is shallower/deeper)
import ServiceComparisonMatrix from "../../../../components/marketing/ServiceComparisonMatrix";

export default function ServicesOverviewPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#d4af37]/30 overflow-hidden">
      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-32 pb-24 px-6 border-b border-white/10">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 bg-white/5 rounded-full mb-8">
            <Layers size={14} className="text-[#d4af37]" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/60 font-bold">
              Production Suite
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-2xl text-white tracking-tight">
            Define Your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-white to-[#d4af37]">
              Narrative Voice.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            Every story demands a unique vessel. From intimate solo performances
            to cinematic full-cast ensembles, we engineer the perfect audio
            format for your manuscript.
          </p>
        </div>
      </section>

      {/* =========================================================
          SECTION 1: SOLO (The Classic Gold)
         ========================================================= */}
      <ServiceSection
        id="solo"
        title="Solo Production"
        subtitle="The Industry Standard"
        description="One distinct voice carrying your entire narrative. Perfect for non-fiction, memoirs, and literary fiction where intimacy is key."
        icon={Mic}
        color="#d4af37" // Gold
        gradient="from-[#d4af37] to-[#b8860b]"
        href="/solo-audiobook-production"
        align="left"
      />

      {/* =========================================================
          SECTION 2: DUAL (The Neon Romance)
         ========================================================= */}
      <ServiceSection
        id="dual"
        title="Dual Narration"
        subtitle="Two Perspectives"
        description="Male and Female narrators reading their specific POV chapters. The absolute gold standard for Romance and Thrillers."
        icon={Users}
        color="#ff3399" // Neon Pink
        gradient="from-[#ff3399] to-[#ff0066]"
        href="/dual-audiobook-production"
        align="right"
      />

      {/* =========================================================
          SECTION 3: DUET (The Fiery Chemistry)
         ========================================================= */}
      <ServiceSection
        id="duet"
        title="Duet Narration"
        subtitle="High Heat & Chemistry"
        description="Real acting. Actors interact line-by-line, creating a seamless dialogue flow. Ideal for high-stakes drama and spice."
        icon={Flame}
        color="#ff4500" // Fire Orange
        gradient="from-[#ff4500] to-[#ff0000]"
        href="/duet-audiobook-production"
        align="left"
      />

      {/* =========================================================
          SECTION 4: MULTI-CAST (The Sci-Fi Ensemble)
         ========================================================= */}
      <ServiceSection
        id="multicast"
        title="Multi-Cast Ensemble"
        subtitle="Cinematic Scope"
        description="A distinct actor for every major role. 3-4 pros building a world of sound without the clutter of sound effects."
        icon={Rocket}
        color="#00f0ff" // Cyan/Purple
        gradient="from-[#00f0ff] to-[#8a2be2]"
        href="/multicast-audiobook-production"
        align="right"
      />

      {/* --- 🟢 5. THE COMPARISON MATRIX (INSERTED HERE) --- */}
      <ServiceComparisonMatrix />

      {/* --- FOOTER CTA --- */}
      <section className="py-24 px-6 text-center border-t border-white/10">
        <h2 className="text-3xl font-serif text-white mb-6">
          Not sure which format fits?
        </h2>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 text-[#d4af37] hover:text-white transition-colors border-b border-[#d4af37] hover:border-white pb-1"
        >
          <span>Consult with our Creative Director</span>
          <ArrowRight size={16} />
        </Link>
      </section>
    </main>
  );
}

// --- REUSABLE SECTION COMPONENT ---
function ServiceSection({
  title,
  subtitle,
  description,
  icon: Icon,
  color,
  gradient,
  href,
  align,
}) {
  const isRight = align === "right";

  return (
    <section className="relative py-24 px-6 overflow-hidden group">
      {/* 1. Ambient Glow (Themed Color) */}
      <div
        className={`absolute top-1/2 -translate-y-1/2 w-[600px] h-[600px] blur-[150px] opacity-10 transition-opacity duration-700 group-hover:opacity-20 pointer-events-none rounded-full
          ${isRight ? "-right-32" : "-left-32"}
        `}
        style={{ backgroundColor: color }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div
          className={`flex flex-col md:flex-row items-center gap-12 md:gap-24 ${
            isRight ? "md:flex-row-reverse" : ""
          }`}
        >
          {/* VISUAL SIDE (Glass Card) */}
          <div className="w-full md:w-1/2">
            <Link
              href={href}
              className="block relative aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] hover:border-white/20 transition-all duration-500 hover:scale-[1.02] shadow-2xl"
            >
              {/* Inner Gradient */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity duration-500`}
              />

              {/* Center Icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`w-24 h-24 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500`}
                >
                  <Icon size={40} style={{ color: color }} />
                </div>
              </div>

              {/* Decorative UI Lines */}
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-50">
                <div className="text-[10px] uppercase tracking-widest font-mono">
                  Format_0{isRight ? "2" : "1"}
                </div>
                <div className="h-px flex-1 bg-white/20 mx-4 mb-1.5" />
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: color }}
                />
              </div>
            </Link>
          </div>

          {/* TEXT SIDE */}
          <div className="w-full md:w-1/2 text-left">
            <div className="inline-block mb-4 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm">
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: color }}
              >
                {subtitle}
              </span>
            </div>

            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 group-hover:translate-x-2 transition-transform duration-500">
              {title}
            </h2>

            <p className="text-lg text-white/60 leading-relaxed mb-10 max-w-md">
              {description}
            </p>

            <Link
              href={href}
              className="inline-flex items-center gap-3 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-full transition-all hover:bg-white/10 hover:pr-10 group/btn"
              style={{ borderColor: `${color}40` }} // 40 is hex for 25% opacity
            >
              <span>Explore Service</span>
              <ArrowRight
                size={18}
                style={{ color: color }}
                className="group-hover/btn:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
