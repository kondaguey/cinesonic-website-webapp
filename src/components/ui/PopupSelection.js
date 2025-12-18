"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function PopupSelection({
  isOpen,
  onClose,
  title,
  children,
  activeColor,
}) {
  // 🔒 LOCK BACKGROUND SCROLL
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    // z-index: 999999 ensures it's above everything.
    // items-start + pt-28 pushes the modal down away from the top nav.
    <div className="fixed inset-0 z-[999999] flex justify-center items-start pt-20 md:pt-28 p-4 md:p-8 overflow-hidden">
      {/* 🟢 THE GLASS OVERLAY 
          Increased blur and transparency for the "looking through glass" effect. */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-[50px] animate-in fade-in duration-1000"
        onClick={onClose}
      />

      {/* 🟢 THE MODAL CONTAINER 
          Wider (4xl), Shorter (70vh), and anchored at the top. */}
      <div className="relative w-full h-auto max-h-[70vh] md:max-w-4xl bg-white/[0.04] border border-white/20 md:rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.7)] flex flex-col animate-in zoom-in-95 slide-in-from-top-10 duration-500 overflow-hidden backdrop-blur-xl">
        {/* LIGHTING EFFECT (Top Inner Glow) */}
        <div className="absolute inset-0 pointer-events-none rounded-[inherit] border-t border-white/40" />

        {/* HEADER */}
        <div className="p-8 md:p-12 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div>
            <h3 className="text-2xl md:text-4xl font-serif text-white tracking-[0.1em] uppercase italic">
              {title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-3 text-white/40 hover:text-white bg-white/10 rounded-full transition-all hover:rotate-90 active:scale-90"
          >
            <X size={32} />
          </button>
        </div>

        {/* CONTENT (Scrollable Area) */}
        <div className="flex-1 overflow-y-auto p-8 md:p-12 custom-scrollbar scroll-smooth">
          {children}
        </div>

        {/* FOOTER */}
        <div className="p-8 md:p-10 bg-white/[0.01] border-t border-white/10 backdrop-blur-sm">
          <button
            onClick={onClose}
            className="w-full py-6 rounded-full text-black text-sm font-black uppercase tracking-[0.4em] transition-all hover:brightness-125 active:scale-[0.97] shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            style={{ backgroundColor: activeColor || "#fff" }}
          >
            Confirm Selection
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.15); 
          border-radius: 30px; 
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        /* Lock responsiveness for very small height screens */
        @media (max-height: 700px) {
          .max-h-[70vh] {
            max-h-[80vh];
          }
          .pt-20 {
            pt-12;
          }
        }
      `}</style>
    </div>
  );
}
