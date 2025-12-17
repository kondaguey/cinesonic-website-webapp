"use client";

import React, { useEffect } from "react";
import { ThemeProvider, useTheme } from "./ThemeContext";
import Navbar from "../marketing/Navbar";
import Footer from "../marketing/Footer";
import QuickAccessSidebar from "../marketing/QuickAccessSidebar";
import RosterSidebar from "../marketing/RosterSidebar";
// 🟢 1. Import the Visual Engine
import ParticleFx from "./ParticleFx";

// Internal component that consumes the context
function ThemeLayout({ children }) {
  const { theme, isCinematic } = useTheme();

  // 🟢 2. HANDLE CINESONIC MODE (Letterboxing)
  // This watches the toggle and adds the class to Body for the global CSS to catch
  useEffect(() => {
    if (isCinematic) {
      document.body.classList.add("cinesonic-active");
    } else {
      document.body.classList.remove("cinesonic-active");
    }
  }, [isCinematic]);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* 🟢 3. THE PARTICLE LAYER (Background) */}
      <ParticleFx mode="ambient" vector="none" />

      {/* 🟢 4. UI LAYER (Foreground) */}
      {/* Navbar sits on top (z-100 in its own file) */}
      <Navbar theme={theme} />

      <QuickAccessSidebar theme={theme} />
      <RosterSidebar theme={theme} />

      {/* Main content gets z-10 to sit above particles but below Nav */}
      <main className="relative z-10 min-h-screen">{children}</main>

      <Footer theme={theme} />
    </div>
  );
}

// The Main Export
export default function ThemeWrapper({ children }) {
  return (
    <ThemeProvider>
      <ThemeLayout>{children}</ThemeLayout>
    </ThemeProvider>
  );
}
