"use client";
import React, { useState, useRef, useMemo } from "react";
import Link from "next/link";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  PenTool,
  Mic,
  Clapperboard,
  Zap,
  Network,
  ArrowRight,
  Activity,
  Layers,
} from "lucide-react";

// 🟢 IMPORT YOUR LEGOS
import ProductionPipeline from "../../../../components/marketing/ProductionPipeline";
import TestimonialsFeed from "../../../../components/marketing/TestimonialsFeed";

// --- 3D COMPONENT: THE SYNAPSE (Connection Network) ---
function NeuralNetwork({ count = 100 }) {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Create random nodes
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 30;
      const y = (Math.random() - 0.5) * 30;
      const z = (Math.random() - 0.5) * 10;
      const speedX = (Math.random() - 0.5) * 0.02;
      const speedY = (Math.random() - 0.5) * 0.02;
      temp.push({ x, y, z, speedX, speedY });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((p, i) => {
      // Gentle floating movement
      p.x += p.speedX;
      p.y += p.speedY;

      // Boundary check (bounce back)
      if (Math.abs(p.x) > 15) p.speedX *= -1;
      if (Math.abs(p.y) > 15) p.speedY *= -1;

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(0.1, 0.1, 0.1); // Tiny nodes
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  // Note: Drawing actual lines between moving instances in R3F is performance heavy.
  // We simulate the "connected" feel with the static visual design overlaid on top.
  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#d4af37" transparent opacity={0.4} />
    </instancedMesh>
  );
}

// --- DATA: THE HORIZONTAL ROLES ---
const ROLES = [
  {
    id: "author",
    title: "The Architect",
    role: "Author",
    icon: PenTool,
    desc: "The source code. In traditional publishing, the author is often silenced once the rights are sold. Here, you are the North Star. We do not change a comma without understanding the 'Why'.",
  },
  {
    id: "actor",
    title: "The Vessel",
    role: "Narrator",
    icon: Mic,
    desc: "The emotional conduit. We don't hire 'readers.' We hire actors who can dismantle their own ego to inhabit your characters. They aren't just reciting text; they are living it.",
  },
  {
    id: "director",
    title: "The Navigator",
    role: "Director",
    icon: Clapperboard,
    desc: "The glue. The Director ensures the Actor's performance aligns with the Author's intent. They manage the pacing, the subtext, and the silence between the words.",
  },
];

export default function ArtisticCollaborationPage() {
  const [activeRole, setActiveRole] = useState(ROLES[0]);

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-[#d4af37]/30 overflow-x-hidden">
      {/* --- 0. BACKGROUND: THE SYNAPSE --- */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 20], fov: 50 }}>
          <NeuralNetwork count={150} />
          <fog attach="fog" args={["#050505", 10, 40]} />
        </Canvas>
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/90 via-[#050505]/50 to-[#050505]" />
      </div>

      {/* --- 1. HERO --- */}
      <section className="relative z-10 pt-32 pb-20 px-6 border-b border-white/5">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-white/10 bg-white/5 rounded-full mb-8">
            <Network size={14} className="text-[#d4af37]" />
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/60 font-bold">
              Production Philosophy
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-serif mb-8 text-white tracking-tight drop-shadow-2xl">
            The Horizontal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4af37] via-white to-[#d4af37]">
              Hierarchy.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-white/60 leading-relaxed max-w-2xl mx-auto font-light">
            We rejected the factory-line model of audiobook production.
            <br />
            Art doesn't happen when people take orders. <br />
            <strong className="text-white">
              Art happens when vision syncs.
            </strong>
          </p>
        </div>
      </section>

      {/* --- 2. THE BESPOKE COLLABORATION ENGINE --- */}
      <section className="relative z-10 py-24 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* LEFT: The Text Engine */}
          <div className="order-2 lg:order-1">
            <h2 className="text-3xl md:text-4xl font-serif text-white mb-6">
              Total Synchronization.
            </h2>
            <div className="space-y-6 text-lg text-white/60 leading-relaxed font-light mb-12">
              <p>
                In a standard studio, the file moves down a conveyor belt. The
                author sends a PDF, the narrator reads it alone in a closet, and
                the engineer fixes the mistakes. There is no conversation.
              </p>
              <p>
                <strong>We built a circle, not a line.</strong>
              </p>
              <p>
                Our production model forces a collision between the Author, the
                Actor, and the Director before recording even begins. We align
                on tone, subtext, and character psychology so that when the red
                light turns on, everyone is telling the exact same story.
              </p>
            </div>

            {/* Dynamic Card */}
            <div className="p-1 rounded-2xl bg-gradient-to-br from-[#d4af37]/30 to-transparent">
              <div className="bg-[#0a0a0a] rounded-xl p-8 relative overflow-hidden h-[200px] flex flex-col justify-center">
                {/* Background Glow */}
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-[#d4af37]/10 blur-[60px]" />

                <div
                  className="relative z-10 animate-[fadeIn_0.5s_ease-out]"
                  key={activeRole.id}
                >
                  <div className="flex items-center gap-3 mb-4 text-[#d4af37]">
                    <activeRole.icon size={24} />
                    <h4 className="font-bold uppercase tracking-widest text-sm">
                      {activeRole.title}
                    </h4>
                  </div>
                  <p className="text-white/80 text-lg md:text-xl font-serif italic leading-relaxed">
                    "{activeRole.desc}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: The Visualizer (Bespoke Interactive) */}
          <div className="relative h-[500px] w-full flex items-center justify-center order-1 lg:order-2">
            {/* Central Core (The Project) */}
            <div className="relative w-40 h-40 rounded-full bg-black border border-[#d4af37]/50 flex items-center justify-center z-20 shadow-[0_0_60px_rgba(212,175,55,0.15)]">
              <div className="absolute inset-0 rounded-full border border-white/10 animate-[spin_20s_linear_infinite]" />
              <div className="text-center">
                <Activity
                  size={32}
                  className="text-[#d4af37] mx-auto mb-2 animate-pulse"
                />
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                  Vision Core
                </span>
              </div>
            </div>

            {/* Connecting Lines (Static SVG for stability) */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30">
              <line
                x1="50%"
                y1="50%"
                x2="50%"
                y2="10%"
                stroke="#d4af37"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              <line
                x1="50%"
                y1="50%"
                x2="15%"
                y2="80%"
                stroke="#d4af37"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
              <line
                x1="50%"
                y1="50%"
                x2="85%"
                y2="80%"
                stroke="#d4af37"
                strokeWidth="1"
                strokeDasharray="5,5"
              />
            </svg>

            {/* Orbiting Buttons */}
            {ROLES.map((role, i) => {
              const isActive = activeRole.id === role.id;
              // Hardcoded positions for perfect triangle
              const positions = [
                "top-[10%] left-[50%] -translate-x-1/2", // Top
                "bottom-[15%] left-[15%]", // Bottom Left
                "bottom-[15%] right-[15%]", // Bottom Right
              ];

              return (
                <button
                  key={role.id}
                  onClick={() => setActiveRole(role)}
                  className={`absolute w-28 h-28 rounded-full border bg-[#050505] flex flex-col items-center justify-center transition-all duration-500 z-30 group
                            ${positions[i]}
                            ${
                              isActive
                                ? "border-[#d4af37] shadow-[0_0_30px_rgba(212,175,55,0.4)] scale-110"
                                : "border-white/10 hover:border-white hover:scale-105"
                            }
                        `}
                >
                  <role.icon
                    size={28}
                    className={`mb-2 transition-colors ${
                      isActive
                        ? "text-[#d4af37]"
                        : "text-white/40 group-hover:text-white"
                    }`}
                  />
                  <span
                    className={`text-[10px] uppercase tracking-widest font-bold ${
                      isActive ? "text-[#d4af37]" : "text-white/40"
                    }`}
                  >
                    {role.role}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- 3. THE SYNC POINTS (REUSING PIPELINE) --- */}
      {/* We reuse the Pipeline Lego, but wrap it in a context that makes it about COLLABORATION, not just steps */}
      <section className="relative z-10 bg-black/40 backdrop-blur-md border-y border-white/5">
        <div className="py-12 text-center">
          <div className="inline-flex items-center gap-2 mb-4 opacity-70">
            <Layers size={14} className="text-[#d4af37]" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#d4af37]">
              Integration
            </span>
          </div>
          <h2 className="text-3xl font-serif text-white">Where Minds Meet.</h2>
        </div>
        {/* This component fits perfectly here as it shows the linear flow of this collaboration */}
        <ProductionPipeline />
      </section>

      {/* --- 4. THE PROOF (REUSING TESTIMONIALS) --- */}
      <section className="relative z-10 pt-24 pb-0">
        <div className="max-w-4xl mx-auto px-6 text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-serif text-white mb-6">
            The Result of <br />
            <span className="text-[#d4af37] italic">Raw Fruition.</span>
          </h2>
          <p className="text-white/60">
            When you respect the process, the audience hears the difference.
          </p>
        </div>

        {/* Drop in the feed Lego */}
        <TestimonialsFeed />
      </section>

      {/* --- 5. CTA --- */}
      <section className="relative z-10 py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto rounded-3xl bg-gradient-to-r from-[#d4af37]/20 to-transparent p-12 border border-[#d4af37]/20">
          <h2 className="text-3xl font-serif text-white mb-8">
            Stop manufacturing content. <br />
            Start collaborating on{" "}
            <span className="text-[#d4af37] italic">art.</span>
          </h2>
          <Link
            href="/projectform"
            className="inline-flex items-center gap-3 px-10 py-4 bg-[#d4af37] text-black font-bold uppercase tracking-widest rounded-full hover:bg-white hover:scale-105 transition-all shadow-[0_0_40px_rgba(212,175,55,0.4)]"
          >
            Initiate Sequence <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
