"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Star,
  ChevronDown,
  ChevronUp,
  Mic,
  Flame,
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
import ParticleFx from "../../../../components/ui/ParticleFx";

export default function DuetAudioProductionPage() {
  const { setTheme, isCinematic, activeStyles } = useTheme();

  // 🟢 1. FORCE FIRE THEME
  useEffect(() => {
    setTheme("fire");
  }, []);

  const activeIconColor = isCinematic ? "#7c3aed" : "#ff4500";

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const content = {
    heroTitle: isCinematic ? (
      "Duet Audio Drama"
    ) : (
      <>
        <span className="text-shimmer-fire">Duet</span>{" "}
        <span className="text-shimmer-silver">Audiobook</span>
      </>
    ),
    heroSubtitle: isCinematic
      ? "Real-time Dialogue. Cinematic Tension. The Audio Thriller."
      : "True Duet Narration. Actors record collaboratively for zero lag.",
    whyTitle: isCinematic ? "The Violet Heat." : "The Live Spark.",
    whyDesc: isCinematic
      ? "Duet narration creates electricity. In CineSonic Mode, we amplify that voltage with aggressive sound design, heart-pounding scores, and immersive action sequences."
      : "Unlike Dual (POV), Duet narration involves actors recording the dialogue in real-time or tightly edited interplay. It feels like a play, not a reading.",
    priceTier: isCinematic ? "Cinematic Duet" : "Duet Standard",
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#ff4500]/30 transition-colors duration-700 relative">
      {/* 🟢 BACKGROUND LAYERS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-[#ff4500]/10 blur-[150px] rounded-full transition-opacity duration-1000"
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
          vector="duet" // 🟢 Triggers Fire Particles
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
                {isCinematic ? "Why go Cinematic?" : "Why go Duet?"}
              </h2>
              <div className="space-y-6 text-white/70 leading-relaxed text-lg font-light">
                <p>{content.whyDesc}</p>
                <p>
                  Ideal for thrillers, complex dramas, and high-heat romance. It
                  captures the{" "}
                  <span className={`font-bold ml-1 ${activeStyles?.shimmer}`}>
                    spontaneity
                  </span>{" "}
                  of human conversation.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(isCinematic
                  ? [
                      "Tension Scoring",
                      "Action SFX",
                      "Dynamic Panning",
                      "Cinema Mixing",
                    ]
                  : [
                      "Real-Time Acting",
                      "Seamless Dialogue",
                      "High Intensity",
                      "Theater Quality",
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
                        className="text-[#ff4500] shrink-0"
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
                    ? `radial-gradient(circle at center, #7c3aed40, #ff450010 70%)`
                    : `radial-gradient(circle at center, #ff450040, transparent 70%)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                {isCinematic ? (
                  <Zap
                    size={100}
                    className="text-white/20 animate-pulse-slow"
                  />
                ) : (
                  <Flame size={100} className="text-white/20" />
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
                icon={Flame}
                title="Casting"
                desc="Dynamic duo selection."
                color={activeIconColor}
              />
              <PillarCard
                icon={Mic}
                title="Direction"
                desc="Timing & Pacing."
                color={activeIconColor}
              />
              <PillarCard
                icon={isCinematic ? Music : Headphones}
                title={isCinematic ? "Scoring" : "Editing"}
                desc={isCinematic ? "High tension." : "Dialogue stitching."}
                color={activeIconColor}
              />
              <PillarCard
                icon={Shield}
                title="Integrity"
                desc="Emotional truth."
                color={activeIconColor}
              />
              <PillarCard
                icon={Award}
                title="Delivery"
                desc="High fidelity."
                color={activeIconColor}
              />
            </div>
          </div>
        </section>

        <RosterPreview />

        <section id="reviews" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="I've never heard an audiobook like this. It felt like eavesdropping on a real argument."
              author="Tom Clancy (Fan)"
              role="Thriller Listener"
              color={activeIconColor}
            />
            <TestimonialCard
              quote="The transition between Cinematic and Standard modes is genius."
              author="Rachel G."
              role="Dark Romance Author"
              color={activeIconColor}
            />
          </div>
        </section>

        <section id="faq" className="py-24 px-6 max-w-3xl mx-auto space-y-4">
          <AccordionItem
            q="Does this cost more than Dual?"
            a="Yes, due to the complexity of editing real-time dialogue."
            color={activeIconColor}
          />
          <AccordionItem
            q="What is the difference from Dual?"
            a="Dual is split by Chapter/POV. Duet is split by Character Line."
            color={activeIconColor}
          />
          <AccordionItem
            q="Can I attend the recording?"
            a="We offer remote direction passes for Duet sessions."
            color={activeIconColor}
          />
        </section>

        <section className="py-20 px-6">
          <div
            className="max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group transition-all duration-1000"
            style={{
              background: isCinematic
                ? `linear-gradient(to right, #7c3aed, #ff4500)`
                : `linear-gradient(to right, #ff4500, #cc3700)`,
            }}
          >
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
                Ignite your story.
              </h2>
              <Link
                href="/projectform"
                className="inline-block px-12 py-5 bg-black font-bold rounded-full hover:scale-105 transition-transform shadow-2xl text-white"
                style={{ color: activeIconColor }}
              >
                Start Duet Project
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
