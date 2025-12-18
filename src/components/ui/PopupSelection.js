"use client";

import React, { useEffect } from "react";
import { X } from "lucide-react";

export default function PopupSelection({
  isOpen,
  onClose,
  title,
  children,
  activeColor,
  currentCount, // current selection count
  maxCount, // max allowed
}) {
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

  const hasCounter =
    typeof currentCount === "number" && typeof maxCount === "number";

  return (
    <div className="fixed inset-0 z-[999999] flex justify-center items-start pt-20 md:pt-28 p-4 md:p-8 overflow-hidden">
      {/* GLASS OVERLAY */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[40px] animate-in fade-in duration-700"
        onClick={onClose}
      />

      {/* MODAL CONTAINER */}
      <div className="relative w-full h-auto max-h-[70vh] md:max-w-4xl bg-[#0a0a15]/80 border border-white/20 md:rounded-[2.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.8)] flex flex-col animate-in zoom-in-95 slide-in-from-top-10 duration-500 overflow-hidden backdrop-blur-xl">
        {/* SLIM HEADER */}
        <div className="px-6 py-4 md:px-10 md:py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-baseline gap-3">
            <h3 className="text-lg md:text-xl font-serif text-white tracking-widest uppercase italic">
              {title}
            </h3>
            {hasCounter && (
              <span className="font-mono text-[10px] text-white/30 tracking-tighter uppercase">
                Selection:{" "}
                <span style={{ color: activeColor }}>{currentCount}</span> /{" "}
                {maxCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/30 hover:text-white bg-white/5 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 custom-scrollbar">
          {children}
        </div>

        {/* SLIM FOOTER WITH SMALL CENTERED BUTTON */}
        <div className="p-4 md:p-5 bg-white/[0.01] border-t border-white/10 flex justify-center">
          <button
            onClick={onClose}
            className="px-10 py-2.5 rounded-full text-black text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:brightness-110 active:scale-[0.95] shadow-lg"
            style={{ backgroundColor: activeColor || "#fff" }}
          >
            Confirm
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: rgba(255, 255, 255, 0.1); 
          border-radius: 20px; 
        }
        @media (max-height: 700px) {
          .max-h-[70vh] { max-h-[85vh]; }
          .pt-20 { pt-10; }
        }
      `}</style>
    </div>
  );
}
