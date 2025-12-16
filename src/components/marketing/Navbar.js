"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Shield, ChevronDown, Menu, X, ChevronRight } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 h-20 md:h-24 z-50 select-none">
        {/* --- NAVBAR BACKGROUND (Glass + Grain) --- */}
        <div className="absolute inset-0 bg-[#030303]/80 backdrop-blur-md border-b border-white/5 transition-all duration-300">
          {/* Grain Texture */}
          <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />
        </div>

        <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center relative z-10">
          {/* --- LEFT: LOGO --- */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center group relative z-50"
          >
            {/* Using a placeholder text if image fails, but keeping your Image component structure */}
            <div className="relative h-10 w-auto md:h-12 transition-opacity group-hover:opacity-80">
              <Image
                src="/images/homepage-navbar-hero-logo-cinesonic-audiobooks-transparent.png"
                alt="CineSonic Audiobooks"
                width={200}
                height={60}
                className="h-full w-auto object-contain"
                priority
              />
            </div>
          </Link>

          {/* --- CENTER: DESKTOP NAVIGATION --- */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-10">
            {/* 1. BOOK NOW (Direct Link) */}
            <Link
              href="/projectform"
              className="text-[11px] font-bold tracking-[0.2em] text-white uppercase py-2 border-b-2 border-transparent hover:border-[#d4af37] hover:text-[#d4af37] transition-all duration-300"
            >
              Book Now
            </Link>

            {/* 2. DROPDOWN: Services */}
            <DesktopDropdown title="Audiobook Services">
              <DropdownItem
                href="/audiobook-production-services-overview"
                label="Services Overview"
              />
              <DropdownItem href="/roster" label="Talent Roster" />
              <div className="h-px bg-white/10 my-1 mx-4" />
              <DropdownItem
                href="/solo-audiobook-production"
                label="Solo Production"
              />
              <DropdownItem
                href="/dual-audiobook-production"
                label="Dual Production"
              />
              <DropdownItem
                href="/duet-audiobook-production"
                label="Duet Production"
              />
              <DropdownItem
                href="/multicast-audiobook-production"
                label="Multi-Cast Production"
              />
              <div className="h-px bg-white/10 my-1 mx-4" />
              <DropdownItem
                href="/projectform"
                label="Start Your Project"
                highlight
              />
            </DesktopDropdown>

            {/* 3. DROPDOWN: About */}
            <DesktopDropdown title="About CineSonic">
              <DropdownItem
                href="/about-us/audiobook-production-process"
                label="Production Process"
              />
              <DropdownItem
                href="/about-us/author-partner-testimonials"
                label="Testimonials"
              />
              <DropdownItem
                href="/about-us/the-best-actors-bar-none"
                label="The Best Actors"
              />
              <DropdownItem
                href="/about-us/uncompromising-work-ethic"
                label="Work Ethic"
              />
              <DropdownItem
                href="/about-us/true-artistic-collaboration"
                label="Artistic Collaboration"
              />
              <DropdownItem href="/about-us/core-values" label="Core Values" />
            </DesktopDropdown>

            {/* 4. DROPDOWN: Resources */}
            <DesktopDropdown title="Resources">
              <DropdownItem href="/blog" label="The Blog" />
              <DropdownItem href="/frequently-asked-questions" label="FAQ" />
            </DesktopDropdown>
          </div>

          {/* --- RIGHT: UTILITIES & TOGGLE --- */}
          <div className="flex items-center gap-6">
            {/* Desktop Dashboard Link */}
            <Link
              href="/dashboard"
              className="hidden md:flex group items-center gap-3 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 hover:border-[#d4af37]/50 hover:bg-[#d4af37]/5 transition-all duration-300"
            >
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 duration-1000"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_#22c55e]"></span>
              </div>
              <div className="flex flex-col items-start leading-none">
                <span className="text-[10px] font-bold text-gray-300 group-hover:text-[#d4af37] uppercase tracking-widest transition-colors">
                  Hub
                </span>
              </div>
              <Shield
                size={12}
                className="text-gray-600 group-hover:text-[#d4af37] transition-colors ml-1"
              />
            </Link>

            {/* Mobile Hamburger */}
            <button
              className="lg:hidden p-1 text-gray-300 hover:text-[#d4af37] transition-colors relative z-50"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MOBILE MENU OVERLAY (Fixed & Scrollable) --- */}
      <div
        className={`fixed inset-0 z-40 bg-[#050505] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:hidden
        ${
          isMobileMenuOpen
            ? "opacity-100 pointer-events-auto translate-y-0"
            : "opacity-0 pointer-events-none -translate-y-4"
        }`}
      >
        {/* Grain Overlay for Mobile */}
        <div className="absolute inset-0 opacity-[0.05] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay pointer-events-none" />

        {/* Scrollable Container */}
        <div className="h-full overflow-y-auto pt-28 pb-10 px-8 flex flex-col">
          {/* Mobile Navigation Groups */}
          <div className="space-y-10">
            {/* 1. SERVICES */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]/70 border-b border-white/5 pb-2">
                Production Services
              </h4>
              <div className="flex flex-col gap-1">
                <MobileLink href="/projectform" highlight>
                  Book Now
                </MobileLink>
                <MobileLink href="/audiobook-production-services-overview">
                  Services Overview
                </MobileLink>
                <MobileLink href="/roster">Talent Roster</MobileLink>
                <MobileLink href="/solo-audiobook-production">
                  Solo Production
                </MobileLink>
                <MobileLink href="/dual-audiobook-production">
                  Dual Production
                </MobileLink>
                <MobileLink href="/duet-audiobook-production">
                  Duet Production
                </MobileLink>
                <MobileLink href="/multicast-audiobook-production">
                  Multi-Cast
                </MobileLink>
              </div>
            </div>

            {/* 2. ABOUT */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]/70 border-b border-white/5 pb-2">
                About CineSonic
              </h4>
              <div className="flex flex-col gap-1">
                <MobileLink href="/about-us/audiobook-production-process">
                  Our Process
                </MobileLink>
                <MobileLink href="/about-us/author-partner-testimonials">
                  Testimonials
                </MobileLink>
                <MobileLink href="/about-us/the-best-actors-bar-none">
                  The Actors
                </MobileLink>
                <MobileLink href="/about-us/core-values">
                  Core Values
                </MobileLink>
              </div>
            </div>

            {/* 3. RESOURCES */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#d4af37]/70 border-b border-white/5 pb-2">
                Intel
              </h4>
              <div className="flex flex-col gap-1">
                <MobileLink href="/blog">Production Blog</MobileLink>
                <MobileLink href="/frequently-asked-questions">FAQ</MobileLink>
              </div>
            </div>

            {/* 4. DASHBOARD CTA */}
            <div className="pt-6">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-3 w-full py-4 rounded-lg bg-white/5 border border-white/10 active:scale-[0.98] transition-transform"
              >
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 duration-1000"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-white">
                  Access Production Hub
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ----------------------------------------
// SUB-COMPONENTS
// ----------------------------------------

// DESKTOP DROPDOWN WRAPPER
// Added "delay-200" to group-hover to make it less sensitive
function DesktopDropdown({ title, children }) {
  return (
    <div className="relative group h-full flex items-center">
      <button className="flex items-center gap-1 text-[13px] font-medium tracking-wide text-gray-400 group-hover:text-white transition-colors py-2 outline-none">
        {title}
        <ChevronDown
          size={12}
          className="group-hover:rotate-180 transition-transform duration-300 text-[#d4af37]/70"
        />
      </button>

      {/* The Magic: 
         1. invisible + opacity-0 by default.
         2. group-hover:visible + opacity-100 
         3. delay-200 -> prevents accidental opening
      */}
      <div className="absolute top-[80%] left-1/2 -translate-x-1/2 pt-4 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto delay-150">
        <div className="bg-[#0a0a0a] border border-white/10 rounded-lg shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden backdrop-blur-3xl ring-1 ring-white/5">
          <div className="py-2 flex flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
}

// DROPDOWN LINK ITEM
function DropdownItem({ href, label, highlight = false }) {
  return (
    <Link
      href={href}
      className={`
        relative block px-5 py-2.5 text-xs font-medium transition-colors duration-200
        ${
          highlight
            ? "text-[#d4af37]"
            : "text-gray-400 hover:text-white hover:bg-white/5"
        }
      `}
    >
      <span className="relative z-10 flex items-center justify-between">
        {label}
        {highlight && <ChevronRight size={10} />}
      </span>
    </Link>
  );
}

// MOBILE LINK ITEM
function MobileLink({ href, children, highlight = false }) {
  // Note: We don't pass setIsMobileMenuOpen here directly to keep it clean,
  // but in a real app you'd want clicking a link to close the menu.
  // You can wrap this in a parent onclick handler if needed.
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 py-2 text-sm transition-all duration-200
        ${
          highlight
            ? "text-[#d4af37] font-bold tracking-widest uppercase"
            : "text-gray-400 font-light hover:text-white hover:translate-x-1"
        }
      `}
    >
      {children}
    </Link>
  );
}
