"use client";

import React, { useEffect, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { X, Check } from "lucide-react";

export default function PopupSelection({
  isOpen,
  onClose,
  title,
  children,
  activeColor,
  currentCount,
  maxCount,
}) {
  const [mounted, setMounted] = useState(false);

  // 1. HYDRATION & SCROLL LOCK
  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // 2. SORTING ENGINE (A-Z)
  const sortedChildren = useMemo(() => {
    return React.Children.toArray(children).sort((a, b) => {
      const getText = (node) => {
        if (typeof node === "string") return node;
        if (typeof node.props?.children === "string")
          return node.props.children;
        return "";
      };
      const textA = getText(a);
      const textB = getText(b);
      return textA.localeCompare(textB);
    });
  }, [children]);

  if (!mounted || !isOpen) return null;

  // 3. THE PORTAL
  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 font-sans">
      {/* COMPACT GLASS BACKDROP */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* THE SLATE (Skinnier, Centered) */}
      <div className="relative w-full max-w-lg max-h-[70vh] bg-[#0a0a15] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 ring-1 ring-white/10">
        {/* HEADER */}
        <div className="flex-none px-6 py-4 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
          <div className="flex flex-col">
            <h3 className="text-lg font-serif text-white tracking-widest">
              {title}
            </h3>
            {typeof currentCount === "number" && (
              <span className="text-[10px] text-gray-400 font-mono uppercase tracking-wider mt-0.5">
                Selection:{" "}
                <span style={{ color: activeColor }}>{currentCount}</span> /{" "}
                {maxCount}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT (Centered 2-Column Grid) */}
        <div className="flex-1 overflow-y-auto p-4 bg-[#0a0a15] custom-scrollbar">
          <div className="grid grid-cols-2 gap-2 text-center">
            {sortedChildren}
          </div>
        </div>

        {/* COMPACT FOOTER */}
        <div className="flex-none p-4 border-t border-white/10 bg-white/[0.02] flex justify-center">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl text-black text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-[1.01] flex items-center justify-center gap-2 shadow-lg"
            style={{ backgroundColor: activeColor || "#fff" }}
          >
            <Check size={12} strokeWidth={3} /> Confirm
          </button>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #0a0a15;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.15);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>,
    document.body
  );
}
