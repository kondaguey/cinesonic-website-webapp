"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "./ThemeContext";
// 🔴 BUG FIX 2: Removed unused icon imports so they don't get rendered
import { Heart } from "lucide-react";

export default function ParticleFx({
  mode = "ambient",
  vector = "none",
  forceCinematic = null,
  forceTheme = null,
}) {
  const canvasRef = useRef(null);
  const { theme: globalTheme, isCinematic: globalCinematic } = useTheme();

  // HYDRATION FIX
  const [isMounted, setIsMounted] = useState(false);

  // Active State
  const activeCinematic =
    forceCinematic !== null ? forceCinematic : globalCinematic;
  const activeTheme = forceTheme !== null ? forceTheme : globalTheme;

  // --- COLORS ---
  const COLORS = {
    gold: "#d4af37",
    pink: "#ff3399",
    fire: "#ff4500",
    cyan: "#00f0ff",
    silver: "#c0c0c0",
    violet: "#7c3aed",
  };
  const themeHex = COLORS[activeTheme] || COLORS.gold;
  const accentHex = activeCinematic ? COLORS.violet : themeHex;

  // SET MOUNTED
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // --- CANVAS PHYSICS ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width =
          mode === "button" ? parent.clientWidth : window.innerWidth;
        canvas.height =
          mode === "button" ? parent.clientHeight : window.innerHeight;
      }
    };
    resizeCanvas();
    if (mode !== "button") window.addEventListener("resize", resizeCanvas);

    let pCount = mode === "hero" ? 60 : mode === "button" ? 15 : 30;
    const particleCount = activeCinematic ? pCount + 10 : pCount;

    class Particle {
      constructor() {
        this.reset(true);
      }
      reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : canvas.height + 10;

        const speed = activeCinematic ? 1.5 : 0.8;
        this.speedY = (Math.random() * 0.5 + 0.1) * speed;
        this.speedX = (Math.random() * 0.4 - 0.2) * speed;
        this.size =
          mode === "button" ? Math.random() * 1.5 : Math.random() * 3 + 0.5;

        const rand = Math.random();
        if (rand > 0.9) this.color = "#ffffff";
        else if (rand > 0.5) this.color = accentHex;
        else this.color = themeHex;

        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
      }
      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.opacity -= this.fadeSpeed;
        if (this.y < -10 || this.opacity <= 0) this.reset();
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${parseInt(
          this.color.slice(1, 3),
          16
        )}, ${parseInt(this.color.slice(3, 5), 16)}, ${parseInt(
          this.color.slice(5, 7),
          16
        )}, ${this.opacity})`;
        ctx.fill();
      }
    }

    const particles = Array.from(
      { length: particleCount },
      () => new Particle()
    );

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.globalCompositeOperation = "lighter";
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (mode !== "button") window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [activeTheme, activeCinematic, mode, themeHex, accentHex]);

  // --- RENDER ---
  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden rounded-inherit">
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-60px) scale(1.2);
            opacity: 0;
          }
        }
        @keyframes riseFast {
          0% {
            transform: translateY(0) scale(0.8) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(1.2) rotate(90deg);
            opacity: 0;
          }
        }
        @keyframes shootUp {
          0% {
            transform: translateY(100%);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translateY(-150%);
            opacity: 0;
          }
        }
        @keyframes speckleFloat {
          0%,
          100% {
            transform: translate(0, 0);
            opacity: 0.4;
          }
          50% {
            transform: translate(5px, -10px);
            opacity: 1;
          }
        }
      `}</style>

      <canvas ref={canvasRef} className="absolute inset-0 z-0 opacity-60" />

      {isMounted && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          {vector === "solo" && (
            <SoloVector
              base={themeHex}
              accent={accentHex}
              isCine={activeCinematic}
            />
          )}
          {vector === "dual" && (
            <DualVector
              base={themeHex}
              accent={accentHex}
              isCine={activeCinematic}
            />
          )}
          {vector === "duet" && (
            <DuetVector
              base={themeHex}
              accent={accentHex}
              isCine={activeCinematic}
            />
          )}
          {vector === "multi" && (
            <MultiVector
              base={themeHex}
              accent={accentHex}
              isCine={activeCinematic}
            />
          )}
        </div>
      )}
    </div>
  );
}

// ==================================================================================
// 🟢 BUG FIX 2: REMOVED CENTRAL ICONS FROM ALL VECTORS BELOW
// Now they just render the "Energy" (Glows, Lines, Specs, Hearts)
// ==================================================================================

// 1. SOLO: Breathing Glow + Gold/Violet Specs
function SoloVector({ base, accent, isCine }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center animate-fade-in">
      {/* Central Glow (No Icon) */}
      <div
        className="absolute w-32 h-32 rounded-full opacity-30 blur-[40px] animate-pulse"
        style={{ background: `radial-gradient(circle, ${base}, ${accent})` }}
      />
      <div
        className="absolute w-20 h-20 border border-[var(--b)] rounded-full opacity-20 animate-[ping_3s_cubic-bezier(0,0,0.2,1)_infinite]"
        style={{ "--b": base }}
      />
      {isCine && (
        <div
          className="absolute w-28 h-28 border border-[var(--a)] rounded-full opacity-10 animate-[ping_3s_infinite]"
          style={{ "--a": accent, animationDelay: "0.5s" }}
        />
      )}
      {/* Speckles */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            backgroundColor:
              i % 4 === 0
                ? "#ffffff"
                : isCine
                ? i % 2 === 0
                  ? accent
                  : base
                : base,
            width: i % 2 === 0 ? "3px" : "2px",
            height: i % 2 === 0 ? "3px" : "2px",
            top: `${Math.random() * 80 + 10}%`,
            left: `${Math.random() * 80 + 10}%`,
            animation: `speckleFloat ${
              Math.random() * 3 + 2
            }s ease-in-out infinite`,
            animationDelay: `${Math.random()}s`,
            boxShadow: `0 0 5px ${base}`,
          }}
        />
      ))}
    </div>
  );
}

// 2. DUAL: Romance Rising (Hearts + Soft Fade)
function DualVector({ base, accent, isCine }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center animate-fade-in overflow-hidden">
      <div
        className="absolute bottom-0 left-0 right-0 h-3/4 opacity-30"
        style={{ background: `linear-gradient(to top, ${base}, transparent)` }}
      />
      {/* Floating Hearts only */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute text-[var(--c)]"
          style={{
            "--c": isCine ? accent : base,
            left: `${15 + i * 15}%`,
            bottom: "-20px",
            animation: `floatUp ${3 + Math.random()}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: 0.6,
          }}
        >
          <Heart
            size={12 + Math.random() * 10}
            fill="currentColor"
            stroke="none"
          />
        </div>
      ))}
    </div>
  );
}

// 3. DUET: Digital Fire (Squares + Red/Orange or Red/Violet)
function DuetVector({ base, accent, isCine }) {
  const RED = "#dc2626";
  return (
    <div className="relative w-full h-full flex items-center justify-center animate-fade-in overflow-hidden">
      <div
        className="absolute bottom-0 w-full h-3/4 opacity-40"
        style={{
          background: `linear-gradient(to top, ${base}40, transparent)`,
        }}
      />
      {/* Rising Squares only */}
      {[...Array(15)].map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${5 + Math.random() * 90}%`,
            bottom: "-20px",
            animation: `riseFast ${0.6 + Math.random()}s linear infinite`,
            animationDelay: `${Math.random()}s`,
            opacity: 0.9,
          }}
        >
          <div
            className="w-2 h-2"
            style={{
              backgroundColor: i % 2 === 0 ? RED : isCine ? accent : base,
              boxShadow: `0 0 10px ${isCine ? accent : base}`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// 4. MULTI: Warp Speed (Galactic Lines)
function MultiVector({ base, accent, isCine }) {
  return (
    <div className="relative w-full h-full flex items-center justify-center animate-fade-in overflow-hidden">
      <div
        className="absolute bottom-0 w-full h-full opacity-10"
        style={{ background: `linear-gradient(to top, ${base}, transparent)` }}
      />
      {/* Warp Lines only */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-[2px] bg-gradient-to-t from-transparent via-[var(--c)] to-transparent"
          style={{
            "--c": isCine ? accent : base,
            height: `${40 + Math.random() * 60}%`,
            left: `${Math.random() * 100}%`,
            bottom: "-100%",
            animation: `shootUp ${0.5 + Math.random() * 0.8}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
            opacity: Math.random() * 0.5 + 0.3,
          }}
        />
      ))}
    </div>
  );
}
