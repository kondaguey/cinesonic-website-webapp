"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Mic2, Shield, ChevronDown, Menu, X } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 left-0 right-0 h-24 z-50 isolate">
      {/* GPU-Accelerated Glass Layer */}
      <div
        className="absolute inset-0 bg-[#050510]/80 backdrop-blur-xl border-b border-white/5 -z-10 transform-gpu"
        style={{ transform: "translate3d(0,0,0)" }}
      />

      <div className="max-w-7xl mx-auto px-6 h-full flex justify-between items-center">
        {/* --- LEFT: LOGO --- */}
        <Link href="/" className="flex-shrink-0 flex items-center gap-3 group">
          <Image
            src="/images/homepage-navbar-hero-logo-cinesonic-audiobooks-transparent.png"
            alt="CineSonic Audiobooks"
            width={180}
            height={50}
            className="w-auto h-30 object-contain group-hover:opacity-80 transition-opacity"
            priority
          />
        </Link>

        {/* --- CENTER: DESKTOP NAVIGATION --- */}
        <div className="hidden lg:flex items-center gap-8">
          {/* 1. BOOK NOW */}
          <Link
            href="/projectform"
            className="text-xs font-bold tracking-[0.2em] text-white uppercase py-2 border-b-2 border-transparent hover:border-gold hover:text-gold transition-all duration-300"
          >
            Book Now
          </Link>

          {/* 2. DROPDOWN: Services */}
          <div className="relative group h-24 flex items-center">
            <span className="flex items-center gap-1 text-md font-medium tracking-wide text-gray-400 group-hover:text-white transition-colors py-2 cursor-pointer">
              Audiobook Production Services
              <ChevronDown
                size={14}
                className="group-hover:rotate-180 transition-transform duration-300 text-gold/70"
              />
            </span>

            <div className="absolute top-[75%] left-1/2 -translate-x-1/2 pt-6 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto">
              <div className="bg-[#050510] border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="py-2">
                  <DropdownItem
                    href="/audiobook-production-services-overview"
                    label="Audiobook Production Services Overview"
                  />
                  <DropdownItem href="/roster" label="Our Talent Roster" />
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
                  <div className="h-px bg-white/5 my-2 mx-6"></div>
                  <DropdownItem
                    href="/projectform"
                    label="Start Your Project"
                    highlight
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 3. DROPDOWN: About */}
          <div className="relative group h-24 flex items-center">
            <span className="flex items-center gap-1 text-md font-medium tracking-wide text-gray-400 group-hover:text-white transition-colors py-2 cursor-pointer">
              About CineSonic
              <ChevronDown
                size={14}
                className="group-hover:rotate-180 transition-transform duration-300 text-gold/70"
              />
            </span>

            <div className="absolute top-[75%] left-1/2 -translate-x-1/2 pt-6 w-72 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto">
              <div className="bg-[#050510] border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="py-2">
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
                  <DropdownItem
                    href="/about-us/core-values"
                    label="CineSonic Core Values"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 4. DROPDOWN: Resources */}
          <div className="relative group h-24 flex items-center">
            <span className="flex items-center gap-1 text-md font-medium tracking-wide text-gray-400 group-hover:text-white transition-colors cursor-pointer py-2">
              Resources
              <ChevronDown
                size={14}
                className="group-hover:rotate-180 transition-transform duration-300 text-gold/70"
              />
            </span>

            <div className="absolute top-[75%] left-1/2 -translate-x-1/2 pt-6 w-64 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-out transform group-hover:translate-y-0 translate-y-2 pointer-events-none group-hover:pointer-events-auto">
              <div className="bg-[#050510] border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden">
                <div className="py-2">
                  <DropdownItem href="/blog" label="The CineSonic Blog" />
                  <DropdownItem
                    href="/frequently-asked-questions"
                    label="FAQ"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT: MOBILE TOGGLE & SYSTEMS --- */}
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="hidden md:flex group items-center gap-4 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 hover:border-gold/50 hover:bg-gold/5 transition-all duration-300"
          >
            <div className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75 duration-1000"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500 shadow-[0_0_10px_#22c55e]"></span>
            </div>
            <div className="flex flex-col items-end leading-none">
              <span className="text-[10px] font-bold text-gray-300 group-hover:text-gold uppercase tracking-widest transition-colors">
                Production Hub
              </span>
              <span className="text-[8px] text-green-500 font-mono tracking-widest mt-1">
                SYSTEMS ONLINE
              </span>
            </div>
            <Shield
              size={14}
              className="text-gray-500 group-hover:text-gold transition-colors"
            />
          </Link>

          <button
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* --- MOBILE MENU OVERLAY --- */}
      {isMobileMenuOpen && (
        <div className="absolute top-24 left-0 w-full bg-[#050510]/95 backdrop-blur-xl border-b border-white/10 p-6 flex flex-col gap-6 lg:hidden animate-fade-in-down shadow-2xl h-[calc(100vh-6rem)] overflow-y-auto">
          <Link
            href="/projectform"
            className="text-xl font-bold text-gold uppercase tracking-widest"
          >
            Book Now
          </Link>

          <div className="flex flex-col gap-3">
            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              Services
            </h4>
            <MobileLink href="/roster">Talent Roster</MobileLink>
            <MobileLink href="/solo-audiobook-production">
              Solo Production
            </MobileLink>
            <MobileLink href="/multicast-audiobook-production">
              Multi-Cast Production
            </MobileLink>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              About
            </h4>
            <MobileLink href="/about-us">About CineSonic</MobileLink>
            <MobileLink href="/about-us/author-partner-testimonials">
              Testimonials
            </MobileLink>
          </div>

          <div className="flex flex-col gap-3">
            <h4 className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              Resources
            </h4>
            <MobileLink href="/blog">Blog</MobileLink>
            <MobileLink href="/frequently-asked-questions">FAQ</MobileLink>
          </div>

          <Link
            href="/dashboard"
            className="mt-4 flex items-center justify-center gap-3 px-4 py-3 rounded-lg bg-white/5 border border-white/10 text-sm font-bold tracking-widest uppercase text-gray-300"
          >
            Access Production Hub
          </Link>
        </div>
      )}
    </nav>
  );
}

// ----------------------------------------
// HELPER COMPONENTS
// ----------------------------------------

function DropdownItem({ href, label, highlight = false }) {
  return (
    <Link
      href={href}
      className={`
        relative group block px-6 py-2.5 
        text-sm font-semibold transition-all duration-300
        ${highlight ? "text-gold" : "text-gray-400 hover:text-white"}
      `}
    >
      {/* 1. The Gold Fill Gradient (Smoother, covers full area) */}
      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-gold/10 via-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>

      {/* 2. The Text */}
      <span className="relative z-10 flex items-center justify-between">
        {label}
      </span>

      {/* 3. The Gold Underline "Snazzle" */}
      <span className="absolute bottom-0 left-0 h-[1px] w-full bg-gradient-to-r from-gold via-gold/50 to-transparent origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out"></span>
    </Link>
  );
}

function MobileLink({ href, children }) {
  return (
    <Link
      href={href}
      className="text-lg text-gray-300 hover:text-white hover:pl-2 transition-all duration-200"
    >
      {children}
    </Link>
  );
}
