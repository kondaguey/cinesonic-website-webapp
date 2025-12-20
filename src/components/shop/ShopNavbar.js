"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Cinzel } from "next/font/google";
import { useTheme } from "../ui/ThemeContext";
import CineSonicToggle from "../ui/CineSonicToggle";
// 🟢 FIXED IMPORT: Matches your actual file "ShopLoginModal.js"
import ShopLoginModal from "./ShopLoginModal";

import {
  ShoppingBag,
  Menu,
  X,
  Search,
  User,
  Palette,
  Check,
  ChevronDown,
  Sparkles,
  ChevronRight,
} from "lucide-react";

// FONT CONFIG
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["700"],
  display: "swap",
});

// THEME DEFINITIONS
const AVAILABLE_THEMES = [
  { id: "gold", label: "Solo Gold", hex: "#d4af37" },
  { id: "pink", label: "Dual Love", hex: "#ff3399" },
  { id: "fire", label: "Duet Inferno", hex: "#ff4500" },
  { id: "cyan", label: "Multi Dimensional", hex: "#00f0ff" },
];

export default function ShopNavbar() {
  const { theme, setThemeName, activeStyles, isCinematic } = useTheme();

  // Active Color logic
  const activeColor = activeStyles?.color || "#d4af37";
  const shimmerClass = activeStyles?.shimmer || "text-shimmer-gold";

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

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
            <h1
              className={`${cinzel.className} text-xl md:text-3xl lg:text-3xl xl:text-4xl font-bold tracking-wider drop-shadow-lg transition-colors duration-500 text-[var(--theme-color)]`}
            >
              CineSonic™{" "}
              <span className="text-white/50 text-[0.4em] align-top tracking-widest ml-1">
                SHOP
              </span>
            </h1>

            <h1
              className={`${
                cinzel.className
              } absolute inset-0 text-xl md:text-3xl lg:text-3xl xl:text-4xl font-bold tracking-wider drop-shadow-lg transition-opacity duration-500 pointer-events-none 
              ${shimmerClass} ${isCinematic ? "opacity-100" : "opacity-0"}`}
            >
              CineSonic™{" "}
              <span className="text-white/50 text-[0.4em] align-top tracking-widest ml-1">
                SHOP
              </span>
            </h1>
          </Link>

          {/* --- CENTER: STORE NAVIGATION --- */}
          <div className="hidden lg:flex items-center gap-4 xl:gap-8 flex-1 justify-center flex-shrink-0 h-full px-4">
            <ThemeDropdown
              currentTheme={theme}
              setTheme={setThemeName}
              activeColor={activeColor}
            />

            <StoreDropdown
              title="CineSonic™ Originals"
              color={activeColor}
              isCinematic={isCinematic}
              activeStyles={activeStyles}
            >
              <DropdownHeader label="Merchandise" color={activeColor} />
              <DropdownItem
                href="/cinesonic-shop"
                label="Apparel & Gear"
                color={activeColor}
              />
              <DropdownItem
                href="/cinesonic-shop"
                label="Accessories"
                color={activeColor}
              />

              <GlowingDivider
                color={activeColor}
                activeStyles={activeStyles}
                isCinematic={isCinematic}
              />

              <DropdownHeader label="Digital" color={activeColor} />
              <DropdownItem
                href="/cinesonic-shop"
                label="SFX Libraries"
                color={activeColor}
              />
              <DropdownItem
                href="/cinesonic-shop"
                label="Vocal Presets"
                color={activeColor}
              />
            </StoreDropdown>

            <Link
              href="/cinesonic-shop"
              className="h-full flex items-center justify-center text-[10px] xl:text-xs font-bold tracking-widest text-gray-400 hover:text-white uppercase transition-colors px-3"
            >
              New Arrivals
            </Link>

            <Link
              href="/cinesonic-shop"
              className="h-full flex items-center justify-center text-[10px] xl:text-xs font-bold tracking-widest text-gray-400 hover:text-[#ff3333] uppercase transition-colors px-3"
            >
              Sale
            </Link>
          </div>

          {/* --- RIGHT: UTILITIES --- */}
          <div className="flex items-center gap-2 lg:gap-4 flex-shrink-0 min-w-fit">
            <button className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
              <Search size={18} />
            </button>

            <Link
              href="/cinesonic-shop"
              className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 hover:border-[var(--theme-color)] hover:bg-[var(--theme-color)]/10 transition-all duration-300 group rounded-md"
            >
              <ShoppingBag
                size={16}
                className="text-gray-300 group-hover:text-[var(--theme-color)] transition-colors"
              />
              <span className="hidden xl:inline text-[10px] font-bold uppercase tracking-widest text-gray-300 group-hover:text-white">
                Cart (0)
              </span>
            </Link>

            {/* 🟢 SIGN IN BUTTON - Triggers Modal */}
            <button
              onClick={() => setIsLoginOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-gray-400 hover:text-white transition-colors group"
            >
              <User
                size={18}
                className="group-hover:text-[var(--theme-color)] transition-colors"
              />
              <span className="hidden lg:inline text-[10px] font-bold uppercase tracking-widest">
                Sign In
              </span>
            </button>

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
            className="absolute bottom-0 left-0 right-0 h-2/3 opacity-20 blur-[120px]"
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
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 border-b border-white/10 pb-4">
                Interface Experience
              </h4>
              <div className="flex justify-center pb-2">
                <CineSonicToggle />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {AVAILABLE_THEMES.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setThemeName(t.id)}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      theme === t.id
                        ? "bg-white/10 border-white/20 text-white"
                        : "border-transparent text-gray-500 hover:bg-white/5"
                    }`}
                  >
                    <span
                      className="w-3 h-3 rounded-full shadow-[0_0_8px_currentColor]"
                      style={{ backgroundColor: t.hex }}
                    />
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <h4 className="text-xs font-bold uppercase tracking-[0.3em] text-gray-500 border-b border-white/10 pb-4">
                Store Menu
              </h4>
              <div className="flex flex-col gap-4">
                <MobileLink href="/cinesonic-shop" color={activeColor}>
                  Store Home
                </MobileLink>
                <MobileLink href="/cinesonic-shop" color={activeColor}>
                  Apparel
                </MobileLink>
                <MobileLink
                  href="/cinesonic-shop"
                  color={activeColor}
                  isPrimary
                >
                  Your Cart
                </MobileLink>
              </div>
            </div>

            <div className="pt-8 border-t border-white/10">
              <Link
                href="/"
                className="text-xs text-gray-500 hover:text-white uppercase tracking-widest flex items-center gap-2"
              >
                <ChevronRight size={12} /> Return to Production Site
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 🟢 MODAL COMPONENT (Correctly Named) */}
      {isLoginOpen && <ShopLoginModal onClose={() => setIsLoginOpen(false)} />}
    </>
  );
}

// --- SUBCOMPONENTS ---

function ThemeDropdown({ currentTheme, setTheme, activeColor }) {
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
        className={`h-full flex items-center justify-center gap-2 text-[10px] xl:text-xs font-bold tracking-widest transition-all duration-300 outline-none uppercase group px-4 border-l border-r border-transparent
                  ${
                    isOpen
                      ? "bg-white/5 border-white/5 text-white"
                      : "text-gray-400 hover:text-white"
                  }
                `}
      >
        <Palette size={14} style={{ color: activeColor }} />
        <span>Theme</span>
      </button>

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 mt-0 w-[300px] pt-4 transition-all duration-300 ease-out transform z-[100] ${
          isOpen
            ? "opacity-100 visible translate-y-0"
            : "opacity-0 invisible -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="relative bg-[#0a0a0a]/95 backdrop-blur-3xl rounded-xl overflow-hidden border border-white/10 shadow-2xl p-4">
          <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/10">
            <Sparkles size={12} className="text-gray-500" />
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold">
              Color Palette
            </span>
          </div>

          <div className="grid grid-cols-1 gap-1 mb-4">
            {AVAILABLE_THEMES.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex items-center justify-between w-full p-2 rounded-lg transition-all group ${
                  currentTheme === t.id ? "bg-white/10" : "hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor] transition-transform duration-300 group-hover:scale-125"
                    style={{ backgroundColor: t.hex }}
                  />
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      currentTheme === t.id
                        ? "text-white"
                        : "text-gray-400 group-hover:text-gray-200"
                    }`}
                  >
                    {t.label}
                  </span>
                </div>
                {currentTheme === t.id && (
                  <Check size={14} className="text-white" />
                )}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col items-center gap-2">
            <span className="text-[9px] uppercase tracking-widest text-gray-600 font-bold mb-1">
              Visual Experience
            </span>
            <CineSonicToggle />
          </div>
        </div>
      </div>
    </div>
  );
}

function StoreDropdown({ title, children, color, isCinematic, activeStyles }) {
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

      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-6 w-[250px] transition-all duration-300 ease-out transform z-[100] ${
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

function DropdownItem({ href, label, color }) {
  return (
    <Link
      href={href}
      className="group relative block px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-300 hover:bg-white/5 overflow-hidden text-gray-400 hover:text-white"
    >
      <div className="flex items-center justify-between relative z-10">
        <span className="transition-transform duration-300 group-hover:translate-x-1">
          {label}
        </span>
      </div>
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
        className={`text-lg font-serif tracking-tight transition-colors duration-300 ${
          isPrimary
            ? "font-bold text-white"
            : "text-white/60 font-light group-hover:text-white"
        }`}
        style={{ color: isPrimary ? color : undefined }}
      >
        {children}
      </span>
      {isPrimary && <ChevronRight size={16} style={{ color: color }} />}
    </Link>
  );
}
