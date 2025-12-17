"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Star,
  ChevronDown,
  ChevronUp,
  Mic,
  Rocket,
  Zap,
  Headphones,
  Award,
  Shield,
  Music,
  Sparkles,
  User,
} from "lucide-react";
import { useTheme } from "../../../../components/ui/ThemeContext";
import ServiceHero from "../../../../components/marketing/ServiceHero";
import RosterPreview from "../../../../components/marketing/RosterPreview";

export default function MultiCastAudioProductionPage() {
  const { setTheme, isCinematic, activeStyles } = useTheme();

  // 🟢 1. FORCE CYAN THEME
  useEffect(() => {
    setTheme("cyan");
  }, []);

  const activeIconColor = isCinematic ? "#7c3aed" : "#00f0ff";

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const content = {
    heroTitle: isCinematic ? (
      "Full Cast Audio Drama"
    ) : (
      <>
        <span className="text-shimmer-cyan">Multi-Cast</span>{" "}
        <span className="text-shimmer-silver">Audiobook</span>
      </>
    ),
    heroSubtitle: isCinematic
      ? "The Ensemble. 3D Audio. The Blockbuster Experience."
      : "A distinct voice for every character. The ultimate immersive format.",
    whyTitle: isCinematic ? "The Violet Horizon." : "The Epic Scale.",
    whyDesc: isCinematic
      ? "Full Cast requires a world to inhabit. In CineSonic Mode, we build that world from the ground up—foley, spatial mixing, and a score that rivals Hollywood."
      : "Multi-Cast involves 3+ narrators. It creates a rich tapestry of voices, perfect for Sci-Fi, Fantasy, and large ensemble dramas.",
    priceTier: isCinematic ? "Cinematic Ensemble" : "Multi-Cast Standard",
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#00f0ff]/30 transition-colors duration-700 relative">
      {/* 🟢 BACKGROUND LAYERS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-[#00f0ff]/10 blur-[150px] rounded-full transition-opacity duration-1000"
          style={{ opacity: isCinematic ? 0.2 : 0.5 }}
        />
      </div>
      <div
        className="absolute inset-0 z-0 transition-opacity duration-1000 ease-in-out pointer-events-none"
        style={{ opacity: isCinematic ? 0.4 : 0 }}
      >
        <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[70%] bg-[#7c3aed]/20 blur-[120px] rounded-full animate-pulse-slow" />
      </div>

      <div className="relative z-10">
        <ServiceHero
          title={content.heroTitle}
          subtitle={content.heroSubtitle}
          vector="multi" // 🟢 Triggers Warp Speed
        />

        <nav className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/10 py-4 transition-all">
          <div className="max-w-7xl mx-auto px-6 flex justify-center gap-6 md:gap-12 overflow-x-auto no-scrollbar">
            {["The Upgrade", "Process", "Reviews", "FAQ"].map((item) => (
              <button
                key={item}
                onClick={() => scrollTo(item.toLowerCase().replace(" ", "-"))}
                className="text-xs md:text-sm font-medium text-white/50 hover:text-white transition-colors uppercase tracking-widest whitespace-nowrap group"
              >
                <span
                  className={`group-hover:${activeStyles?.shimmer} transition-all duration-300`}
                >
                  {item}
                </span>
              </button>
            ))}
          </div>
        </nav>

        <section id="the-upgrade" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                <span className={`italic font-bold ${activeStyles?.shimmer}`}>
                  {content.whyTitle}
                </span>{" "}
                <br />
                {isCinematic ? "Why go Cinematic?" : "Why go Multi?"}
              </h2>
              <div className="space-y-6 text-white/70 leading-relaxed text-lg font-light">
                <p>{content.whyDesc}</p>
                <p>
                  This is the summit of audio production. Complex, demanding,
                  and{" "}
                  <span className={`font-bold ml-1 ${activeStyles?.shimmer}`}>
                    unforgettable
                  </span>
                  .
                </p>
              </div>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(isCinematic
                  ? [
                      "Epic Scoring",
                      "Creature FX",
                      "Binaural Mixing",
                      "World Building",
                    ]
                  : [
                      "Full Ensemble",
                      "Character Specific",
                      "Radio Play Style",
                      "High Value",
                    ]
                ).map((bullet, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 animate-fade-in-up"
                  >
                    {isCinematic ? (
                      <Sparkles size={18} className="text-[#7c3aed] shrink-0" />
                    ) : (
                      <CheckCircle
                        size={18}
                        className="text-[#00f0ff] shrink-0"
                      />
                    )}
                    <span className="text-sm font-medium text-white/80">
                      {bullet}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02]">
              <div
                className="absolute inset-0 opacity-40 transition-all duration-1000"
                style={{
                  background: isCinematic
                    ? `radial-gradient(circle at center, #7c3aed40, #00f0ff10 70%)`
                    : `radial-gradient(circle at center, #00f0ff40, transparent 70%)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                {isCinematic ? (
                  <Zap
                    size={100}
                    className="text-white/20 animate-pulse-slow"
                  />
                ) : (
                  <Rocket size={100} className="text-white/20" />
                )}
              </div>
            </div>
          </div>
        </section>

        <section
          id="process"
          className="py-24 bg-white/[0.02] border-y border-white/5 relative"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white">
                The {content.priceTier}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <PillarCard
                icon={Rocket}
                title="Casting"
                desc="Ensemble curation."
                color={activeIconColor}
              />
              <PillarCard
                icon={Mic}
                title="Direction"
                desc="Showrunning."
                color={activeIconColor}
              />
              <PillarCard
                icon={isCinematic ? Music : Headphones}
                title={isCinematic ? "Scoring" : "Mixing"}
                desc={isCinematic ? "Orchestral." : "Multi-track blend."}
                color={activeIconColor}
              />
              <PillarCard
                icon={Shield}
                title="Integrity"
                desc="Continuity management."
                color={activeIconColor}
              />
              <PillarCard
                icon={Award}
                title="Delivery"
                desc="Masterpiece."
                color={activeIconColor}
              />
            </div>
          </div>
        </section>

        <RosterPreview />

        <section id="reviews" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="This isn't an audiobook. It's a Netflix series for your ears."
              author="A.J. Smith"
              role="Sci-Fi Author"
              color={activeIconColor}
            />
            <TestimonialCard
              quote="Managing 12 actors sounds like a nightmare, but CineSonic made it effortless."
              author="Big 5 Publisher"
              role="Production Head"
              color={activeIconColor}
            />
          </div>
        </section>

        <section id="faq" className="py-24 px-6 max-w-3xl mx-auto space-y-4">
          <AccordionItem
            q="How many actors can I have?"
            a="There is no hard limit. We scale to your script's needs."
            color={activeIconColor}
          />
          <AccordionItem
            q="How long does production take?"
            a="Typically 6-8 weeks for a full-length multi-cast novel."
            color={activeIconColor}
          />
          <AccordionItem
            q="Is music included?"
            a="Yes, in the Cinematic tier, full scoring is included."
            color={activeIconColor}
          />
        </section>

        <section className="py-20 px-6">
          <div
            className="max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group transition-all duration-1000"
            style={{
              background: isCinematic
                ? `linear-gradient(to right, #7c3aed, #00f0ff)`
                : `linear-gradient(to right, #00f0ff, #0099cc)`,
            }}
          >
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
                Build your universe.
              </h2>
              <Link
                href="/projectform"
                className="inline-block px-12 py-5 bg-black font-bold rounded-full hover:scale-105 transition-transform shadow-2xl text-white"
                style={{ color: activeIconColor }}
              >
                Start Multi-Cast Project
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// Reuse Sub-Components
function PillarCard({ icon: Icon, title, desc, color }) {
  return (
    <div
      className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 transition-colors group"
      style={{ borderColor: "rgba(255,255,255,0.1)" }}
      onMouseEnter={(e) => (e.currentTarget.style.borderColor = color)}
      onMouseLeave={(e) =>
        (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
      }
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center mb-6 transition-colors duration-500"
        style={{ backgroundColor: `${color}20` }}
      >
        <Icon size={24} style={{ color: color }} />
      </div>
      <h3 className="text-xl font-serif mb-3 text-white">{title}</h3>
      <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
    </div>
  );
}
function TestimonialCard({ quote, author, role, color }) {
  return (
    <div className="p-10 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative hover:bg-white/[0.03] transition-colors">
      <div className="absolute -top-4 -left-4 bg-[#050505] p-2 rounded-full border border-white/10">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star
              key={star}
              size={14}
              fill={color}
              stroke="none"
              style={{ transition: "fill 0.5s" }}
            />
          ))}
        </div>
      </div>
      <p className="text-lg text-white/80 italic mb-8 leading-relaxed">
        "{quote}"
      </p>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/5 flex items-center justify-center">
          <User size={20} className="text-white/30" />
        </div>
        <div>
          <div className="font-bold text-white">{author}</div>
          <div
            className="text-xs uppercase tracking-wider transition-colors duration-500"
            style={{ color: color }}
          >
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}
function AccordionItem({ q, a, color }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-medium text-lg text-white/90">{q}</span>
        {isOpen ? (
          <ChevronUp style={{ color: color }} />
        ) : (
          <ChevronDown className="text-white/50" />
        )}
      </button>
      {isOpen && (
        <div className="p-6 pt-0 text-white/60 leading-relaxed border-t border-white/5">
          {a}
        </div>
      )}
    </div>
  );
}
