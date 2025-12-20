"use client";

import React from "react";
// 🟢 Imports the specific Academy Navbar
import AcademyNavbar from "../../components/academy/AcademyNavbar";
// 🟢 Reuses the shared Marketing Footer
import Footer from "../../components/marketing/Footer";

export default function AcademyLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen relative bg-[#020010]">
      {/* Academy Navigation */}
      <AcademyNavbar />

      {/* Page Content */}
      <main className="flex-grow w-full relative z-10">{children}</main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
