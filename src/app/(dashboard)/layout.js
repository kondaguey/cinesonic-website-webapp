// src/app/(dashboard)/layout.js
"use client";

import React from "react";
import { useTheme } from "../../components/ui/ThemeContext";

export default function DashboardLayout({ children }) {
  const { isLightMode } = useTheme();

  return (
    // 🟢 This applies the 'light-mode' class to the dashboard wrapper.
    // The CSS in globals.css will target children of this class.
    <div
      className={`min-h-screen relative transition-colors duration-500 ease-in-out ${
        isLightMode ? "light-mode bg-gray-100" : "bg-[#020010] text-white"
      }`}
    >
      <main className="w-full h-full">{children}</main>
    </div>
  );
}
