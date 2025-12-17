"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
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
  Zap,
  Sparkles,
} from "lucide-react";

// 🟢 1. IMPORT THE LIVING UI
import { useTheme } from "../../../../components/ui/ThemeContext";
import ServiceHero from "../../../../components/marketing/ServiceHero";
import RosterPreview from "../../../../components/marketing/RosterPreview";

export default function SoloAudioProductionPage() {
  // 🟢 2. HOOK INTO THE MATRIX
  const { isCinematic } = useTheme();

  // 🟢 3. DEFINE THE ACTIVE COLOR (Gold vs Violet)
  const ACTIVE_COLOR = isCinematic ? "#7c3aed" : "#d4af37";

  // Scroll Helper
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // 🟢 4. DYNAMIC CONTENT CONFIGURATION
  // This object swaps text based on the "Mode"
  const content = {
    heroTitle: isCinematic ? "Solo Audio Drama" : "Solo Audiobook",
    heroSubtitle: isCinematic
      ? "The Sonic Monologue, Enhanced. Voice + Score + SFX."
      : "The Classic Format. One distinct voice carrying your entire narrative.",
    whyTitle: isCinematic ? "The Violet Vignette." : "Intimacy & Focus.",
    whyDesc: isCinematic
      ? "In CineSonic Mode, we take the solo performance and wrap it in a bespoke soundscape. It isn't just a reading; it's a one-person movie for the ears. Perfect for Sci-Fi diaries, Horror logs, and Fantasy epics."
      : "A solo performance is the bedrock of the audiobook industry. It relies on a single, versatile actor to perform the narrative and character voices. Intimate, focused, and pure.",
    priceTier: isCinematic ? "Cinematic Standard" : "Solo Standard",
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#d4af37]/30 transition-colors duration-700">
      {/* --- 1. THE STAGE (HERO WITH TOGGLE) --- */}
      {/* ⚠️ Ensure /images/solo-hero.jpg exists in your public folder! */}
      <ServiceHero
        title={content.heroTitle}
        subtitle={content.heroSubtitle}
        imagePath="/images/solo-hero.jpg"
      />

      {/* --- 2. QUICK LINKS NAV --- */}
      <nav className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/10 py-4 transition-all duration-500">
        <div className="max-w-7xl mx-auto px-6 flex justify-center gap-6 md:gap-12 overflow-x-auto no-scrollbar">
          {["The Upgrade", "Process", "Reviews", "FAQ"].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase().replace(" ", "-"))}
              className="text-xs md:text-sm font-medium text-white/50 hover:text-white transition-colors uppercase tracking-widest whitespace-nowrap group"
            >
              <span
                className="group-hover:text-[var(--hover-color)] transition-colors duration-300"
                style={{ "--hover-color": ACTIVE_COLOR }}
              >
                {item}
              </span>
            </button>
          ))}
        </div>
      </nav>

      {/* --- 3. THE UPGRADE (Dynamic Why Us) --- */}
      <section id="the-upgrade" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
              <span
                className="italic transition-colors duration-700"
                style={{ color: ACTIVE_COLOR }}
              >
                {content.whyTitle}
              </span>{" "}
              <br />
              {isCinematic ? "Why go Cinematic?" : "Why go Solo?"}
            </h2>

            <div className="space-y-6 text-white/70 leading-relaxed text-lg font-light">
              <p className="transition-opacity duration-500">
                {content.whyDesc}
              </p>
              <p>
                At CineSonic, we don't just record; we produce. Whether you
                choose the purity of
                <span
                  className="text-[#d4af37] font-bold transition-opacity duration-300"
                  style={{ opacity: isCinematic ? 0.5 : 1 }}
                >
                  {" "}
                  Sonic Mode
                </span>{" "}
                or the immersion of
                <span
                  className="text-[#7c3aed] font-bold transition-opacity duration-300"
                  style={{ opacity: isCinematic ? 1 : 0.5 }}
                >
                  {" "}
                  CineSonic Mode
                </span>
                , the quality remains uncompromising.
              </p>
            </div>

            {/* Dynamic Bullets */}
            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {isCinematic
                ? // VIOLET MODE BULLETS
                  [
                    "Full Musical Score",
                    "Immersive SFX",
                    "3D Spatial Audio",
                    "Cinema Mixing",
                  ].map((bullet, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 animate-fade-in-up"
                    >
                      <Sparkles size={18} className="text-[#7c3aed] shrink-0" />
                      <span className="text-sm font-medium text-white/80">
                        {bullet}
                      </span>
                    </div>
                  ))
                : // GOLD MODE BULLETS
                  [
                    "Consistent Narrative Tone",
                    "Cost-Effective",
                    "Industry Standard",
                    "Ideal for Non-Fiction",
                  ].map((bullet, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 animate-fade-in-up"
                    >
                      <CheckCircle
                        size={18}
                        className="text-[#d4af37] shrink-0"
                      />
                      <span className="text-sm font-medium text-white/80">
                        {bullet}
                      </span>
                    </div>
                  ))}
            </div>
          </div>

          {/* Visual Side - Reacts to Mode */}
          <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02] group">
            {/* Dynamic Gradient Background */}
            <div
              className="absolute inset-0 transition-colors duration-1000 opacity-30"
              style={{
                background: `linear-gradient(135deg, ${ACTIVE_COLOR}40, transparent)`,
              }}
            />

            {/* Icon Overlay */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div
                  className="absolute inset-0 blur-[80px] opacity-40 rounded-full transition-colors duration-1000"
                  style={{ backgroundColor: ACTIVE_COLOR }}
                />
                {isCinematic ? (
                  <Headphones
                    size={120}
                    className="text-white/20 relative z-10 animate-pulse-slow"
                  />
                ) : (
                  <Mic size={120} className="text-white/20 relative z-10" />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. PILLARS (THE PROCESS) --- */}
      <section
        id="process"
        className="py-24 bg-white/[0.02] border-y border-white/5 relative overflow-hidden transition-colors duration-1000"
      >
        {/* Violet Bleed Background (Only visible in CineSonic) */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-1000 pointer-events-none"
          style={{
            opacity: isCinematic ? 0.05 : 0,
            background: `radial-gradient(circle at 50% 50%, #7c3aed, transparent 70%)`,
          }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white">
              The {content.priceTier}
            </h2>
            <p className="text-white/50 text-lg">
              Five pillars that define our{" "}
              {isCinematic ? "immersive" : "single-voice"} process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <PillarCard
              icon={User}
              title="Casting"
              desc="We match the perfect voice to your genre."
              color={ACTIVE_COLOR}
            />
            <PillarCard
              icon={Mic}
              title="Direction"
              desc="Live direction ensures every inflection hits."
              color={ACTIVE_COLOR}
            />
            <PillarCard
              icon={isCinematic ? Music : Headphones}
              title={isCinematic ? "Scoring" : "Mastering"}
              desc={
                isCinematic
                  ? "Bespoke music composition."
                  : "ACX/Audible standards."
              }
              color={ACTIVE_COLOR}
            />
            <PillarCard
              icon={Shield}
              title="Integrity"
              desc="We honor the text. Accuracy is our north star."
              color={ACTIVE_COLOR}
            />
            <PillarCard
              icon={Award}
              title="Delivery"
              desc="On time, every time. Ready for retail."
              color={ACTIVE_COLOR}
            />
          </div>
        </div>
      </section>

      {/* --- ROSTER PREVIEW --- */}
      <RosterPreview />

      {/* --- 5. TESTIMONIALS --- */}
      <section id="reviews" className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-16">
          Heard Through the Vine
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <TestimonialCard
            quote="The narrator they picked was exactly the voice I heard in my head while writing. It was spooky how accurate it was."
            author="Sarah Jenkins"
            role="Thriller Author"
            color={ACTIVE_COLOR}
          />
          <TestimonialCard
            quote="CineSonic made the process invisible. I just handed over the script and got back gold. My listeners are raving about the quality."
            author="Mark D."
            role="Indie Publisher"
            color={ACTIVE_COLOR}
          />
        </div>
      </section>

      {/* --- 6. FAQ --- */}
      <section id="faq" className="py-24 px-6 max-w-3xl mx-auto">
        <h2 className="text-4xl font-serif text-center mb-12">
          Common Questions
        </h2>
        <div className="space-y-4">
          <AccordionItem
            q="What genres work best for Solo?"
            a="Solo is the gold standard for Non-Fiction, Memoirs, Business books, and First-Person POV fiction where a single perspective drives the story."
            color={ACTIVE_COLOR}
          />
          <AccordionItem
            q="Do you handle the editing?"
            a="Yes. Our price includes editing, mixing, and mastering. You receive a retail-ready file that passes all ACX technical requirements."
            color={ACTIVE_COLOR}
          />
          <AccordionItem
            q="Can I choose the narrator?"
            a="Absolutely. We provide a curated shortlist of auditions based on your character profiles, but the final choice is always yours."
            color={ACTIVE_COLOR}
          />
          <AccordionItem
            q="How long does it take?"
            a="Typically 4-6 weeks after the narrator is cast, depending on book length. We can expedite for tight launch windows."
            color={ACTIVE_COLOR}
          />
        </div>
      </section>

      {/* --- 7. CTA --- */}
      <section className="py-20 px-6">
        <div
          className="max-w-5xl mx-auto rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden group transition-all duration-1000"
          style={{
            background: isCinematic
              ? `linear-gradient(to right, #7c3aed, #4c1d95)` // Violet Gradient
              : `linear-gradient(to right, #d4af37, #b38728)`, // Gold Gradient
          }}
        >
          {/* Texture Overlay */}
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif text-black mb-6 drop-shadow-sm">
              Ready to find your voice?
            </h2>
            <p className="text-black/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
              Let's turn your manuscript into an immersive{" "}
              {isCinematic ? "Auditory Experience" : "Audiobook"}.
            </p>
            <Link
              href="/contact"
              className="inline-block px-12 py-5 bg-black font-bold rounded-full hover:scale-105 transition-transform shadow-2xl"
              style={{ color: ACTIVE_COLOR }}
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- SUB-COMPONENTS (Refactored for Dynamic Colors) ---

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
