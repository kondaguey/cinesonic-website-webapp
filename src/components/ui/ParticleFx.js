"use client";

import React, { useEffect, useRef } from "react";
import { useTheme } from "./ThemeContext";

export default function ParticleFx() {
  const canvasRef = useRef(null);
  const { theme, isCinematic } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // --- 1. PERFORMANCE & COLORS ---
    const COLORS = {
      gold: "#d4af37",
      pink: "#ff3399",
      fire: "#ff4500",
      cyan: "#00f0ff",
      silver: "#c0c0c0",
      system: "#3b82f6",
      violet: "#7c3aed",
    };

    const baseColor = COLORS[theme] || COLORS.gold;

    // REDUCE COUNT: 50 is plenty with the new "Lighter" blend mode
    const particleCount = isCinematic ? 60 : 30;

    class Particle {
      constructor() {
        this.reset(true);
      }

      reset(initial = false) {
        this.x = Math.random() * canvas.width;
        this.y = initial ? Math.random() * canvas.height : canvas.height + 10;

        // Cinematic = Faster/Wilder
        const speedMultiplier = isCinematic ? 2 : 0.8;

        this.speedY = (Math.random() * 0.8 + 0.2) * speedMultiplier;
        this.speedX = (Math.random() * 0.5 - 0.25) * speedMultiplier;

        // Bigger particles look better with "lighter" blend mode
        this.size = Math.random() * 4 + 1;

        // Cinematic Color Mixing
        const isViolet = isCinematic && Math.random() > 0.6;
        this.color = isViolet ? COLORS.violet : baseColor;

        this.opacity = Math.random() * 0.5 + 0.1;
        this.fadeSpeed = Math.random() * 0.003 + 0.001;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.opacity -= this.fadeSpeed;

        if (this.y < -10 || this.opacity <= 0) {
          this.reset();
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.hexToRgba(this.color, this.opacity);
        ctx.fill();

        // ❌ DELETED: ctx.shadowBlur (The Lag Killer)
      }

      hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
      }
    }

    const particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      // 1. Clear Screen
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 🟢 2. THE SECRET SAUCE: "lighter" Blend Mode
      // This makes particles GLOW when they overlap without using CPU shadows
      ctx.globalCompositeOperation = "lighter";

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      // ❌ DELETED: The Canvas Vignette Loop (CSS handles this now)

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, isCinematic]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 transition-opacity duration-1000"
      // Slightly lower opacity because "lighter" mode is very bright
      style={{ opacity: isCinematic ? 0.6 : 0.3 }}
    />
  );
}
