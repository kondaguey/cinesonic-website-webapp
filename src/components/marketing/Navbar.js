"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Cinzel } from "next/font/google";
import { useTheme } from "../ui/ThemeContext";
import {
  Shield,
  ChevronDown,
  Menu,
  X,
  ChevronRight,
  Sparkles,
  ArrowRight,
  ShoppingBag,
  GraduationCap,
} from "lucide-react";

// FONT CONFIG
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

export default function Navbar() {
  // 🟢 GLOBAL STATE CONNECTION
  const { activeStyles, isCinematic, theme } = useTheme();

  // Active Color logic
  const activeColor = activeStyles?.color || "#d4af37";
  const baseColor =
    {
      gold: "#d4af37",
      pink: "#ff3399",
      fire: "#ff4500",
      cyan: "#00f0ff",
      system: "#3b82f6",
    }[theme] || "#d4af37";

  const shimmerClass = activeStyles?.shimmer || "text-shimmer-gold";
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav
        className="sticky top-0 left-0 right-0 h-20 md:h-24 lg:h-28 z-[10000] select-none transition-all duration-700 ease-out"
        style={{ "--theme-color": activeColor }}
      >
        {/* BACKGROUND */}
        <div className="absolute inset-0 bg-[#020010]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />
          <div
            className="absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-700 opacity-80"
            style={{
              background:
                activeStyles?.gradient ||
                `linear-gradient(90deg, transparent, ${activeColor}, transparent)`,
              boxShadow: `0 1px 15px ${activeColor}40`,
            }}
          />
        </div>

        <div className="max-w-[1800px] mx-auto px-4 md:px-6 h-full flex justify-between items-center relative z-10">
          {/* --- LEFT: LOGO (LAYERED FIX) --- */}
          <Link
            href="/"
            className="relative flex items-center group z-50 mr-2 lg:mr-4 xl:mr-8 flex-shrink-0 transition-opacity duration-300 hover:opacity-80"
          >
            {/* 🟢 LAYER 1: BASE LOGO (Standard Color) */}
            <h1
              className={`${cinzel.className} text-xl md:text-3xl lg:text-3xl xl:text-4xl font-bold tracking-wider drop-shadow-lg transition-colors duration-500 text-[var(--theme-color)]`}
            >
              CineSonic™
            </h1>

            {/* 🟢 LAYER 2: CINEMATIC OVERLAY (Shimmer) */}
            <h1
              className={`${
                cinzel.className
              } absolute inset-0 text-xl md:text-3xl lg:text-3xl xl:text-4xl font-bold tracking-wider drop-shadow-lg transition-opacity duration-500 pointer-events-none 
              ${shimmerClass} ${isCinematic ? "opacity-100" : "opacity-0"}`}
            >
              CineSonic™
            </h1>
          </Link>

          {/* --- CENTER: DESKTOP NAVIGATION --- */}
          {/* 🟢 UPDATED FOR CENTERING & RESPONSIVENESS:
              - justify-center: Centers the whole block between logo and right utilities.
              - gap-1 lg:gap-4 xl:gap-8: Tighter gaps on smaller laptops to prevent wrapping.
          */}
          <div className="hidden lg:flex items-center gap-1 lg:gap-4 xl:gap-8 flex-1 justify-center h-full">
            {/* START BUTTON */}
            <Link
              href="/projectform"
              className="h-full flex items-center justify-center text-center text-[10px] xl:text-xs font-extrabold tracking-[0.2em] uppercase border-b-2 border-transparent flex-shrink-0 transition-all duration-300 text-white hover:text-[var(--theme-color)] hover:border-[var(--theme-color)] hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] leading-tight px-2"
            >
              <span>
                Start Your
                <br />
                Project
              </span>
            </Link>

            {/* DROPDOWNS */}
            <DesktopDropdown
              title={
                <span className="text-center leading-tight">
                  Audiobook/Drama
                  <br />
                  Production Services
                </span>
              }
              color={activeColor}
              isCinematic={isCinematic}
              activeStyles={activeStyles}
            >
              <DropdownHeader label="Core Production" color={baseColor} />
              <DropdownItem
                href="/audio-production-services-overview"
                label="Production Services Overview"
                color={activeColor}
              />
              <DropdownItem
                href="/roster"
                label="Our Elite Talent"
                color={activeColor}
              />
              <GlowingDivider
                color={baseColor}
                activeStyles={activeStyles}
                isCinematic={isCinematic}
              />
              <DropdownHeader label="Production Tiers" color={baseColor} />
              <DropdownItem
                href="/solo-audio-production"
                label="Solo Audiobook/Drama Production"
                color={activeColor}
              />
              <DropdownItem
                href="/dual-audio-production"
                label="Dual Audiobook/Drama Production"
                color={activeColor}
              />
              <DropdownItem
                href="/duet-audio-production"
                label="Duet Audiobook/Drama Production"
                color={activeColor}
              />
              <DropdownItem
                href="/multicast-audio-production"
                label="Multi-Cast Audiobook/Drama Production"
                color={activeColor}
              />
            </DesktopDropdown>

            <DesktopDropdown
              title="About CineSonic"
              color={activeColor}
              isCinematic={isCinematic}
              activeStyles={activeStyles}
            >
              <DropdownHeader label="Our Philosophy" color={baseColor} />
              <DropdownItem
                href="/about-us/audiobook-production-process"
                label="The Production Process"
                color={activeColor}
              />
              <DropdownItem
                href="/about-us/the-best-actors"
                label="The Best Actors"
                color={activeColor}
              />
              <DropdownItem
                href="/about-us/uncompromising-work-ethic"
                label="Uncompromising Work Ethic"
                color={activeColor}
              />
              <DropdownItem
                href="/about-us/true-artistic-collaboration"
                label="True Artistic Collaboration"
                color={activeColor}
              />
              <DropdownItem
                href="/about-us/core-values"
                label="Foundational Company Values"
                color={activeColor}
              />
              <GlowingDivider
                color={baseColor}
                activeStyles={activeStyles}
                isCinematic={isCinematic}
              />
              <DropdownItem
                href="/about-us/author-partner-testimonials"
                label="Author-Partner Testimonials"
                color={activeColor}
                highlight
              />
            </DesktopDropdown>

            <DesktopDropdown
              title="Intel"
              color={activeColor}
              isCinematic={isCinematic}
              activeStyles={activeStyles}
            >
              <DropdownItem
                href="/blog"
                label="The CineSonic Blog"
                color={activeColor}
              />
              <DropdownItem
                href="/frequently-asked-questions"
                label="FAQ"
                color={activeColor}
              />
            </DesktopDropdown>
          </div>

          {/* --- RIGHT: UTILITIES --- */}
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0 min-w-fit">
            {/* 🛍️ SHOP BUTTON */}
            <Link
              href="/cinesonic-shop"
              className="hidden lg:flex items-center gap-2 px-3 py-2 rounded-full border border-white/5 hover:border-[var(--theme-color)]/50 hover:bg-[var(--theme-color)]/5 transition-all duration-300 group"
              title="CineSonic Shop"
            >
              <ShoppingBag
                size={14}
                className={`transition-colors duration-300 ${
                  isCinematic
                    ? "text-white/80"
                    : "text-gray-400 group-hover:text-[var(--theme-color)]"
                }`}
              />
              <span
                className={`hidden xl:inline text-[10px] font-bold uppercase tracking-widest transition-colors duration-300 ${
                  isCinematic
                    ? shimmerClass
                    : "text-gray-300 group-hover:text-[var(--theme-color)]"
                }`}
              >
                Shop
              </span>
            </Link>

            {/* 🟢 STACKED UTILITIES: HUB & ACADEMY */}
            <div className="hidden md:flex flex-col gap-1.5 h-full justify-center">
              {/* 1. HUB BUTTON */}
              <Link
                href="/hub"
                className="group relative flex items-center justify-between gap-3 px-3 lg:px-4 py-1.5 bg-black/40 border transition-all duration-300 overflow-hidden hover:border-[var(--theme-color)] hover:shadow-[0_0_15px_var(--theme-color)] rounded-[4px]"
                style={{
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="absolute inset-0 w-[200%] h-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background:
                      activeStyles?.gradient ||
                      `linear-gradient(90deg, transparent, ${activeColor}, transparent)`,
                    transform: "skewX(-20deg) translateX(-100%)",
                    animation: "scan 2s infinite linear",
                  }}
                />
                <div className="flex flex-col items-start leading-none relative z-10">
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-0.5 whitespace-nowrap">
                    Cast & Crew
                  </span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-[0.1em] font-mono group-hover:text-shadow-sm whitespace-nowrap transition-all duration-300">
                    Production Hub
                  </span>
                </div>
                {/* Ping Dot */}
                <div className="relative flex h-1.5 w-1.5 flex-shrink-0">
                  <span
                    className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 duration-700"
                    style={{ backgroundColor: activeColor }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-1.5 w-1.5"
                    style={{ backgroundColor: activeColor }}
                  />
                </div>
                <Shield
                  size={12}
                  className="text-gray-600 transition-colors group-hover:text-white"
                />
              </Link>

              {/* 2. ACADEMY BUTTON */}
              <Link
                href="/cinesonic-academy"
                className="group relative flex items-center justify-between gap-3 px-3 lg:px-4 py-1.5 bg-black/40 border transition-all duration-300 overflow-hidden hover:border-[var(--theme-color)] hover:shadow-[0_0_15px_var(--theme-color)] rounded-[4px]"
                style={{
                  borderColor: "rgba(255,255,255,0.1)",
                }}
              >
                <div
                  className="absolute inset-0 w-[200%] h-full opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"
                  style={{
                    background:
                      activeStyles?.gradient ||
                      `linear-gradient(90deg, transparent, ${activeColor}, transparent)`,
                    transform: "skewX(-20deg) translateX(-100%)",
                    animation: "scan 2s infinite linear",
                  }}
                />
                <div className="flex flex-col items-start leading-none relative z-10">
                  <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest mb-0.5 whitespace-nowrap">
                    Learn
                  </span>
                  <span className="text-[10px] font-bold text-white uppercase tracking-[0.1em] font-mono group-hover:text-shadow-sm whitespace-nowrap transition-all duration-300">
                    Academy
                  </span>
                </div>
                <GraduationCap
                  size={12}
                  className="text-gray-600 transition-colors group-hover:text-white ml-auto"
                />
              </Link>
            </div>

            {/* MOBILE MENU TOGGLE */}
            <button
              className="lg:hidden p-2 text-white transition-colors relative z-[60]"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <div
        className={`fixed inset-0 z-[10001] bg-[#050505] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden flex flex-col ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.05] mix-blend-overlay" />
          <div
            className="absolute bottom-0 left-0 right-0 h-2/3 opacity-20 blur-[120px] transition-colors duration-1000"
            style={{
              background: `linear-gradient(to top, ${activeColor}, transparent)`,
            }}
          />
        </div>
        <div className="flex-1 overflow-y-auto pt-32 pb-12 px-8 relative z-10 custom-scrollbar">
          <button
            className="absolute top-6 right-6 p-2 text-white"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X size={32} />
          </button>

          <div className="max-w-md mx-auto space-y-12">
            <div className="space-y-6">
              <h4
                className="text-xs font-bold uppercase tracking-[0.3em] border-b border-white/10 pb-4"
                style={{ color: activeColor }}
              >
                Production Services
              </h4>
              <div className="flex flex-col gap-4">
                <MobileLink href="/projectform" color={activeColor} isPrimary>
                  Start Your Project Today
                </MobileLink>
                <MobileLink href="/audio-production-services-overview">
                  Production Services Overview
                </MobileLink>
                <MobileLink href="/roster">Our Elite Talent</MobileLink>
                <MobileLink href="/solo-audio-production">
                  Solo Audiobook/Drama Production
                </MobileLink>
                <MobileLink href="/dual-audio-production">
                  Dual Audiobook/Drama Production
                </MobileLink>
                <MobileLink href="/duet-audio-production">
                  Duet Audiobook/Drama Production
                </MobileLink>
                <MobileLink href="/multicast-audio-production">
                  Multi-Cast Audiobook/Drama Production
                </MobileLink>
                <MobileLink
                  href="/cinesonic-shop"
                  color={activeColor}
                  isPrimary
                >
                  Official Store
                </MobileLink>
                <MobileLink
                  href="/cinesonic-academy"
                  color={activeColor}
                  isPrimary
                >
                  Academy
                </MobileLink>
              </div>
            </div>

            <div className="space-y-6">
              <h4
                className="text-xs font-bold uppercase tracking-[0.3em] border-b border-white/10 pb-4"
                style={{ color: activeColor }}
              >
                About CineSonic
              </h4>
              <div className="flex flex-col gap-4">
                <MobileLink href="/about-us/audiobook-production-process">
                  The Production Process
                </MobileLink>
                <MobileLink href="/about-us/the-best-actors">
                  The Best Actors
                </MobileLink>
                <MobileLink href="/about-us/uncompromising-work-ethic">
                  Uncompromising Work Ethic
                </MobileLink>
                <MobileLink href="/about-us/true-artistic-collaboration">
                  True Artistic Collaboration
                </MobileLink>
                <MobileLink href="/about-us/core-values">
                  Foundational Company Values
                </MobileLink>
                <MobileLink href="/about-us/author-partner-testimonials">
                  Author-Partner Testimonials
                </MobileLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% {
            transform: skewX(-20deg) translateX(-150%);
          }
          100% {
            transform: skewX(-20deg) translateX(200%);
          }
        }
      `}</style>
    </>
  );
}

// --- SUBCOMPONENTS ---

function DesktopDropdown({
  title,
  children,
  color,
  isCinematic,
  activeStyles,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative h-full flex items-center" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`h-full flex items-center justify-center gap-2 text-[10px] xl:text-xs font-bold tracking-widest transition-all duration-300 outline-none uppercase group px-3
          ${isOpen ? "text-white" : "text-gray-400"}
          hover:text-[var(--theme-color)]`}
      >
        {title}
        <ChevronDown
          size={14}
          className={`flex-shrink-0 transition-transform duration-500 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: isOpen ? color : "currentColor" }}
        />
      </button>

      {/* DROPDOWN MENU - WIDER TO FIT LONG TEXT */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[360px] xl:w-[400px] transition-all duration-300 ease-out transform z-[100] ${
          isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2 pointer-events-none"
        }`}
      >
        <div
          className="relative bg-[#0a0a0a]/95 backdrop-blur-3xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="absolute top-0 left-0 right-0 h-1 transition-all duration-500"
            style={{ background: isCinematic ? activeStyles?.gradient : color }}
          />
          <div className="py-4 flex flex-col gap-1">{children}</div>
        </div>
      </div>
    </div>
  );
}

function DropdownHeader({ label, color }) {
  return (
    <div className="px-6 pt-4 pb-2">
      <span
        className="text-[9px] font-bold uppercase tracking-[0.25em] opacity-50 flex items-center gap-2"
        style={{ color: color }}
      >
        <Sparkles size={8} /> {label}
      </span>
    </div>
  );
}

function DropdownItem({ href, label, highlight = false, color }) {
  return (
    <Link
      href={href}
      className="group relative block px-6 py-3.5 text-sm font-medium transition-all duration-300 hover:bg-white/5 overflow-hidden"
    >
      <div className="flex items-center justify-between relative z-10">
        <span
          className={`transition-colors duration-300 ${
            highlight ? "font-bold" : "text-gray-400 group-hover:text-white"
          }`}
          style={{ color: highlight ? color : undefined }}
        >
          <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
            {label}
          </span>
        </span>
        <ChevronRight
          size={14}
          className="opacity-0 -translate-x-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0"
          style={{ color: color }}
        />
      </div>
      <div
        className="absolute bottom-0 left-0 h-[1px] w-0 transition-all duration-300 ease-out group-hover:w-full"
        style={{ background: color, boxShadow: `0 0 10px ${color}` }}
      />
    </Link>
  );
}

function GlowingDivider({ color, activeStyles, isCinematic }) {
  return (
    <div className="relative h-px w-full my-3">
      <div className="absolute inset-0 bg-white/5" />
      <div
        className="absolute inset-0 opacity-50"
        style={{
          background: isCinematic
            ? activeStyles?.gradient
            : `linear-gradient(90deg, transparent, ${color}, transparent)`,
        }}
      />
    </div>
  );
}

function MobileLink({ href, children, isPrimary = false, color }) {
  return (
    <Link
      href={href}
      className="group flex items-center justify-between py-2 w-full active:opacity-60"
    >
      <span
        className={`text-xl font-serif tracking-tight transition-colors duration-300 ${
          isPrimary
            ? "font-bold text-white"
            : "text-white/60 font-light group-hover:text-white"
        }`}
        style={{ color: isPrimary ? color : undefined }}
      >
        {children}
      </span>
      {isPrimary && <ArrowRight size={20} style={{ color: color }} />}
    </Link>
  );
}
