"use client";
import React, { useState, useRef, useMemo, useEffect } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  ArrowRight,
  Star,
  ChevronDown,
  ChevronUp,
  Mic2,
  Flame,
  Zap,
  Repeat,
  Shield,
  Music,
} from "lucide-react";

// 🟢 IMPORT ROSTER COMPONENT
import RosterPreview from "../../../../components/marketing/RosterPreview";

// --- 3D COMPONENT: REALISTIC RISING EMBERS ---
function Embers({ count = 300 }) {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const { particles, colors } = useMemo(() => {
    const tempParticles = [];
    const tempColors = [];
    const colorPalette = [
      new THREE.Color("#ff3300"), // Deep Red/Orange
      new THREE.Color("#ff7700"), // Bright Orange
      new THREE.Color("#ffaa00"), // Gold/Yellow orange
      new THREE.Color("#ff4500"), // Standard OrangeRed
    ];

    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 20;
      const y = (Math.random() - 0.5) * 20;
      const z = (Math.random() - 0.5) * 10;
      const speed = 0.1 + Math.random() * 0.6;
      const sway = Math.random() * 0.02;
      const offset = Math.random() * 100;
      const baseScale = 0.02 + Math.random() * 0.04;

      tempParticles.push({ x, y, z, speed, sway, offset, baseScale });
      const color =
        colorPalette[Math.floor(Math.random() * colorPalette.length)];
      tempColors.push(color.r, color.g, color.b);
    }
    return { particles: tempParticles, colors: new Float32Array(tempColors) };
  }, [count]);

  useEffect(() => {
    if (mesh.current) {
      mesh.current.geometry.setAttribute(
        "color",
        new THREE.InstancedBufferAttribute(colors, 3)
      );
    }
  }, [colors]);

  useFrame((state) => {
    if (!mesh.current) return;
    particles.forEach((p, i) => {
      const time = state.clock.elapsedTime;
      let currentY = p.y + ((time * p.speed) % 20);
      if (currentY > 10) currentY -= 20;
      const currentX = p.x + Math.sin(time + p.offset) * p.sway;
      const slowBreath = Math.sin(time * 2 + p.offset) * 0.2 + 0.8;
      const fastJitter = Math.sin(time * 15 + p.offset) * 0.1;
      const currentScale = p.baseScale * (slowBreath + fastJitter);

      dummy.position.set(currentX, currentY, p.z);
      dummy.scale.set(currentScale, currentScale, currentScale);
      dummy.rotation.x = time * p.speed * 0.5 + p.offset;
      dummy.rotation.z = time * p.speed * 0.3 + p.offset;
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial
        vertexColors={true}
        toneMapped={false}
        transparent
        opacity={0.8}
        fog={true}
      />
    </instancedMesh>
  );
}

// --- MAIN PAGE COMPONENT ---
export default function DuetAudiobookPage() {
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <main className="min-h-screen bg-[#050000] text-white selection:bg-[#ff4500]/40 relative">
      {/* --- 0. BACKGROUND: THE FURNACE (Fixed 3D Canvas) --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 10], fov: 50 }}>
          <fog attach="fog" args={["#050000", 8, 25]} />
          <Embers count={250} />
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050000] via-transparent to-[#050000] opacity-80" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050000] via-[#ff4500]/10 to-[#050000] mix-blend-overlay" />
      </div>

      {/* --- 1. HERO SECTION --- */}
      <section className="relative z-10 pt-32 pb-20 px-6 border-b border-white/5 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          {/* Badge: FLAME ICON */}
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff4500]/50 bg-[#ff4500]/10 rounded-full mb-8 shadow-[0_0_20px_#ff4500]">
            <Flame
              size={14}
              className="text-[#ff4500] fill-[#ff4500] animate-pulse"
            />
            <span className="text-[11px] tracking-[0.2em] uppercase text-[#ff4500] font-bold">
              High Heat Production
            </span>
          </div>

          <h1 className="text-6xl md:text-8xl font-serif mb-8 drop-shadow-2xl text-white tracking-tight">
            Duet <span className="italic text-[#ff4500]">Narration.</span>
          </h1>

          <p className="text-xl md:text-2xl text-white/80 leading-relaxed mb-10 max-w-2xl mx-auto font-light">
            Real acting. Real chemistry. <br />
            <span className="text-white font-medium">
              Sparks flying in real-time.
            </span>
          </p>

          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#ff4500] to-[#ff0055] text-white font-bold rounded-full transition-all shadow-[0_0_30px_rgba(255,69,0,0.4)] hover:shadow-[0_0_60px_rgba(255,69,0,0.6)] hover:scale-105"
          >
            Turn Up The Heat <Zap size={20} fill="currentColor" />
          </Link>
        </div>
      </section>

      {/* --- 2. QUICK LINKS NAV --- */}
      <nav className="sticky top-0 z-40 bg-[#050000]/80 backdrop-blur-md border-b border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-6 flex justify-center gap-6 md:gap-12 overflow-x-auto no-scrollbar">
          {["The Spark", "Process", "Reviews", "FAQ"].map((item) => (
            <button
              key={item}
              onClick={() => scrollTo(item.toLowerCase().replace(" ", "-"))}
              className="text-xs md:text-sm font-bold text-white/40 hover:text-[#ff4500] transition-colors uppercase tracking-widest whitespace-nowrap"
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* --- 3. WHY US (THE SPARK) --- */}
      <section
        id="the-spark"
        className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
      >
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-4xl md:text-6xl font-serif mb-8 leading-tight">
              It's not just reading.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff4500] to-[#ff0055] italic">
                It's intimacy.
              </span>
            </h2>
            <div className="space-y-6 text-white/70 leading-relaxed text-lg font-light">
              <p>
                Duet narration is the{" "}
                <strong className="text-white">premium choice</strong> for
                immersion. Unlike Dual narration, the actors speak their
                character's lines throughout the entire book.
              </p>
              <p>
                If the Hero whispers in the Heroine's ear during her chapter,
                the Male actor delivers that line. This creates a seamless,
                movie-like flow that listeners are absolutely obsessed with.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                "Maximum Immersion",
                "True Dialogue Interaction",
                "Premium Production Value",
                "High Viral Potential",
              ].map((bullet, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Flame
                    size={18}
                    className="text-[#ff4500] shrink-0 fill-[#ff4500]"
                  />
                  <span className="text-sm font-medium text-white/90">
                    {bullet}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative aspect-square md:aspect-[4/3] rounded-3xl overflow-hidden border border-[#ff4500]/30 bg-[#ff4500]/5 shadow-[0_0_50px_rgba(255,69,0,0.1)]">
            <div className="absolute inset-0 bg-gradient-to-t from-[#ff0055]/40 via-transparent to-transparent opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-[#ff4500] blur-[100px] opacity-50 rounded-full animate-pulse" />
                <div className="relative z-10 flex gap-6">
                  <Mic2
                    size={80}
                    className="text-white/90 drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]"
                  />
                  <Mic2
                    size={80}
                    className="text-[#ff4500] drop-shadow-[0_0_15px_rgba(255,69,0,0.8)] -scale-x-100"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 4. PILLARS (THE PROCESS) --- */}
      <section
        id="process"
        className="relative z-10 py-24 bg-black/40 border-y border-white/5 backdrop-blur-sm"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif mb-4 text-white">
              The Chemistry Set
            </h2>
            <p className="text-white/50 text-lg">How we engineer the sparks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <PillarCard
              icon={Mic2}
              title="Casting"
              desc="We don't just find voices. We find actors with undeniable chemistry."
            />
            <PillarCard
              icon={Zap}
              title="Editing"
              desc="The most complex edit in the game. Stitched line-by-line for perfect flow."
            />
            <PillarCard
              icon={Repeat}
              title="Acting"
              desc="We focus on reaction and interaction. The breath between the words."
            />
            <PillarCard
              icon={Shield}
              title="Privacy"
              desc="For steamy content, we ensure discretion and professionalism always."
            />
            <PillarCard
              icon={Music}
              title="Tone"
              desc="Consistent room tone matching so the edits are completely invisible."
            />
          </div>
        </div>
      </section>

      {/* --- 🟢 ROSTER PREVIEW (THE FURNACE INTEGRATION) --- */}
      <div className="relative z-10">
        {/* Heat Haze Background Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[80%] bg-[#ff4500]/10 blur-[150px] pointer-events-none z-0 mix-blend-screen" />

        {/* Pass Magma Orange Color */}
        <RosterPreview accentColor="#ff4500" />
      </div>

      {/* --- 5. TESTIMONIALS --- */}
      <section
        id="reviews"
        className="relative z-10 py-24 px-6 max-w-7xl mx-auto"
      >
        <h2 className="text-4xl md:text-5xl font-serif text-center mb-16">
          Hot Off The Press
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <TestimonialCard
            quote="I can never go back to normal audiobooks. The banter felt so real I felt like I was interrupting them. 5 stars."
            author="Audible Listener"
            role="Verified Purchase"
          />
          <TestimonialCard
            quote="CineSonic pulled off a logistical miracle. The chemistry is palpable. My readers are literally screaming in my DMs."
            author="Romance Author X"
            role="USA Today Bestseller"
          />
        </div>
      </section>

      {/* --- 6. FAQ --- */}
      <section id="faq" className="relative z-10 py-24 px-6 max-w-3xl mx-auto">
        <h2 className="text-4xl font-serif text-center mb-12">
          Burning Questions
        </h2>
        <div className="space-y-4">
          <AccordionItem
            q="Is Duet expensive?"
            a="Yes, it is a premium service. It requires roughly 3x the editing time of a standard book to stitch dialogue line-by-line. But the result is unmatched."
          />
          <AccordionItem
            q="Do actors record together?"
            a="Ideally yes, via remote connection, so they can react in real-time. If schedules don't align, we use advanced timing techniques to simulate it."
          />
          <AccordionItem
            q="Does it take longer?"
            a="Expect a 20-30% longer post-production cycle compared to Dual narration due to the complexity of the mix."
          />
          <AccordionItem
            q="Why choose Duet over Dual?"
            a="If your book relies heavily on witty banter, arguments, intense emotional exchanges, or spice—Duet is the only way to do it justice."
          />
        </div>
      </section>

      {/* --- 7. CTA --- */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-5xl mx-auto rounded-[3rem] bg-gradient-to-r from-[#ff4500] via-[#ff0055] to-[#ff4500] p-12 md:p-20 text-center relative overflow-hidden group border border-[#ff4500]/50 shadow-[0_0_100px_rgba(255,69,0,0.3)]">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-7xl font-serif text-white mb-8 drop-shadow-lg">
              Let's make something <br />{" "}
              <span className="italic">unforgettable.</span>
            </h2>
            <p className="text-white/90 text-xl md:text-2xl mb-12 max-w-2xl mx-auto font-medium">
              Your characters deserve this level of passion.
            </p>
            <Link
              href="/contact"
              className="inline-block px-12 py-5 bg-black text-white font-bold text-lg rounded-full hover:scale-105 transition-transform shadow-2xl border border-white/10"
            >
              Start The Fire
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

// --- SUB-COMPONENTS ---
function PillarCard({ icon: Icon, title, desc }) {
  return (
    <div className="p-8 rounded-2xl bg-black/40 border border-white/10 hover:border-[#ff4500]/50 transition-colors group backdrop-blur-md">
      <div className="w-14 h-14 rounded-full bg-[#ff4500]/10 flex items-center justify-center mb-6 group-hover:bg-[#ff4500] transition-colors duration-300">
        <Icon
          size={28}
          className="text-[#ff4500] group-hover:text-white transition-colors duration-300"
        />
      </div>
      <h3 className="text-xl font-serif mb-3 text-white">{title}</h3>
      <p className="text-sm text-white/60 leading-relaxed">{desc}</p>
    </div>
  );
}

function TestimonialCard({ quote, author, role }) {
  return (
    <div className="p-10 rounded-3xl bg-gradient-to-br from-[#ff4500]/10 to-transparent border border-[#ff4500]/20 relative hover:border-[#ff4500]/40 transition-colors backdrop-blur-md">
      <div className="absolute -top-4 -left-4 bg-[#050000] p-2 rounded-full border border-[#ff4500]/30 shadow-[0_0_15px_#ff4500]">
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={14} fill="#ff4500" stroke="none" />
          ))}
        </div>
      </div>
      <p className="text-xl text-white/90 italic mb-8 leading-relaxed font-serif">
        "{quote}"
      </p>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff4500] to-[#ff0055] flex items-center justify-center text-white font-bold">
          {author[0]}
        </div>
        <div>
          <div className="font-bold text-white text-lg">{author}</div>
          <div className="text-xs text-[#ff4500] uppercase tracking-wider font-bold">
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
    <div className="border border-white/10 rounded-xl bg-black/40 backdrop-blur-md overflow-hidden hover:border-[#ff4500]/30 transition-colors">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
      >
        <span className="font-medium text-lg text-white/90">{q}</span>
        {isOpen ? (
          <ChevronUp className="text-[#ff4500]" />
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
