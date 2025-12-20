"use client";

import React, { useState } from "react";
import {
  Sparkles,
  ArrowRight,
  Mail,
  Check,
  Loader2,
  GraduationCap,
} from "lucide-react";
import { useTheme } from "../../../components/ui/ThemeContext";
import { subscribeToWaitlist } from "../../../actions/subscribeActions"; // 🟢 Importing the generic action

export default function AcademyPage() {
  const { theme, isCinematic } = useTheme();

  // FORM STATE
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("source", "academy_waitlist"); // 🟢 TAGGING SOURCE

    const result = await subscribeToWaitlist(formData);

    if (result.success) {
      setStatus("success");
      setMessage(result.message);
      setEmail("");
    } else {
      setStatus("error");
      setMessage(result.message);
      setTimeout(() => setStatus("idle"), 3000);
    }
  };

  // 🟢 1. THE ALLOY MAP (Reused for Consistency)
  const THEME_CONFIG = {
    gold: {
      base: {
        hex: "#d4af37",
        gradient: "linear-gradient(135deg, #d4af37 0%, #f3e5ab 100%)",
      },
      cine: {
        hex: "#a67c92",
        gradient: "linear-gradient(135deg, #d4af37 0%, #7c3aed 100%)",
      },
    },
    pink: {
      base: {
        hex: "#ff3399",
        gradient: "linear-gradient(135deg, #ff3399 0%, #ff9ec6 100%)",
      },
      cine: {
        hex: "#be36c3",
        gradient: "linear-gradient(135deg, #ff3399 0%, #7c3aed 100%)",
      },
    },
    fire: {
      base: {
        hex: "#ff4500",
        gradient: "linear-gradient(135deg, #ff4500 0%, #ffae42 100%)",
      },
      cine: {
        hex: "#be4077",
        gradient: "linear-gradient(135deg, #ff4500 0%, #7c3aed 100%)",
      },
    },
    cyan: {
      base: {
        hex: "#00f0ff",
        gradient: "linear-gradient(135deg, #00f0ff 0%, #50c878 100%)",
      },
      cine: {
        hex: "#3e95f6",
        gradient: "linear-gradient(135deg, #00f0ff 0%, #7c3aed 100%)",
      },
    },
    system: {
      base: {
        hex: "#3b82f6",
        gradient: "linear-gradient(135deg, #3b82f6 0%, #93c5fd 100%)",
      },
      cine: {
        hex: "#5c5ef2",
        gradient: "linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)",
      },
    },
    violet: {
      base: {
        hex: "#7c3aed",
        gradient: "linear-gradient(135deg, #7c3aed 0%, #d8b4fe 100%)",
      },
      cine: {
        hex: "#7c3aed",
        gradient: "linear-gradient(135deg, #7c3aed 0%, #4c1d95 100%)",
      },
    },
  };

  const config = THEME_CONFIG[theme] || THEME_CONFIG.gold;

  return (
    <div className="min-h-screen bg-[#020010] text-white flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6">
      {/* ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full blur-[100px] md:blur-[150px] opacity-10 transition-colors duration-1000"
          style={{ backgroundColor: config.base.hex }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] rounded-full blur-[100px] md:blur-[150px] opacity-10 transition-opacity duration-1000"
          style={{
            backgroundColor: "#7c3aed",
            opacity: isCinematic ? 0.4 : 0,
          }}
        />
      </div>

      <main className="relative z-10 w-full max-w-4xl mx-auto text-center">
        {/* BADGE (Ghost Layered) */}
        <div className="flex justify-center mb-8 md:mb-10">
          <div className="grid place-items-center">
            {/* Layer 1 */}
            <div
              className="col-start-1 row-start-1 inline-flex items-center gap-2 px-4 py-1.5 md:px-6 md:py-2 rounded-full border text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] animate-pulse transition-all duration-500 whitespace-nowrap"
              style={{
                backgroundColor: `${config.base.hex}10`,
                borderColor: `${config.base.hex}40`,
                color: config.base.hex,
              }}
            >
              <GraduationCap size={14} className="md:w-4 md:h-4" />
              <span>Enrollment Opens Fall, 2026</span>
            </div>
            {/* Layer 2 */}
            <div
              className={`col-start-1 row-start-1 inline-flex items-center gap-2 px-4 py-1.5 md:px-6 md:py-2 rounded-full border text-[10px] md:text-sm font-bold uppercase tracking-[0.2em] animate-pulse transition-opacity duration-500 whitespace-nowrap
                    ${isCinematic ? "opacity-100" : "opacity-0"}`}
              style={{
                backgroundColor: `rgba(124, 58, 237, 0.1)`,
                borderColor: config.cine.hex,
                color: config.cine.hex,
              }}
            >
              <GraduationCap size={14} className="md:w-4 md:h-4" />
              <span>Enrollment Opens Fall, 2026</span>
            </div>
          </div>
        </div>

        {/* HEADER (Ghost Layered) */}
        <div className="relative mb-6 md:mb-8 grid place-items-center">
          <h1
            className="col-start-1 row-start-1 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold leading-none tracking-tight text-transparent bg-clip-text transition-all duration-700"
            style={{
              backgroundImage: config.base.gradient,
              filter: `drop-shadow(0 0 30px ${config.base.hex}40)`,
            }}
          >
            CineSonic™ <br /> Masterclass
          </h1>
          <h1
            className={`col-start-1 row-start-1 text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-serif font-bold leading-none tracking-tight text-transparent bg-clip-text transition-opacity duration-700
                ${isCinematic ? "opacity-100" : "opacity-0"}`}
            style={{
              backgroundImage: config.cine.gradient,
              filter: `drop-shadow(0 0 30px #7c3aed60)`,
            }}
          >
            CineSonic™ <br /> Masterclass
          </h1>
        </div>

        <p className="max-w-xl mx-auto text-gray-400 text-base md:text-2xl font-light leading-relaxed mb-10 md:mb-12 px-4">
          Elite performance training for the next generation of voice actors.
          Master the art of cinematic audio storytelling.
        </p>

        {/* EMAIL CAPTURE */}
        <div className="max-w-[90vw] md:max-w-md mx-auto relative group">
          {/* Glow Behind */}
          <div
            className="absolute -inset-1 rounded-full opacity-25 blur transition duration-500 group-hover:opacity-50"
            style={{ backgroundColor: config.base.hex }}
          ></div>
          <div
            className={`absolute -inset-1 rounded-full opacity-25 blur transition duration-500 group-hover:opacity-50 ${
              isCinematic ? "opacity-100" : "opacity-0"
            }`}
            style={{ backgroundColor: "#7c3aed" }}
          ></div>

          <form
            className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-full p-1.5 md:p-2"
            onSubmit={handleSubmit}
          >
            <div className="pl-3 md:pl-4 text-gray-500">
              <Mail size={16} className="md:w-5 md:h-5" />
            </div>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                status === "success" ? message : "Email for priority access..."
              }
              disabled={status === "loading" || status === "success"}
              className="flex-1 bg-transparent border-none focus:ring-0 text-white px-3 md:px-4 py-2 text-xs md:text-base placeholder-gray-600 focus:outline-none min-w-0 disabled:opacity-50"
            />

            {/* BUTTON */}
            <div className="relative flex-shrink-0">
              {status === "success" ? (
                <div className="px-4 py-2 md:px-6 md:py-3 rounded-full bg-green-500/20 text-green-500 border border-green-500/50 flex items-center justify-center">
                  <Check size={16} />
                </div>
              ) : (
                <>
                  {/* Layer 1: Base */}
                  <button
                    disabled={status === "loading"}
                    className="px-4 py-2 md:px-6 md:py-3 rounded-full text-black font-bold uppercase tracking-widest text-[10px] md:text-xs transition-transform duration-300 hover:scale-105 flex items-center gap-2 disabled:opacity-80 disabled:cursor-not-allowed"
                    style={{ backgroundColor: config.base.hex }}
                  >
                    {status === "loading" ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <>
                        <span>Notify Me</span>{" "}
                        <ArrowRight size={12} className="md:w-3.5 md:h-3.5" />
                      </>
                    )}
                  </button>

                  {/* Layer 2: Cine */}
                  <button
                    disabled={status === "loading"}
                    className={`absolute inset-0 px-4 py-2 md:px-6 md:py-3 rounded-full text-white font-bold uppercase tracking-widest text-[10px] md:text-xs transition-opacity duration-500 flex items-center justify-center gap-2 pointer-events-none disabled:opacity-80
                            ${isCinematic ? "opacity-100" : "opacity-0"}`}
                    style={{ backgroundImage: config.cine.gradient }}
                  >
                    {status === "loading" ? (
                      <Loader2 size={12} className="animate-spin" />
                    ) : (
                      <>
                        <span>Notify Me</span>{" "}
                        <ArrowRight size={12} className="md:w-3.5 md:h-3.5" />
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          </form>

          {status === "error" && (
            <p className="absolute top-full left-0 right-0 text-center text-red-500 text-xs mt-2 font-mono">
              {message}
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
