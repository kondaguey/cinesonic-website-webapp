"use client";

import React, { useState } from "react";
import {
  Mail,
  Check,
  Loader2,
  ArrowRight,
  ShieldCheck,
  ShoppingBag,
  GraduationCap,
  Zap,
} from "lucide-react";
import { useTheme } from "../../../components/ui/ThemeContext";
import { subscribeToWaitlist } from "../../../actions/subscribeActions";

export default function NewsletterPage() {
  const { theme, activeStyles } = useTheme();
  const activeColor = activeStyles?.color || "#d4af37";

  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  // 🟢 INTERESTS STATE
  const [interests, setInterests] = useState({
    general: true, // Default to true
    shop: false,
    academy: false,
  });

  const toggleInterest = (key) => {
    setInterests((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();

    // Validate at least one selection
    if (!Object.values(interests).some(Boolean)) {
      setStatus("error");
      setMessage("Please select at least one frequency.");
      return;
    }

    setStatus("loading");

    try {
      // 🟢 MULTI-FIRE STRATEGY
      // We loop through selected interests and fire the action for each.
      // This creates multiple rows in Supabase (segmentation) without changing backend code.
      const promises = [];

      if (interests.general) {
        const fd = new FormData();
        fd.append("email", email);
        fd.append("source", "footer_newsletter"); // General tag
        promises.push(subscribeToWaitlist(fd));
      }

      if (interests.shop) {
        const fd = new FormData();
        fd.append("email", email);
        fd.append("source", "shop_waitlist");
        promises.push(subscribeToWaitlist(fd));
      }

      if (interests.academy) {
        const fd = new FormData();
        fd.append("email", email);
        fd.append("source", "academy_waitlist");
        promises.push(subscribeToWaitlist(fd));
      }

      await Promise.all(promises);

      setStatus("success");
      setMessage("Frequencies tuned. Welcome to the network.");
      setEmail("");
    } catch (err) {
      console.error(err);
      setStatus("error");
      setMessage("Transmission error. Please try again.");
    } finally {
      if (status !== "success") setTimeout(() => setStatus("idle"), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-[#020010] text-white flex flex-col items-center justify-center relative overflow-hidden px-6 py-20">
      {/* ATMOSPHERE */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-10 transition-colors duration-1000"
          style={{ backgroundColor: `${activeColor}15` }}
        />
      </div>

      <main className="relative z-10 w-full max-w-lg mx-auto">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4">
            Join the <span style={{ color: activeColor }}>Frequency</span>
          </h1>
          <p className="text-gray-400 text-lg font-light">
            Curate your CineSonic experience. Select the updates that matter to
            you.
          </p>
        </div>

        <form onSubmit={handleSubscribe} className="space-y-8">
          {/* 🟢 PREFERENCE CARDS */}
          <div className="space-y-3">
            {/* 1. GENERAL / BLOG */}
            <InterestCard
              label="Intel & Advice"
              description="Blog posts, industry news, and general updates."
              icon={<ShieldCheck size={20} />}
              isSelected={interests.general}
              onClick={() => toggleInterest("general")}
              activeColor={activeColor}
            />

            {/* 2. SHOP */}
            <InterestCard
              label="Gear & Originals"
              description="New drops, SFX libraries, and limited apparel."
              icon={<ShoppingBag size={20} />}
              isSelected={interests.shop}
              onClick={() => toggleInterest("shop")}
              activeColor={activeColor}
            />

            {/* 3. ACADEMY */}
            <InterestCard
              label="Academy & Training"
              description="Course enrollments, workshops, and coaching tips."
              icon={<GraduationCap size={20} />}
              isSelected={interests.academy}
              onClick={() => toggleInterest("academy")}
              activeColor={activeColor}
            />
          </div>

          {/* EMAIL INPUT */}
          <div className="relative group">
            <div
              className="absolute -inset-0.5 rounded-lg opacity-30 blur group-hover:opacity-60 transition duration-500"
              style={{ backgroundColor: activeColor }}
            />
            <div className="relative bg-[#0a0a0a] rounded-lg border border-white/10 flex items-center p-1">
              <div className="pl-3 text-gray-500">
                <Mail size={20} />
              </div>
              <input
                type="email"
                required
                placeholder="Enter your email frequency..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={status === "loading" || status === "success"}
                className="flex-1 bg-transparent border-none focus:ring-0 text-white px-4 py-3 placeholder-gray-600 focus:outline-none"
              />
              <button
                disabled={status === "loading" || status === "success"}
                className="px-6 py-3 rounded-md text-black font-bold uppercase tracking-widest text-xs transition-transform duration-300 hover:scale-[1.02] flex items-center gap-2 disabled:opacity-70"
                style={{ backgroundColor: activeColor }}
              >
                {status === "loading" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : status === "success" ? (
                  <Check size={16} />
                ) : (
                  <>
                    <span>Subscribe</span> <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* FEEDBACK MESSAGES */}
          <div className="h-6 text-center">
            {status === "error" && (
              <p className="text-red-500 text-sm font-mono">{message}</p>
            )}
            {status === "success" && (
              <p className="text-green-500 text-sm font-mono flex items-center justify-center gap-2">
                <Check size={14} /> {message}
              </p>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}

// --- SUBCOMPONENT: SELECTION CARD ---
function InterestCard({
  label,
  description,
  icon,
  isSelected,
  onClick,
  activeColor,
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer group relative p-4 rounded-xl border transition-all duration-300 flex items-start gap-4
                ${
                  isSelected
                    ? "bg-white/5 border-opacity-100"
                    : "bg-transparent border-white/10 hover:border-white/20 hover:bg-white/[0.02]"
                }`}
      style={{ borderColor: isSelected ? activeColor : undefined }}
    >
      {/* Checkbox Icon */}
      <div
        className={`mt-1 w-5 h-5 rounded border flex items-center justify-center transition-all duration-300
                    ${
                      isSelected
                        ? "text-black border-transparent"
                        : "border-gray-600 text-transparent"
                    }`}
        style={{ backgroundColor: isSelected ? activeColor : "transparent" }}
      >
        <Check size={12} strokeWidth={4} />
      </div>

      {/* Text Content */}
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={
              isSelected
                ? "text-white"
                : "text-gray-400 group-hover:text-gray-200"
            }
          >
            {icon}
          </span>
          <h3
            className={`text-sm font-bold uppercase tracking-wider ${
              isSelected ? "text-white" : "text-gray-300"
            }`}
          >
            {label}
          </h3>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>

      {/* Glow Effect on Select */}
      {isSelected && (
        <div
          className="absolute inset-0 rounded-xl opacity-10 pointer-events-none"
          style={{ backgroundColor: activeColor }}
        />
      )}
    </div>
  );
}
