import React from "react";

export default function ShowcaseBlock({ title, children }) {
  return (
    <div className="border border-white/10 rounded-xl overflow-hidden shadow-lg bg-black/20 backdrop-blur-sm">
      <div className="bg-white/5 px-6 py-3 text-xs font-mono text-[#d4af37]/80 font-bold border-b border-white/5 flex justify-between items-center">
        <span>&lt;{title} /&gt;</span>
        <span className="text-[10px] opacity-50 uppercase">Component</span>
      </div>
      <div>{children}</div>
    </div>
  );
}
