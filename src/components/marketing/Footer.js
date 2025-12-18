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
import { useTheme } from "../ui/ThemeContext";

export default function Footer() {
  const { activeStyles, isCinematic, theme, baseColor, activeColor } =
    useTheme();

  // Logic match for Navbar
  const shimmerClass = activeStyles?.shimmer || "text-shimmer-gold";
  const brandingColor = baseColor || "#d4af37"; // For non-shimmer states
  const accentColor = activeColor || "#d4af37"; // For glows/icons
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#020010] border-t border-white/5 overflow-hidden transition-colors duration-1000">
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
          <div className="md:col-span-5 flex flex-col text-center md:text-left space-y-6">
            {/* 🟢 FIXED: MIRRORS NAVBAR LOGO LOGIC */}
            <h2
              className={`text-3xl font-serif tracking-tight transition-colors duration-500
                ${isCinematic ? shimmerClass : ""}`}
              style={{ color: !isCinematic ? brandingColor : undefined }}
            >
              CineSonic&trade;
            </h2>

            <div className="space-y-4 text-white/50 text-sm font-light leading-relaxed max-w-md mx-auto md:mx-0">
              <p>
                Producing auditory cinema of the highest caliber, shaped by
                professional talent.
              </p>
              <p>
                <span
                  className="italic text-white transition-colors duration-1000"
                  style={{ textShadow: `0 0 10px ${brandingColor}40` }}
                >
                  Pioneering premier education
                </span>
                —guiding the next generation of storytellers.
              </p>
            </div>

            <div className="flex justify-center md:justify-start gap-4 pt-4">
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

          <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8 md:gap-4 text-center md:text-left">
            <div className="flex flex-col gap-6">
              <h5
                className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60"
                style={{ color: brandingColor }}
              >
                Production
              </h5>
              <ul className="flex flex-col gap-3">
                <FooterLink
                  href="/solo-audiobook-production"
                  color={accentColor}
                >
                  Solo Narration
                </FooterLink>
                <FooterLink
                  href="/dual-audiobook-production"
                  color={accentColor}
                >
                  Dual Narration
                </FooterLink>
                <FooterLink
                  href="/duet-audiobook-production"
                  color={accentColor}
                >
                  Duet Narration
                </FooterLink>
                <FooterLink
                  href="/multicast-audiobook-production"
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
                Studio
              </h5>
              <ul className="flex flex-col gap-3">
                <FooterLink href="/roster" color={accentColor}>
                  Casting Call
                </FooterLink>
                <FooterLink href="/blog" color={accentColor}>
                  Journal
                </FooterLink>
                <FooterLink href="/dashboard" highlight color={accentColor}>
                  Production Hub
                </FooterLink>
              </ul>
            </div>

            <div className="col-span-2 md:col-span-1 flex flex-col gap-6 items-center md:items-start pt-8 border-t border-white/5 md:border-none">
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
