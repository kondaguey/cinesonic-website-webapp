"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Star,
  ChevronDown,
  ChevronUp,
  Mic,
  User,
  Headphones,
  Award,
  Shield,
  Music,
  Sparkles,
} from "lucide-react";
import { useTheme } from "../../../../components/ui/ThemeContext";
import ServiceHero from "../../../../components/marketing/ServiceHero";
import RosterPreview from "../../../../components/marketing/RosterPreview";

export default function SoloAudioProductionPage() {
  const { setTheme, isCinematic, activeStyles } = useTheme();

  // 🟢 1. FORCE THEME ON MOUNT
  useEffect(() => {
    setTheme("gold");
  }, []);

  const activeIconColor = isCinematic ? "#7c3aed" : "#d4af37"; // Violet vs Gold

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const content = {
    heroTitle: isCinematic ? (
      // Cinematic Mode: Inherits parent header class (Gold -> Violet)
      "Solo Audio Drama"
    ) : (
      // Standard Mode: Force specific shimmers per word
      <>
        <span className="text-shimmer-gold">Solo</span>{" "}
        <span className="text-shimmer-silver">Audiobook</span>
      </>
    ),
    heroSubtitle: isCinematic
      ? "The Sonic Monologue, Enhanced. Voice + Score + SFX."
      : "The Classic Format. One distinct voice carrying your entire narrative.",
    whyTitle: isCinematic ? "The Violet Vignette." : "Intimacy & Focus.",
    whyDesc: isCinematic
      ? "In CineSonic Mode, we take the solo performance and wrap it in a bespoke soundscape. It isn't just a reading; it's a one-person movie for the ears."
      : "A solo performance is the bedrock of the audiobook industry. It relies on a single, versatile actor to perform the narrative and character voices.",
    priceTier: isCinematic ? "Cinematic Standard" : "Solo Standard",
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#d4af37]/30 transition-colors duration-700 relative">
      {/* 🟢 BACKGROUND LAYERS */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-[#d4af37]/10 blur-[150px] rounded-full transition-opacity duration-1000"
          style={{ opacity: isCinematic ? 0.3 : 0.6 }}
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
          imagePath="/images/solo-hero.jpg"
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
                {isCinematic ? "Why go Cinematic?" : "Why go Solo?"}
              </h2>
              <div className="space-y-6 text-white/70 leading-relaxed text-lg font-light">
                <p>{content.whyDesc}</p>
                <p>
                  At CineSonic, quality is the constant. Whether you choose{" "}
                  <span className={`font-bold ml-1 ${activeStyles?.shimmer}`}>
                    {isCinematic ? "CineSonic Mode" : "Sonic Mode"}
                  </span>
                  , you get the industry's best ears on your project.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(isCinematic
                  ? [
                      "Full Musical Score",
                      "Immersive SFX",
                      "3D Spatial Audio",
                      "Cinema Mixing",
                    ]
                  : [
                      "Consistent Tone",
                      "Cost-Effective",
                      "Industry Standard",
                      "Ideal for Non-Fiction",
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
                        className="text-[#d4af37] shrink-0"
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
                    ? `radial-gradient(circle at center, #7c3aed40, #d4af3710 70%)`
                    : `radial-gradient(circle at center, #d4af3740, transparent 70%)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                {isCinematic ? (
                  <Headphones
                    size={100}
                    className="text-white/20 animate-pulse-slow"
                  />
                ) : (
                  <Mic size={100} className="text-white/20" />
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
                icon={User}
                title="Casting"
                desc="Genre-perfect voices."
                color={activeIconColor}
              />
              <PillarCard
                icon={Mic}
                title="Direction"
                desc="Live acting coaching."
                color={activeIconColor}
              />
              <PillarCard
                icon={isCinematic ? Music : Headphones}
                title={isCinematic ? "Scoring" : "Mastering"}
                desc={isCinematic ? "Bespoke composition." : "ACX Ready."}
                color={activeIconColor}
              />
              <PillarCard
                icon={Shield}
                title="Integrity"
                desc="Accuracy is everything."
                color={activeIconColor}
              />
              <PillarCard
                icon={Award}
                title="Delivery"
                desc="On time, every time."
                color={activeIconColor}
              />
            </div>
          </div>
        </section>

        <RosterPreview />

        <section id="reviews" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="The narrator they picked was exactly the voice I heard in my head."
              author="Sarah Jenkins"
              role="Thriller Author"
              color={activeIconColor}
            />
            <TestimonialCard
              quote="CineSonic made the process invisible. I handed over the script and got back gold."
              author="Mark D."
              role="Indie Publisher"
              color={activeIconColor}
            />
          </div>
        </section>

        <section id="faq" className="py-24 px-6 max-w-3xl mx-auto space-y-4">
          <AccordionItem
            q="What genres work best?"
            a="Solo is the gold standard for Non-Fiction and First-Person POV."
            color={activeIconColor}
          />
          <AccordionItem
            q="Do you handle editing?"
            a="Yes. Mastering to ACX standards is included."
            color={activeIconColor}
          />
          <AccordionItem
            q="Can I choose the narrator?"
            a="Absolutely. We provide a curated shortlist."
            color={activeIconColor}
          />
        </section>

        <section className="py-20 px-6">
          <div
            className="max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group transition-all duration-1000"
            style={{
              background: isCinematic
                ? `linear-gradient(to right, #7c3aed, #d4af37)`
                : `linear-gradient(to right, #d4af37, #b38728)`,
            }}
          >
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-serif text-black mb-6">
                Ready to find your voice?
              </h2>
              <Link
                href="/projectform"
                className="inline-block px-12 py-5 bg-black font-bold rounded-full hover:scale-105 transition-transform shadow-2xl"
                style={{ color: activeIconColor }}
              >
                Get a Quote
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// SHARED SUB-COMPONENTS (Keep these at bottom of file or move to separate files if preferred)
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
