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

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#030303] border-t border-white/5 overflow-hidden">
      {/* --- ATMOSPHERE FX --- */}
      <div className="absolute inset-0 pointer-events-none select-none">
        {/* Grain Texture */}
        <div className="absolute inset-0 opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay" />

        {/* Bottom Glow (Golden Hour) */}
        <div className="absolute bottom-[-100px] left-1/2 -translate-x-1/2 w-[80vw] h-[300px] bg-gradient-to-t from-[#d4af37]/10 via-[#d4af37]/5 to-transparent blur-[80px] opacity-40" />
      </div>

      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 relative z-10">
        {/* === TOP SECTION: GRID LAYOUT === */}
        {/* Mobile: Stacked, Tablet: 2 Col, Desktop: 12 Col Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 mb-16">
          {/* 1. NARRATIVE COLUMN (Brand) */}
          <div className="md:col-span-5 flex flex-col text-center md:text-left">
            <h2 className="text-2xl font-serif text-white tracking-tight mb-6">
              CineSonic<span className="text-[#d4af37]">.</span>
            </h2>

            <div className="space-y-4 text-white/40 text-xs md:text-sm font-light leading-relaxed max-w-md mx-auto md:mx-0">
              <p>
                CineSonic Audiobooks creates literary audio of the highest
                caliber. We cast from a "professional actor first" mindset,
                ensuring every performance is shaped by expressive talent.
              </p>
              <p>
                Extending our commitment, we are{" "}
                <span className="text-white/70 italic">
                  pioneering premier education
                </span>
                —empowering authors to narrate their own works and guiding
                aspiring voices to break into the industry.
              </p>
            </div>

            {/* Socials - Compact Row */}
            <div className="flex justify-center md:justify-start gap-3 mt-8">
              <SocialIcon
                href="https://instagram.com"
                icon={<Instagram size={14} />}
              />
              <SocialIcon
                href="https://twitter.com"
                icon={<Twitter size={14} />}
              />
              <SocialIcon
                href="https://youtube.com"
                icon={<Youtube size={14} />}
              />
              <SocialIcon
                href="https://linkedin.com"
                icon={<Linkedin size={14} />}
              />
            </div>
          </div>

          {/* 2. NAVIGATION GRID (Compacted for Mobile) */}
          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 text-center md:text-left">
            {/* Services */}
            <div className="flex flex-col gap-4">
              <h5 className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                Production
              </h5>
              <ul className="flex flex-col gap-2">
                <FooterLink href="/solo-audiobook-production">
                  Solo Narration
                </FooterLink>
                <FooterLink href="/dual-audiobook-production">
                  Dual Narration
                </FooterLink>
                <FooterLink href="/duet-audiobook-production">
                  Duet Narration
                </FooterLink>
                <FooterLink href="/multicast-audiobook-production">
                  Full-Cast Audio
                </FooterLink>
              </ul>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-4">
              <h5 className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                Studio
              </h5>
              <ul className="flex flex-col gap-2">
                <FooterLink href="/about-us">Our Process</FooterLink>
                <FooterLink href="/talent-submissions">Casting Call</FooterLink>
                <FooterLink href="/blog">Journal</FooterLink>
                <FooterLink href="/faq">The Archives</FooterLink>
                <FooterLink href="/dashboard" highlight>
                  Production Hub
                </FooterLink>
              </ul>
            </div>

            {/* Contact - Spans 2 cols on mobile to save vertical space, 1 on desktop */}
            <div className="col-span-2 md:col-span-1 flex flex-col gap-4 items-center md:items-start pt-4 md:pt-0 border-t border-white/5 md:border-none">
              <h5 className="text-[#d4af37] text-[10px] font-bold uppercase tracking-[0.2em] opacity-80">
                Inquiries
              </h5>
              <ul className="flex flex-col gap-3">
                <li>
                  <a
                    href="mailto:casting@cinesonicaudiobooks.com"
                    className="group flex items-center gap-2 text-xs text-white/50 hover:text-white transition-colors duration-300"
                  >
                    <Mail size={12} className="text-[#d4af37]" />
                    <span>casting@cinesonicaudiobooks.com</span>
                  </a>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="group inline-flex items-center gap-1 text-xs text-white/50 hover:text-white transition-colors duration-300"
                  >
                    <span>Start a Project</span>
                    <ArrowUpRight
                      size={12}
                      className="opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all"
                    />
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* === DIVIDER === */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* === BOTTOM BAR === */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[10px] text-white/30 font-light tracking-wide">
          {/* Copyright & Legal */}
          <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-center md:text-left">
            <span>
              &copy; {currentYear} CineSonic Audiobooks. All rights reserved.
            </span>
            <span className="hidden md:inline text-white/10">|</span>
            <div className="flex gap-4">
              <LegalLink href="/privacy">Privacy</LegalLink>
              <LegalLink href="/terms">Terms</LegalLink>
              <LegalLink href="/cookies">Cookies</LegalLink>
            </div>
          </div>

          {/* Trademarks & Tech */}
          <div className="flex flex-col items-center md:items-end gap-1">
            <span className="opacity-60">
              CineSonic&trade; and "Production Intelligence"&trade; are
              trademarks.
            </span>
            <span className="font-mono text-[9px] text-[#d4af37]/40 tracking-wider">
              SYSTEM SECURE // VER 1.0.4 // RLS ENABLED
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

function FooterLink({ href, children, highlight = false }) {
  return (
    <li>
      <Link
        href={href}
        className={`text-xs tracking-wide transition-all duration-300 inline-block hover:translate-x-1 ${
          highlight
            ? "text-[#d4af37] font-medium"
            : "text-white/40 hover:text-white"
        }`}
      >
        {children}
      </Link>
    </li>
  );
}

function LegalLink({ href, children }) {
  return (
    <Link href={href} className="hover:text-white transition-colors">
      {children}
    </Link>
  );
}

function SocialIcon({ href, icon }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-8 h-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center text-white/40 hover:text-[#d4af37] hover:border-[#d4af37]/30 hover:bg-[#d4af37]/5 transition-all duration-300"
    >
      {icon}
    </a>
  );
}
