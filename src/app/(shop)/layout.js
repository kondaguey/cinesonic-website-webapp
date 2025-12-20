"use client";

import React from "react";
// 🟢 FIXED: changed 'store' to 'shop' to match your folder structure
import StoreNavbar from "../../components/shop/ShopNavbar";
import Footer from "../../components/marketing/Footer";

export default function StoreLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen relative bg-[#020010]">
      <StoreNavbar />
      <main className="flex-grow w-full relative z-10">{children}</main>
      <Footer />
    </div>
  );
}
