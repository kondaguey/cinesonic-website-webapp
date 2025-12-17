"use client";

import React from "react";
// 🟢 ADJUST PATHS AS NEEDED based on your structure
import Navbar from "@/src/components/marketing/Navbar";
import Footer from "@/src/components/marketing/Footer";

export default function MarketingLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen relative">
      {/* The Navbar sits on top of the marketing pages */}
      <Navbar />

      <main className="flex-grow w-full relative z-10">{children}</main>

      {/* The Footer sits at the bottom of marketing pages */}
      <Footer />
    </div>
  );
}
