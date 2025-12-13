"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Star,
  ChevronDown,
  ChevronUp,
  Users,
  Heart,
  SplitSquareHorizontal,
  Mic2,
  Award,
  Shield,
  Sparkles,
} from "lucide-react";

// Custom Neon Pink color used: #ff3399

export default function DualAudiobookPage() {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#ff3399]/30">
      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 border-b border-white/10 overflow-hidden">
        {/* Background Ambience - MIXING GOLD & PINK */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-gradient-to-r from-[#d4af37]/20 to-[#ff3399]/20 blur-[150px] rounded-full pointer-events-none" />

        {/* Subtle floating hearts in background */}
        <div className="absolute top-20 left-[20%] text-[#ff3399]/20 blur-sm animate-pulse">
          <Heart size={40} fill="currentColor" />
        </div>
        <div className="absolute bottom-20 right-[20%] text-[#d4af37]/20 blur-sm animate-pulse delay-700">
          <Heart size={60} fill="currentColor" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff3399]/30 bg-[#ff3399]/10 rounded-full mb-8">
            <Users size={14} className="text-[#ff3399]" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#ff3399] font-bold">
              Dual Narration
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif mb-8 drop-shadow-2xl text-white">
            Dual Audiobook <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#ff3399] to-[#ff55a3]">
              Production.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            Two narrators, separate perspectives. The industry standard for
            Romance and alternating-POV thrillers, giving every protagonist
            their own authentic voice.
          </p>

          <Link
            href="/contact"
            // CTA Button mixes gold and pink
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#ff3399] text-black font-bold rounded-full transition-all shadow-[0_0_20px_rgba(255,51,153,0.3)] hover:shadow-[0_0_40px_rgba(255,51,153,0.5)] hover:-translate-y-1"
          >
            Find Your Perfect Pair <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* --- 2. QUICK LINKS NAV --- */}
      <nav className="sticky top-0 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-center gap-6 md:gap-12 overflow-x-auto no-scrollbar">
          {["Why Us", "Process", "Reviews", "FAQ"].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase().replace(" ", "-"))}
              className="text-xs md:text-sm font-medium text-white/50 hover:text-[#ff3399] transition-colors uppercase tracking-widest whitespace-nowrap"
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* --- 3. WHY US SECTION --- */}
      <section id="why-us" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div>
            <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#ff3399] italic">
                Perspective Power.
              </span>{" "}
              <br />
              Two sides to every story.
            </h2>
            <div className="space-y-6 text-white/70 leading-relaxed text-lg font-light">
              <p>
                Dual narration assigns a specific narrator to each Point of View
                (POV) chapter. When the chapter is from the Hero's perspective,
                the Male narrator reads; when it's the Heroine's, the Female
                narrator takes over.
              </p>
              <p>
                This format has exploded in popularity, particularly in Romance,
                because it allows the listener to deeply connect with the inner
                monologue of each protagonist through a distinct, authentic
                voice.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Industry Standard for Romance",
                "Distinct POV Voices",
                "Balanced Workload",
                "High Listener Engagement",
              ].map((bullet, i) => (
                <div key={i} className="flex items-center gap-3">
                  {/* Pink checks */}
                  <CheckCircle size={18} className="text-[#ff3399] shrink-0" />
                  <span className="text-sm font-medium text-white/80">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 via-transparent to-[#ff3399]/20 opacity-30" />
            {/* Abstract Visualization: Two distinct sides meeting */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative flex gap-4">
                <div className="absolute inset-0 bg-gradient-to-r from-[#d4af37] to-[#ff3399] blur-[100px] opacity-40 rounded-full" />
                {/* Two users split by a line */}
                <Users
                  size={100}
                  strokeWidth={1}
                  className="text-white/20 relative z-10"
                />
                <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#d4af37] to-[#ff3399] opacity-50"></div>
                <Heart
                  size={40}
                  fill="#ff3399"
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[#ff3399] z-20 drop-shadow-[0_0_10px_#ff3399]"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. PILLARS (THE PROCESS) --- */}
      <section
        id="process"
        className="py-24 bg-white/[0.02] border-y border-white/5"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white">
              The Dual Standard
            </h2>
            <p className="text-white/50 text-lg">
              Five pillars defining our dual-perspective process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {/* Alternating Gold and Pink accents for pillars */}
            <PillarCard
              icon={Heart}
              accentColor="pink"
              title="Chemistry"
              desc="We cast pairs that sound incredible together, ensuring tonal consistency."
            />
            <PillarCard
              icon={SplitSquareHorizontal}
              accentColor="gold"
              title="Coordination"
              desc="We ensure character pronunciations and accents match across both narrators."
            />
            <PillarCard
              icon={Mic2}
              accentColor="pink"
              title="Editing"
              desc="Seamless audio transitions between chapters regardless of who recorded."
            />
            {/* Core Value Tie-in */}
            <PillarCard
              icon={Shield}
              accentColor="gold"
              title="Collaboration"
              desc="A core value. We bridge the gap between two talents for a unified product."
            />
            <PillarCard
              icon={Award}
              accentColor="pink"
              title="Impact"
              desc="Double the star power for your marketing launch and listener appeal."
            />
          </div>
        </div>
      </section>

      {/* --- 5. TESTIMONIALS --- */}
      <section id="reviews" className="py-24 px-6 max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-16">
          Heard Through the Vine
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <TestimonialCard
            quote="Having a distinct male voice for the male chapters changed everything. My sales went up 40% on this release."
            author="Jessica R."
            role="Romance Author"
          />
          <TestimonialCard
            quote="Seamless. You couldn't tell they recorded in different studios. The production quality tied them together perfectly. Magic."
            author="Tom H."
            role="Indie Publisher"
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
            q="How is this different from Duet narration?"
            a="In Dual, narrators strictly read their own POV chapters. In Duet, they act out dialogue together in real-time, regardless of whose chapter it is."
          />
          <AccordionItem
            q="Does this cost double a Solo book?"
            a="Not double, but it is a higher investment than Solo due to the logistical coordination and casting of two professional actors."
          />
          <AccordionItem
            q="Do I need two separate scripts?"
            a="No. We work from one manuscript and color-code the POV chapters and dialogue cues for the actors before recording begins."
          />
          <AccordionItem
            q="What are the best genres for Dual?"
            a="Contemporary Romance, Dark Romance, Dual-POV Thrillers, and Epistolary novels shine in this format."
          />
        </div>
      </section>

      {/* --- 7. CTA --- */}
      <section className="py-20 px-6">
        {/* Gradient background mixes Gold and Pink */}
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-r from-[#d4af37] via-[#ff3399] to-[#d4af37] p-12 md:p-20 text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
          {/* Floating hearts in CTA */}
          <div className="absolute top-10 left-10 text-white/20 animate-pulse">
            <Heart size={30} fill="currentColor" />
          </div>
          <div className="absolute bottom-10 right-10 text-white/20 animate-pulse delay-500">
            <Heart size={40} fill="currentColor" />
          </div>

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif text-white mb-6 drop-shadow-md">
              Ready to cast your perfect pair?
            </h2>
            <p className="text-white/90 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
              Let's bring both sides of your story to life.
            </p>
            <Link
              href="/contact"
              // Black button with pink/gold text
              className="inline-block px-12 py-5 bg-black font-bold rounded-full hover:scale-105 transition-transform shadow-2xl"
            >
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#ff3399]">
                Get a Quote
              </span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- SUB-COMPONENTS ---

// Modified PillarCard to accept an 'accentColor' prop ('gold' or 'pink')
function PillarCard({ icon: Icon, title, desc, accentColor = "gold" }) {
  const isPink = accentColor === "pink";
  const bgColorStr = isPink ? "bg-[#ff3399]/10" : "bg-[#d4af37]/10";
  const bgHoverStr = isPink
    ? "group-hover:bg-[#ff3399]"
    : "group-hover:bg-[#d4af37]";
  const textColorStr = isPink ? "text-[#ff3399]" : "text-[#d4af37]";
  const borderColorStr = isPink
    ? "hover:border-[#ff3399]/50"
    : "hover:border-[#d4af37]/50";

  return (
    <div
      className={`p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 ${borderColorStr} transition-colors group`}
    >
      <div
        className={`w-12 h-12 rounded-full ${bgColorStr} flex items-center justify-center mb-6 ${bgHoverStr} transition-colors duration-300`}
      >
        <Icon
          size={24}
          className={`${textColorStr} group-hover:text-white transition-colors duration-300`}
        />
      </div>
      <h3 className="text-xl font-serif mb-3 text-white">{title}</h3>
      <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }) {
  return (
    <div className="p-10 rounded-3xl bg-gradient-to-br from-white/5 to-transparent border border-white/10 relative hover:bg-white/[0.03] transition-colors">
      <div className="absolute -top-4 -left-4 bg-[#050505] p-2 rounded-full border border-white/10">
        <div className="flex gap-1">
          {/* Pink stars for romance page */}
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={14} fill="#ff3399" stroke="none" />
          ))}
        </div>
      </div>
      <p className="text-lg text-white/80 italic mb-8 leading-relaxed">
        "{quote}"
      </p>
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-white/10 border border-white/5 flex items-center justify-center">
          <Users size={20} className="text-white/30" />
        </div>
        <div>
          <div className="font-bold text-white">{author}</div>
          {/* Pink role text */}
          <div className="text-xs text-[#ff3399] uppercase tracking-wider">
            {role}
          </div>
        </div>
      </div>
    </div>
  );
}

function AccordionItem({ q, a }) {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-white/10 rounded-xl bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-medium text-lg text-white/90">{q}</span>
        {/* Pink Chevron */}
        {isOpen ? (
          <ChevronUp className="text-[#ff3399]" />
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
