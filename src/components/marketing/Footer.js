"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { useTheme } from "../ui/ThemeContext";
import { subscribeToWaitlist } from "../../actions/subscribeActions";

export default function Footer() {
  const { activeStyles, isCinematic, theme, baseColor, activeColor } =
    useTheme();

  // Logic match for Navbar
  const shimmerClass = activeStyles?.shimmer || "text-shimmer-gold";
  const brandingColor = baseColor || "#d4af37";
  const accentColor = activeColor || "#d4af37";
  const currentYear = new Date().getFullYear();

  // NEWSLETTER STATE
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setStatus("loading");

    const formData = new FormData();
    formData.append("email", email);
    formData.append("source", "footer_newsletter");

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

  return (
    <footer className="relative bg-[#020010] border-t border-white/5 overflow-hidden transition-colors duration-1000">
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />
        <div
          className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[80vw] h-[400px] blur-[100px] opacity-30 transition-all duration-1000"
          style={{
            background: `linear-gradient(to top, ${accentColor}33, ${accentColor}1a, transparent)`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">
          {/* LEFT COLUMN: BRAND + ROBUST COPY + NEWSLETTER */}
          <div className="md:col-span-5 flex flex-col text-center md:text-left space-y-8">
            {/* LOGO */}
            <h2
              className={`text-3xl font-serif tracking-tight transition-colors duration-500 ${
                isCinematic ? shimmerClass : ""
              }`}
              style={{ color: !isCinematic ? brandingColor : undefined }}
            >
              CineSonic&trade;
            </h2>

            {/* ROBUST COPY SECTION */}
            <div className="space-y-4 text-white/50 text-sm font-light leading-relaxed max-w-md mx-auto md:mx-0">
              <p>
                Producing auditory cinema of the highest caliber. We bridge the
                gap between independent visionaries and Hollywood-grade talent,
                crafting immersive soundscapes that transcend the medium.
              </p>
              <p>
                <span
                  className="italic text-white transition-colors duration-1000 font-medium"
                  style={{ textShadow: `0 0 15px ${brandingColor}50` }}
                >
                  Pioneering premier education
                </span>
                —guiding the next generation of storytellers through the
                Academy, while equipping artists with elite tools from our
                curated Originals store.
              </p>
            </div>

            {/* NEWSLETTER INPUT */}
            <div className="max-w-sm mx-auto md:mx-0 w-full pt-2">
              <form onSubmit={handleSubscribe} className="relative">
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 text-white/30" size={16} />
                  <input
                    type="email"
                    placeholder={
                      status === "success"
                        ? "Welcome to the inner circle."
                        : "Join the network..."
                    }
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={status === "loading" || status === "success"}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-12 text-sm text-white focus:outline-none focus:border-[var(--c)] transition-colors placeholder:text-gray-600 disabled:opacity-50"
                    style={{ "--c": accentColor }}
                  />

                  <button
                    disabled={status === "loading" || status === "success"}
                    className="absolute right-2 p-1.5 text-black rounded hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{ backgroundColor: accentColor }}
                  >
                    {status === "loading" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : status === "success" ? (
                      <Check size={14} />
                    ) : (
                      <ArrowRight size={14} />
                    )}
                  </button>
                </div>

                {/* FEEDBACK MESSAGES */}
                {status === "error" && (
                  <p className="text-red-500 text-[10px] mt-2 ml-1 text-left">
                    {message}
                  </p>
                )}
                {status === "success" && (
                  <p className="text-green-500 text-[10px] mt-2 ml-1 text-left flex items-center gap-1">
                    <Check size={10} /> {message}
                  </p>
                )}
              </form>
            </div>

            {/* SOCIAL ICONS */}
            <div className="flex justify-center md:justify-start gap-4 pt-2">
              <SocialIcon
                href="#"
                icon={<Instagram size={16} />}
                color={accentColor}
              />
              <SocialIcon
                href="#"
                icon={<Twitter size={16} />}
                color={accentColor}
              />
              <SocialIcon
                href="#"
                icon={<Youtube size={16} />}
                color={accentColor}
              />
              <SocialIcon
                href="#"
                icon={<Linkedin size={16} />}
                color={accentColor}
              />
            </div>
          </div>

          {/* RIGHT COLUMN: LINKS */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 text-center md:text-left">
            <div className="flex flex-col gap-6">
              <h5
                className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60"
                style={{ color: brandingColor }}
              >
                Production
              </h5>
              <ul className="flex flex-col gap-3">
                <FooterLink href="/solo-audio-production" color={accentColor}>
                  Solo Narration
                </FooterLink>
                <FooterLink href="/dual-audio-production" color={accentColor}>
                  Dual Narration
                </FooterLink>
                <FooterLink href="/duet-audio-production" color={accentColor}>
                  Duet Narration
                </FooterLink>
                <FooterLink
                  href="/multicast-audio-production"
                  color={accentColor}
                >
                  Full-Cast Audio
                </FooterLink>
              </ul>
            </div>

            <div className="flex flex-col gap-6">
              <h5
                className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60"
                style={{ color: brandingColor }}
              >
                Ecosystem
              </h5>
              <ul className="flex flex-col gap-3">
                <FooterLink href="/roster" color={accentColor}>
                  Casting Roster
                </FooterLink>
                <FooterLink href="/cinesonic-shop" color={accentColor}>
                  Shop Originals
                </FooterLink>
                <FooterLink href="/cinesonic-academy" color={accentColor}>
                  Academy
                </FooterLink>
                <FooterLink href="/hub" highlight color={accentColor}>
                  Production Hub
                </FooterLink>
              </ul>
            </div>

            {/* 🟢 FIXED ALIGNMENT: Added `md:pt-0` to remove padding on desktop */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-6 items-center md:items-start pt-8 md:pt-0 border-t border-white/5 md:border-none">
              <h5
                className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60"
                style={{ color: brandingColor }}
              >
                Inquiries
              </h5>
              <a
                href="mailto:casting@cinesonic.com"
                className="group flex items-center gap-2 text-xs text-white/50"
              >
                <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Mail size={14} style={{ color: accentColor }} />
                </div>
                <span className="group-hover:text-white transition-colors">
                  Contact Casting
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-white/30 font-mono uppercase tracking-widest">
          <span>&copy; {currentYear} CineSonic Productions.</span>
          <div className="flex gap-4">
            <Link
              href="/legal/privacy-policy"
              className="hover:text-white transition-colors"
            >
              Privacy
            </Link>
            <Link
              href="/legal/terms-and-conditions"
              className="hover:text-white transition-colors"
            >
              Terms
            </Link>
          </div>
          <span
            style={{ color: accentColor }}
            className="transition-colors duration-1000"
          >
            SYSTEM STATUS: ONLINE
          </span>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ href, children, highlight = false, color }) {
  return (
    <li>
      <Link
        href={href}
        className={`text-xs tracking-wide transition-all duration-300 inline-block hover:translate-x-1 ${
          highlight ? "font-bold" : "text-white/40 hover:text-white"
        }`}
        style={{ color: highlight ? color : undefined }}
      >
        {children}
      </Link>
    </li>
  );
}

function SocialIcon({ href, icon, color }) {
  return (
    <a
      href={href}
      className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/40 transition-all hover:scale-110"
      onMouseEnter={(e) => {
        e.currentTarget.style.color = color;
        e.currentTarget.style.borderColor = `${color}40`;
        e.currentTarget.style.backgroundColor = `${color}10`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.color = "";
        e.currentTarget.style.borderColor = "";
        e.currentTarget.style.backgroundColor = "";
      }}
    >
      {icon}
    </a>
  );
}
