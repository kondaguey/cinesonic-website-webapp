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
} from "lucide-react";

export default function SoloAudiobookPage() {
  // Scroll Helper
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#d4af37]/30">
      {/* --- 1. HERO SECTION --- */}
      <section className="relative pt-32 pb-20 px-6 border-b border-white/10 overflow-hidden">
        {/* Background Ambience */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-[#d4af37]/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#d4af37]/30 bg-[#d4af37]/5 rounded-full mb-8">
            <Mic size={14} className="text-[#d4af37]" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#d4af37] font-bold">
              Production Service
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif mb-8 drop-shadow-2xl text-white">
            Solo Audiobook <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728]">
              Production.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            The classic format. One distinct voice carrying your entire
            narrative, creating an intimate, undivided connection between author
            and listener.
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#d4af37] hover:bg-[#b38728] text-black font-bold rounded-full transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_40px_rgba(212,175,55,0.5)] hover:-translate-y-1"
          >
            Cast Your Narrator <ArrowRight size={18} />
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
              className="text-xs md:text-sm font-medium text-white/50 hover:text-[#d4af37] transition-colors uppercase tracking-widest whitespace-nowrap"
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
              <span className="text-[#d4af37] italic">Intimacy & Focus.</span>{" "}
              <br />
              Why go Solo?
            </h2>
            <div className="space-y-6 text-white/70 leading-relaxed text-lg font-light">
              <p>
                A solo performance is the bedrock of the audiobook industry. It
                relies on a single, versatile actor to perform the narrative and
                character voices. This creates a consistent, hypnotic tone that
                listeners love for non-fiction, memoirs, and literary fiction.
              </p>
              <p>
                At CineSonic, 'Solo' doesn't mean 'Simple'. We treat
                single-voice productions with the same cinematic sound design
                and mastering standards as our full-cast epics.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Consistent Narrative Tone",
                "Cost-Effective",
                "Faster Production Time",
                "Ideal for Non-Fiction",
              ].map((bullet, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle size={18} className="text-[#d4af37] shrink-0" />
                  <span className="text-sm font-medium text-white/80">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual Side */}
          <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-white/[0.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37]/20 to-transparent opacity-30" />
            {/* Abstract Microphone Visualization */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#d4af37] blur-[80px] opacity-40 rounded-full" />
                <Mic
                  size={120}
                  strokeWidth={1}
                  className="text-white/20 relative z-10"
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
              The Solo Standard
            </h2>
            <p className="text-white/50 text-lg">
              Five pillars that define our single-voice process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <PillarCard
              icon={User}
              title="Casting"
              desc="We match the perfect voice to your genre, not just a random reader."
            />
            <PillarCard
              icon={Mic}
              title="Direction"
              desc="Live direction ensures every inflection hits the emotional mark."
            />
            <PillarCard
              icon={Headphones}
              title="Quality"
              desc="Mastered to ACX/Audible standards with zero noise floor."
            />
            <PillarCard
              icon={Shield}
              title="Integrity"
              desc="We honor the text. Accuracy and intent are our north star."
            />
            <PillarCard
              icon={Award}
              title="Delivery"
              desc="On time, every time. Ready for retail upload immediately."
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
            quote="The narrator they picked was exactly the voice I heard in my head while writing. It was spooky how accurate it was."
            author="Sarah Jenkins"
            role="Thriller Author"
          />
          <TestimonialCard
            quote="CineSonic made the process invisible. I just handed over the script and got back gold. My listeners are raving about the quality."
            author="Mark D."
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
            q="What genres work best for Solo?"
            a="Solo is the gold standard for Non-Fiction, Memoirs, Business books, and First-Person POV fiction where a single perspective drives the story."
          />
          <AccordionItem
            q="Do you handle the editing?"
            a="Yes. Our price includes editing, mixing, and mastering. You receive a retail-ready file that passes all ACX technical requirements."
          />
          <AccordionItem
            q="Can I choose the narrator?"
            a="Absolutely. We provide a curated shortlist of auditions based on your character profiles, but the final choice is always yours."
          />
          <AccordionItem
            q="How long does it take?"
            a="Typically 4-6 weeks after the narrator is cast, depending on book length. We can expedite for tight launch windows."
          />
        </div>
      </section>

      {/* --- 7. CTA --- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-r from-[#d4af37] to-[#b38728] p-12 md:p-20 text-center relative overflow-hidden group">
          {/* Texture Overlay */}
          <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />

          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-serif text-black mb-6">
              Ready to find your voice?
            </h2>
            <p className="text-black/80 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-medium">
              Let's turn your manuscript into an immersive Solo experience.
            </p>
            <Link
              href="/contact"
              className="inline-block px-12 py-5 bg-black text-[#d4af37] font-bold rounded-full hover:scale-105 transition-transform shadow-2xl"
            >
              Get a Quote
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- SUB-COMPONENTS (Internal to avoid import issues) ---

function PillarCard({ icon: Icon, title, desc }) {
  return (
    <div className="p-8 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:border-[#d4af37]/50 transition-colors group">
      <div className="w-12 h-12 rounded-full bg-[#d4af37]/10 flex items-center justify-center mb-6 group-hover:bg-[#d4af37] transition-colors duration-300">
        <Icon
          size={24}
          className="text-[#d4af37] group-hover:text-black transition-colors duration-300"
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
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={14} fill="#d4af37" stroke="none" />
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
          <div className="text-xs text-[#d4af37] uppercase tracking-wider">
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
        {isOpen ? (
          <ChevronUp className="text-[#d4af37]" />
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
