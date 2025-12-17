"use client";
import React from "react";
import Link from "next/link";
import {
  Instagram,
  Twitter,
  Linkedin,
  Youtube,
  Mail,
  ArrowUpRight,
} from "lucide-react";

export default function Footer({ theme = "gold" }) {
  // 1. LOCAL COLOR MAP
  const themeConfig = {
    gold: { hex: "#d4af37" },
    silver: { hex: "#c0c0c0" },
    pink: { hex: "#ff3399" },
    fire: { hex: "#ff4500" },
    cyan: { hex: "#00f0ff" },
    system: { hex: "#3b82f6" },
  };

  const activeTheme = themeConfig[theme] || themeConfig.gold;
  const color = activeTheme.hex;
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#020010] border-t border-white/5 overflow-hidden">
      {/* --- ATMOSPHERE FX --- */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        {/* Bottom Glow (Golden Hour) - Dynamic Color */}
        <div
          className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[80vw] h-[400px] blur-[100px] opacity-30 transition-colors duration-1000"
          style={{
            background: `linear-gradient(to top, ${color}33, ${color}1a, transparent)`,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-20 pb-10 relative z-10">
        {/* === TOP SECTION: GRID LAYOUT === */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-20">
          {/* 1. NARRATIVE COLUMN (Brand) */}
          <div className="md:col-span-5 flex flex-col text-center md:text-left space-y-6">
            <h2 className="text-3xl font-serif text-white tracking-tight">
              CineSonic&trade;
            </h2>

            <div className="space-y-4 text-white/50 text-sm font-light leading-relaxed max-w-md mx-auto md:mx-0">
              <p>
                CineSonic Audiobooks creates literary audio of the highest
                caliber. We cast from a "professional actor first" mindset,
                ensuring every performance is shaped by expressive talent.
              </p>
              <p>
                Extending our commitment, we are{" "}
                <span
                  className="italic text-white"
                  style={{ textShadow: `0 0 10px ${color}40` }}
                >
                  pioneering premier education
                </span>
                —empowering authors to narrate their own works and guiding
                aspiring voices to break into the industry.
              </p>
            </div>

            {/* Socials - Compact Row */}
            <div className="flex justify-center md:justify-start gap-4 pt-4">
              <SocialIcon
                href="https://instagram.com"
                icon={<Instagram size={16} />}
                color={color}
              />
              <SocialIcon
                href="https://twitter.com"
                icon={<Twitter size={16} />}
                color={color}
              />
              <SocialIcon
                href="https://youtube.com"
                icon={<Youtube size={16} />}
                color={color}
              />
              <SocialIcon
                href="https://linkedin.com"
                icon={<Linkedin size={16} />}
                color={color}
              />
            </div>
          </div>

          {/* 2. NAVIGATION GRID */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 text-center md:text-left">
            {/* Services */}
            <div className="flex flex-col gap-6">
              <h5
                className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60"
                style={{ color: color }}
              >
                Production
              </h5>
              <ul className="flex flex-col gap-3">
                <FooterLink href="/solo" color={color}>
                  Solo Narration
                </FooterLink>
                <FooterLink href="/dual" color={color}>
                  Dual Narration
                </FooterLink>
                <FooterLink href="/duet" color={color}>
                  Duet Narration
                </FooterLink>
                <FooterLink href="/multicast" color={color}>
                  Full-Cast Audio
                </FooterLink>
              </ul>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-6">
              <h5
                className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60"
                style={{ color: color }}
              >
                Studio
              </h5>
              <ul className="flex flex-col gap-3">
                <FooterLink href="/about" color={color}>
                  Our Process
                </FooterLink>
                <FooterLink href="/casting" color={color}>
                  Casting Call
                </FooterLink>
                <FooterLink href="/blog" color={color}>
                  Journal
                </FooterLink>
                <FooterLink href="/faq" color={color}>
                  The Archives
                </FooterLink>
                <FooterLink href="/dashboard" highlight color={color}>
                  Production Hub
                </FooterLink>
              </ul>
            </div>

            {/* Contact */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-6 items-center md:items-start pt-8 md:pt-0 border-t border-white/5 md:border-none">
              <h5
                className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60"
                style={{ color: color }}
              >
                Inquiries
              </h5>
              <ul className="flex flex-col gap-4">
                <li>
                  <a
                    href="mailto:casting@cinesonicaudiobooks.com"
                    className="group flex items-center gap-2 text-xs text-white/50 transition-colors duration-300"
                  >
                    <div className="p-1.5 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                      <Mail size={14} style={{ color: color }} />
                    </div>
                    <span className="group-hover:text-white transition-colors">
                      casting@cinesonic...
                    </span>
                  </a>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors duration-300"
                  >
                    <span>Start a Project</span>
                    <ArrowUpRight
                      size={14}
                      className="opacity-50 -translate-y-0.5 translate-x-0 group-hover:translate-x-0.5 group-hover:-translate-y-1 group-hover:opacity-100 transition-all"
                      style={{ color: color }}
                    />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* === DIVIDER === */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-6" />

        {/* === STRONG TRADEMARK LEGALESE (NEW) === */}
        <div className="mb-6 text-center md:text-left">
          <p className="text-[10px] text-white/30 font-mono uppercase tracking-widest leading-relaxed">
            CineSonic™ and the CineSonic Logo are trademarks of CineSonic
            Audiobooks. <br className="md:hidden" /> All rights reserved.
          </p>
        </div>

        {/* === BOTTOM BAR === */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-white/30 font-light tracking-wide">
          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-left">
            <span>&copy; {currentYear} CineSonic Audiobooks.</span>
            <span className="hidden md:inline text-white/10">|</span>
            <div className="flex gap-6">
              <LegalLink href="/privacy">Privacy</LegalLink>
              <LegalLink href="/terms">Terms</LegalLink>
              <LegalLink href="/cookies">Cookies</LegalLink>
            </div>
          </div>

          {/* System Status */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <span className="text-[10px] uppercase tracking-wider opacity-60">
              Secure Connection
            </span>
            <span
              className="font-mono text-[9px] tracking-widest opacity-50"
              style={{ color: color }}
            >
              SYSTEM STATUS: ONLINE
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ----------------------------------------
// SUB-COMPONENTS
// ----------------------------------------

function FooterLink({ href, children, highlight = false, color }) {
  const [hover, setHover] = React.useState(false);

  return (
    <li>
      <Link
        href={href}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className={`text-xs tracking-wide transition-all duration-300 inline-block hover:translate-x-1
          ${highlight ? "font-bold" : "font-normal"}`}
        style={{
          color: highlight ? color : hover ? "white" : "rgba(255,255,255,0.4)",
        }}
      >
        {children}
      </Link>
    </li>
  );
}

function LegalLink({ href, children }) {
  return (
    <Link
      href={href}
      className="hover:text-white transition-colors duration-300"
    >
      {children}
    </Link>
  );
}

function SocialIcon({ href, icon, color }) {
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="w-10 h-10 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/40 transition-all duration-300 hover:scale-110"
      style={{
        color: isHovered ? color : undefined,
        borderColor: isHovered ? `${color}40` : "rgba(255,255,255,0.05)",
        backgroundColor: isHovered ? `${color}10` : "rgba(255,255,255,0.03)",
        boxShadow: isHovered ? `0 0 15px ${color}20` : "none",
      }}
    >
      {icon}
    </a>
  );
}
