"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckCircle,
  Star,
  ChevronDown,
  ChevronUp,
  Mic,
  Users,
  Heart,
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
// Note: We don't need ParticleFx imported here anymore, ServiceHero handles it.

export default function DualAudioProductionPage() {
  const { setTheme, isCinematic, activeStyles } = useTheme();

  useEffect(() => {
    setTheme("pink");
  }, []);

  const activeIconColor = isCinematic ? "#7c3aed" : "#ff3399";

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const content = {
    heroTitle: isCinematic ? (
      "Dual Audio Drama"
    ) : (
      <>
        <span className="text-shimmer-pink">Dual</span>{" "}
        <span className="text-shimmer-silver">Audiobook</span>
      </>
    ),
    heroSubtitle: isCinematic
      ? "His & Her POV. Scored. Soundscaped. The Romance Movie."
      : "Two Narrators. Two Perspectives. The industry standard for Romance.",
    whyTitle: isCinematic ? "The Violet Chemistry." : "The Power of Two.",
    whyDesc: isCinematic
      ? "Romance requires atmosphere. In CineSonic Mode, we underscore the tension with subtle musical cues and ambient room tone that pulls the listener into the scene."
      : "Dual Narration assigns a male narrator to the male POV and a female narrator to the female POV. It creates a distinct separation of voice that readers love.",
    priceTier: isCinematic ? "Cinematic Dual" : "Dual Standard",
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#ff3399]/30 transition-colors duration-700 relative">
      {/* 🟢 BACKGROUND GLOWS ONLY (Removed ParticleFx from here) */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[60vh] bg-[#ff3399]/10 blur-[150px] rounded-full transition-opacity duration-1000"
          style={{ opacity: isCinematic ? 0.2 : 0.5 }}
        />
        {/* Soft dark overlay to ensure text legibility down the page */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#050505]/80 to-[#050505] z-10" />
      </div>

      <div className="relative z-10">
        {/* 🟢 UPDATED: Passed vector="dual" here so hearts stay in the Hero */}
        <ServiceHero
          title={content.heroTitle}
          subtitle={content.heroSubtitle}
          vector="dual"
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
                {isCinematic ? "Why go Cinematic?" : "Why go Dual?"}
              </h2>
              <div className="space-y-6 text-white/70 leading-relaxed text-lg font-light">
                <p>{content.whyDesc}</p>
                <p>
                  Perfect for Romantasy and Contemporary Romance. Hand-picked
                  pairings ensure the{" "}
                  <span className={`font-bold ml-1 ${activeStyles?.shimmer}`}>
                    chemistry
                  </span>{" "}
                  is palpable.
                </p>
              </div>
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(isCinematic
                  ? [
                      "Emotional Scoring",
                      "Ambient Environments",
                      "Heartbeat FX",
                      "Cinema Mixing",
                    ]
                  : [
                      "Distinct POVs",
                      "Gender Accurate",
                      "Higher Engagement",
                      "Genre Standard",
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
                        className="text-[#ff3399] shrink-0"
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
                    ? `radial-gradient(circle at center, #7c3aed40, #ff339910 70%)`
                    : `radial-gradient(circle at center, #ff339940, transparent 70%)`,
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                {isCinematic ? (
                  <Heart
                    size={100}
                    className="text-white/20 animate-pulse-slow"
                  />
                ) : (
                  <Users size={100} className="text-white/20" />
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
                icon={Users}
                title="Matching"
                desc="Chemistry testing."
                color={activeIconColor}
              />
              <PillarCard
                icon={Mic}
                title="Direction"
                desc="Dual-booth coordination."
                color={activeIconColor}
              />
              <PillarCard
                icon={isCinematic ? Music : Headphones}
                title={isCinematic ? "Scoring" : "Mastering"}
                desc={isCinematic ? "Romantic themes." : "Seamless stitching."}
                color={activeIconColor}
              />
              <PillarCard
                icon={Shield}
                title="Integrity"
                desc="Character consistency."
                color={activeIconColor}
              />
              <PillarCard
                icon={Award}
                title="Delivery"
                desc="Ready for retail."
                color={activeIconColor}
              />
            </div>
          </div>
        </section>

        <RosterPreview theme="pink" />

        <section id="reviews" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            <TestimonialCard
              quote="The chemistry between these two narrators was absolutely electric."
              author="Jessica V."
              role="Romance Author"
              color={activeIconColor}
            />
            <TestimonialCard
              quote="CineSonic found the perfect male lead to match my existing female narrator."
              author="Emily R."
              role="Self-Pub Bestseller"
              color={activeIconColor}
            />
          </div>
        </section>

        <section id="faq" className="py-24 px-6 max-w-3xl mx-auto space-y-4">
          <AccordionItem
            q="How do you ensure the voices match?"
            a="We conduct chemistry reads during the casting phase."
            color={activeIconColor}
          />
          <AccordionItem
            q="Is this suitable for all romance?"
            a="Yes, from sweet contemporary to dark romance."
            color={activeIconColor}
          />
          <AccordionItem
            q="Do the narrators record together?"
            a="Usually separately to ensure clean audio, then stitched flawlessly."
            color={activeIconColor}
          />
        </section>

        <section className="py-20 px-6">
          <div
            className="max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group transition-all duration-1000"
            style={{
              background: isCinematic
                ? `linear-gradient(to right, #7c3aed, #ff3399)`
                : `linear-gradient(to right, #ff3399, #cc0066)`,
            }}
          >
            <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-serif text-white mb-6">
                Find your perfect pair.
              </h2>
              <Link
                href="/projectform"
                className="inline-block px-12 py-5 bg-black font-bold rounded-full hover:scale-105 transition-transform shadow-2xl text-white"
                style={{ color: activeIconColor }}
              >
                Start Dual Project
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

// Reuse Sub-Components (PillarCard, TestimonialCard, AccordionItem) - No changes needed there.
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
