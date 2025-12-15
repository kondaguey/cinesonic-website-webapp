"use client";
import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import {
  Sparkles,
  Heart,
  Anchor,
  Lightbulb,
  Users,
  Feather,
  Aperture,
  Disc,
} from "lucide-react";

// --- DATA ---
const VALUES = [
  {
    title: "Artistry First",
    description:
      "Technology serves the performance. We preserve the human element in every breath, pause, and inflection.",
    icon: Sparkles,
  },
  {
    title: "Collaboration",
    description:
      "The best stories emerge from the collective spark of authors, narrators, and directors working in sync.",
    icon: Heart,
  },
  {
    title: "Integrity",
    description:
      "We honor the author's intent above all else. It is the anchor that holds us steady against fleeting trends.",
    icon: Anchor,
  },
  {
    title: "Innovation",
    description:
      "Pushing the boundaries of immersive sound design, spatial audio, and cinematic performance.",
    icon: Lightbulb,
  },
  {
    title: "Empathy",
    description:
      "We listen deeply. Understanding the psychology of your characters is the beating heart of our craft.",
    icon: Users,
  },
  {
    title: "Stewardship",
    description:
      "We don't just record books; we archive culture. Nurturing stories ensures they echo for future generations.",
    icon: Feather,
  },
];

// --- 3D COMPONENT: STUDIO DUST ---
function StudioDust({ count = 300 }) {
  const mesh = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * 50;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 20;
      const speed = Math.random() * 0.02;
      temp.push({ x, y, z, speed });
    }
    return temp;
  }, [count]);

  useFrame(() => {
    if (!mesh.current) return;
    particles.forEach((p, i) => {
      p.y += p.speed;
      if (p.y > 25) p.y = -25;
      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.set(0.05, 0.05, 0.05);
      dummy.rotation.x += 0.01;
      dummy.updateMatrix();
      mesh.current.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[null, null, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#d4af37" transparent opacity={0.4} />
    </instancedMesh>
  );
}

export default function CoreValues() {
  return (
    <main className="relative min-h-screen w-full bg-[#050505] overflow-x-hidden selection:bg-[#d4af37]/30 font-sans">
      {/* --- 1. 3D BACKGROUND --- */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
          <StudioDust count={400} />
          <fog attach="fog" args={["#050505", 5, 30]} />
        </Canvas>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_#050505_100%)] opacity-80" />
      </div>

      {/* --- 2. HEADER SECTION --- */}
      <section className="relative z-10 pt-40 pb-20 px-6 text-center">
        <div className="inline-flex items-center gap-3 px-4 py-2 border border-[#d4af37]/20 bg-[#d4af37]/5 backdrop-blur-md rounded-full mb-10 shadow-[0_0_20px_-5px_rgba(212,175,55,0.3)]">
          <Aperture size={16} className="text-[#d4af37] animate-spin-slow" />
          <span className="text-xs tracking-[0.3em] uppercase text-[#d4af37] font-bold">
            Company Ethos
          </span>
        </div>

        {/* 🟢 ADJUSTMENT 1: Tamed H1 Size */}
        <h1 className="text-5xl md:text-7xl font-serif text-white tracking-tight leading-none mb-8 drop-shadow-2xl">
          The Director's <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#bf953f] via-[#fcf6ba] to-[#b38728] italic pr-4">
            Cut.
          </span>
        </h1>

        <p className="max-w-xl mx-auto text-white/50 text-lg md:text-xl font-light leading-relaxed">
          The principles that guide our hand in the dark.
        </p>
      </section>

      {/* --- 3. THE TIMELINE LAYOUT --- */}
      <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 pb-40">
        {/* 🟢 ADJUSTMENT 3: VISIBLE FILM STRIP SPINE (Pure CSS) */}
        <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-[2px] md:w-[60px] md:-translate-x-1/2 z-0">
          {/* Mobile Line (Simple) */}
          <div className="md:hidden absolute inset-0 bg-gradient-to-b from-transparent via-[#d4af37]/30 to-transparent" />

          {/* Desktop Film Strip (Visible) */}
          <div className="hidden md:block w-full h-full border-x border-[#d4af37]/20 bg-[#0a0a0a]/50 backdrop-blur-sm relative overflow-hidden">
            {/* Sprocket Holes Pattern */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: `linear-gradient(to bottom, transparent 50%, #d4af37 50%), linear-gradient(to bottom, transparent 50%, #d4af37 50%)`,
                backgroundSize: "4px 20px, 4px 20px",
                backgroundPosition: "left top, right top",
                backgroundRepeat: "repeat-y",
              }}
            />
            {/* Center Glow */}
            <div className="absolute inset-x-0 top-0 bottom-0 bg-gradient-to-b from-transparent via-[#d4af37]/10 to-transparent" />
          </div>

          {/* The "Playhead" (Sticky Element) */}
          <div className="sticky top-1/2 -translate-y-1/2 w-4 h-4 md:w-full md:h-1 bg-[#d4af37] md:bg-[#d4af37]/50 shadow-[0_0_30px_#d4af37] -ml-[7px] md:ml-0 z-10 flex items-center justify-center">
            <div className="hidden md:block absolute w-full h-[1px] bg-[#d4af37]" />
          </div>
        </div>

        {/* === VALUE CARDS === */}
        {/* 🟢 ADJUSTMENT 2: Closer Nodes (space-y-16) */}
        <div className="relative z-10 space-y-16 md:space-y-24">
          {VALUES.map((value, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex flex-col md:flex-row items-center w-full ${
                  isEven ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* SPACER */}
                <div className="hidden md:block w-1/2" />

                {/* CONTENT HALF */}
                <div
                  className={`w-full md:w-1/2 flex ${
                    isEven ? "justify-start md:pl-24" : "justify-end md:pr-24"
                  } pl-12 md:pl-0`} // Mobile padding to clear spine
                >
                  <ValueCard data={value} index={index} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* --- 4. FOOTER MARKER --- */}
      <div className="relative z-20 pb-24 text-center">
        <div className="inline-flex flex-col items-center gap-4 opacity-30">
          <div className="w-px h-16 bg-gradient-to-b from-[#d4af37] to-transparent" />
          <Disc size={24} className="animate-spin-slow text-[#d4af37]" />
          <span className="text-[10px] tracking-[0.5em] uppercase font-bold">
            End Reel
          </span>
        </div>
      </div>
    </main>
  );
}

// --- SUB-COMPONENT: OBSIDIAN CARD ---
function ValueCard({ data, index }) {
  const Icon = data.icon;

  return (
    <div className="group relative w-full max-w-lg perspective-1000">
      {/* Connection Line (Desktop) - Connects card to film strip */}
      <div
        className={`hidden md:block absolute top-1/2 w-24 h-px bg-[#d4af37]/20 
                ${index % 2 === 0 ? "-left-24" : "-right-24"} 
            `}
      >
        <div
          className={`absolute top-1/2 -translate-y-1/2 w-1 h-1 bg-[#d4af37] rounded-full ${
            index % 2 === 0 ? "-left-0" : "-right-0"
          }`}
        />
      </div>

      {/* The Card */}
      <div className="relative p-8 md:p-10 rounded-3xl bg-[#0a0a0a] border border-white/5 overflow-hidden transition-all duration-500 hover:border-[#d4af37]/50 hover:shadow-[0_0_50px_-10px_rgba(212,175,55,0.15)] hover:-translate-y-2">
        {/* Hover Spotlight Gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(600px_at_50%_50%,rgba(212,175,55,0.15),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Noise Texture */}
        <div className="absolute inset-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="p-3 rounded-2xl bg-white/5 border border-white/10 text-[#d4af37] group-hover:bg-[#d4af37] group-hover:text-black transition-colors duration-500">
              <Icon size={24} strokeWidth={1.5} />
            </div>
            <span className="font-serif text-5xl text-white/5 font-bold group-hover:text-[#d4af37]/10 transition-colors duration-500">
              0{index + 1}
            </span>
          </div>

          {/* Text */}
          <h3 className="text-2xl font-serif text-white mb-3 group-hover:text-[#d4af37] transition-colors duration-300">
            {data.title}
          </h3>
          <p className="text-white/60 font-light leading-relaxed text-base group-hover:text-white/80 transition-colors duration-300">
            {data.description}
          </p>
        </div>
      </div>
    </div>
  );
}
