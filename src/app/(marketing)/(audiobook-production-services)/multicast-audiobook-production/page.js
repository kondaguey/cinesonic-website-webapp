"use client";
import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  ArrowRight,
  CheckCircle,
  Star,
  ChevronDown,
  ChevronUp,
  Users,
  Mic,
  Globe,
  Zap,
  Rocket,
  Disc,
} from "lucide-react";

// --- 3D COMPONENT: HYPER-DRIVE TUNNEL ("The Zoomies") ---
function WarpStarfield({ count = 500 }) {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { particles, colors } = useMemo(() => {
    const tempParticles = [];
    const tempColors = [];

    // Sci-Fi Palette: Cyan, Deep Purple, Gold, White
    const palette = [
      new THREE.Color("#00f0ff"), // Cyan
      new THREE.Color("#8a2be2"), // Violet
      new THREE.Color("#d4af37"), // Gold
      new THREE.Color("#ffffff"), // White
    ];

    for (let i = 0; i < count; i++) {
      // Create a tunnel shape (hole in the middle)
      const angle = Math.random() * Math.PI * 2;
      const radius = 10 + Math.random() * 30; // Clear center for content
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = (Math.random() - 0.5) * 100; // Deep depth spread

      const speed = 0.5 + Math.random() * 1.5;
      const length = 5 + Math.random() * 20; // Long streaks

      tempParticles.push({ x, y, z, speed, length });

      // Assign random color
      const color = palette[Math.floor(Math.random() * palette.length)];
      tempColors.push(color.r, color.g, color.b);
    }
    return { particles: tempParticles, colors: new Float32Array(tempColors) };
  }, [count]);

  useMemo(() => {
    if (mesh.current) {
      mesh.current.geometry.setAttribute(
        "color",
        new THREE.InstancedBufferAttribute(colors, 3)
      );
    }
  }, [colors]);

  useFrame(() => {
    if (!mesh.current) return;

    particles.forEach((p, i) => {
      // Move stars TOWARDS camera (Z+)
      p.z += p.speed * 4; // Fast speed
      if (p.z > 20) p.z = -100; // Loop back far away

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(0.1, 0.1, p.length); // Stretch to look like warp lines
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <boxGeometry args={[0.5, 0.5, 1]} />
      <meshBasicMaterial vertexColors transparent opacity={0.6} />
    </instancedMesh>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function MultiCastPage() {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen bg-[#020010] text-white selection:bg-[#00f0ff]/30 relative overflow-x-hidden">
      {/* --- 0. BACKGROUND: WARP TUNNEL --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 60 }}>
          <WarpStarfield count={800} />
          <fog attach="fog" args={["#020010", 10, 80]} />
        </Canvas>

        {/* Vignette to focus center */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#020010_95%)]" />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-[#020010]/70" />
      </div>

      {/* --- 1. HERO SECTION --- */}
      <section className="relative z-10 pt-32 pb-20 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#00f0ff]/30 bg-[#00f0ff]/10 rounded-full mb-8 shadow-[0_0_15px_rgba(0,240,255,0.2)]">
            <Users size={14} className="text-[#00f0ff]" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#00f0ff] font-bold">
              Full Cast Ensemble
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif mb-6 drop-shadow-2xl text-white tracking-tight">
            A Galaxy of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-[#00f0ff] to-[#8a2be2]">
              Voices.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            Three to four distinct actors. A bridge between traditional
            narration and full-scale audio drama. <br />{" "}
            <span className="text-white font-medium">
              Character acting without the noise.
            </span>
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-4 bg-white/5 border border-white/10 hover:border-[#00f0ff]/50 hover:bg-[#00f0ff]/10 text-white font-bold rounded-full transition-all backdrop-blur-md group"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] to-[#00f0ff] group-hover:text-[#00f0ff] transition-colors">
              Assemble Your Crew
            </span>
            <Rocket
              size={18}
              className="text-[#00f0ff] group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
            />
          </Link>
        </div>
      </section>

      {/* --- 2. QUICK LINKS --- */}
      <nav className="sticky top-0 z-40 bg-[#020010]/80 backdrop-blur-xl border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-center gap-8 md:gap-16 overflow-x-auto no-scrollbar">
          {["The Cast", "Logistics", "Reviews", "FAQ"].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase().replace(" ", "-"))}
              className="text-xs md:text-sm font-bold text-white/40 hover:text-[#00f0ff] transition-colors uppercase tracking-[0.15em] whitespace-nowrap"
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* --- 3. THE CAST (WHY US) --- */}
      <section
        id="the-cast"
        className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Text */}
          <div>
            <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
              A Voice for
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#8a2be2]">
                Every Hero.
              </span>
            </h2>
            <div className="space-y-6 text-white/70 leading-relaxed text-lg font-light">
              <p>
                Multi-Cast production sits in the sweet spot between a solo read
                and a full Audio Drama.
              </p>
              <p>
                While Audio Drama focuses on sound design and music to tell the
                story,{" "}
                <strong>Multi-Cast focuses entirely on the actors.</strong> We
                hire 3-4 professionals to handle specific POV characters,
                bringing a distinct personality to every corner of your universe
                while keeping the text pure and narration-focused.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "3-4 Professional Actors",
                "Distinct Character Voices",
                "Focus on Vocal Performance",
                "Ideal for Sci-Fi & Fantasy",
              ].map((bullet, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle
                    size={16}
                    className="text-[#00f0ff] shrink-0 drop-shadow-[0_0_8px_#00f0ff]"
                  />
                  <span className="text-sm font-medium text-white/90">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Visual: Holographic Orbit System */}
          <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm">
            {/* Background Glows */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#00f0ff]/10 via-transparent to-[#8a2be2]/10" />

            <div className="absolute inset-0 flex items-center justify-center">
              {/* The Orbital System Container */}
              <div className="relative w-64 h-64">
                {/* Center Core (The Story) */}
                <div className="absolute inset-0 m-auto w-24 h-24 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/50 shadow-[0_0_30px_#d4af37] flex items-center justify-center z-20">
                  <div className="w-12 h-12 bg-[#d4af37] rounded-full animate-pulse" />
                </div>

                {/* Orbit Ring 1 */}
                <div className="absolute inset-0 w-full h-full rounded-full border border-[#00f0ff]/30 animate-[spin_10s_linear_infinite]">
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-[#00f0ff] rounded-full shadow-[0_0_15px_#00f0ff]" />
                </div>

                {/* Orbit Ring 2 (Opposite direction) */}
                <div className="absolute inset-4 rounded-full border border-[#8a2be2]/30 animate-[spin_15s_linear_infinite_reverse]">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-4 h-4 bg-[#8a2be2] rounded-full shadow-[0_0_15px_#8a2be2]" />
                </div>

                {/* Decorative Lines */}
                <div className="absolute inset-0 border border-white/5 rounded-full scale-150 opacity-20" />
              </div>
              <p className="absolute bottom-8 text-xs uppercase tracking-[0.3em] text-white/30">
                Cast Synchronization
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. LOGISTICS (PROCESS) --- */}
      <section
        id="logistics"
        className="relative z-10 py-24 bg-white/[0.02] border-y border-white/5 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif mb-4 text-white">
              Mission Control
            </h2>
            <p className="text-white/50">
              Managing a cast is hard. We make it easy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <PillarCard
              icon={Users}
              color="#d4af37" // Gold
              title="Casting"
              desc="We curate a team of 3-4 actors whose voices complement each other perfectly."
            />
            <PillarCard
              icon={Globe}
              color="#00f0ff" // Cyan
              title="Coordination"
              desc="We handle all scheduling across different time zones. You just get the files."
            />
            <PillarCard
              icon={Zap}
              color="#8a2be2" // Purple
              title="Consistency"
              desc="We build a pronunciation guide so every actor says 'Zorgon' the exact same way."
            />
            <PillarCard
              icon={Mic}
              color="#d4af37" // Gold
              title="Direction"
              desc="We direct the ensemble to ensure the tone matches across all chapters."
            />
            <PillarCard
              icon={ArrowRight}
              color="#00f0ff" // Cyan
              title="Delivery"
              desc="We merge the files into a retail-ready audiobook compliant with all platforms."
            />
          </div>
        </div>
      </section>

      {/* --- 5. REVIEWS --- */}
      <section
        id="reviews"
        className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
      >
        <h2 className="text-3xl md:text-4xl font-serif text-center mb-16">
          Transmission Received
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <TestimonialCard
            quote="I was worried different actors would be jarring, but CineSonic made it flow seamlessly. It felt like a high-budget TV series."
            author="Sci-Fi Reviewer"
            role="Audible Top 100"
            accent="#00f0ff"
          />
          <TestimonialCard
            quote="Finally, my four main characters actually sound different! The male and female narrators nailed the chemistry."
            author="Epic Fantasy Author"
            role="Client"
            accent="#d4af37"
          />
        </div>
      </section>

      {/* --- 6. FAQ --- */}
      <section id="faq" className="relative z-10 py-24 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif text-center mb-12">Flight Manual</h2>
        <div className="space-y-4">
          <AccordionItem
            q="How is this different from Audio Drama?"
            a="Audio Drama focuses on sound effects and music to drive the scene. Multi-Cast focuses on the ACTING. It is cleaner, relying on the text and the voice actors to build the world."
          />
          <AccordionItem
            q="How many actors should I hire?"
            a="We recommend 3 to 4. Usually one for the main narrator/protagonist, and others for key POV characters or gender-specific roles."
          />
          <AccordionItem
            q="Does this cost more than Solo?"
            a="Yes. You are paying for multiple professionals. However, we bundle the project management fee to keep it affordable."
          />
          <AccordionItem
            q="Who owns the rights?"
            a="You do. Complete ownership. We facilitate the contracts with the actors so it's all work-for-hire."
          />
        </div>
      </section>

      {/* --- 7. CTA --- */}
      <section className="relative z-10 py-20 px-6">
        {/* Holographic Card Effect */}
        <div className="max-w-5xl mx-auto rounded-[2rem] bg-[#0a0a20]/80 backdrop-blur-xl p-12 md:p-20 text-center relative overflow-hidden group border border-white/10 shadow-[0_0_50px_rgba(0,240,255,0.1)]">
          {/* Animated Gradient Border */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

          <div className="relative z-10">
            <Disc
              size={40}
              className="mx-auto mb-6 text-[#d4af37] animate-spin-slow"
            />
            <h2 className="text-4xl md:text-5xl font-serif text-white mb-6">
              Ready for Liftoff?
            </h2>
            <p className="text-white/60 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
              Assemble your crew. Tell your story.
            </p>
            <Link
              href="/contact"
              className="inline-block px-12 py-4 bg-gradient-to-r from-[#00f0ff] to-[#8a2be2] text-white font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              Initiate Sequence
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- SUB-COMPONENTS ---

function PillarCard({ icon: Icon, title, desc, color }) {
  return (
    <div className="p-8 rounded-xl bg-[#0a0a15] border border-white/5 hover:border-white/20 transition-all group relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center mb-6 group-hover:bg-white/10 transition-colors">
        <Icon
          size={24}
          style={{ color: color }}
          className="transition-transform group-hover:scale-110"
        />
      </div>
      <h3 className="text-xl font-serif mb-3 text-white">{title}</h3>
      <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/70 transition-colors">
        {desc}
      </p>
    </div>
  );
}

function TestimonialCard({ quote, author, role, accent }) {
  return (
    <div className="p-10 rounded-2xl bg-[#0a0a15] border border-white/5 relative hover:bg-[#0f0f20] transition-colors">
      <div className="absolute -top-3 -left-3 bg-[#020010] p-2 rounded-full border border-white/10">
        <Star size={16} fill={accent} stroke="none" />
      </div>
      <p className="text-lg text-white/80 italic mb-8 leading-relaxed font-light">
        "{quote}"
      </p>
      <div className="flex items-center gap-4">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-[#020010]"
          style={{ backgroundColor: accent }}
        >
          {author[0]}
        </div>
        <div>
          <div className="font-bold text-white">{author}</div>
          <div
            className="text-xs uppercase tracking-wider font-bold"
            style={{ color: accent }}
          >
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
    <div className="border border-white/10 rounded-lg bg-[#0a0a15] overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-medium text-lg text-white/90">{q}</span>
        {isOpen ? (
          <ChevronUp className="text-[#00f0ff]" />
        ) : (
          <ChevronDown className="text-white/30" />
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
