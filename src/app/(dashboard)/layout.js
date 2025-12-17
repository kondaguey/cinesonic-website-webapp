"use client";

import React from "react";

export default function DashboardLayout({ children }) {
  return (
    // 🟢 CLEAN SLATE: No Navbar, No Footer.
    // Just a container that ensures the background is correct.
    <div className="min-h-screen bg-[#020010] text-white relative">
      <main className="w-full h-full">{children}</main>
    </div>
  );
}
