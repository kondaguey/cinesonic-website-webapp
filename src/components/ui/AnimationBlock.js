import React from "react";

export default function AnimationBox({ title, color, children }) {
  return (
    <div className="relative h-64 rounded-xl border border-white/10 bg-black/40 overflow-hidden flex items-center justify-center group">
      <div
        className="absolute top-3 left-3 text-xs font-bold uppercase tracking-widest z-10 bg-black/50 px-2 py-1 rounded"
        style={{ color }}
      >
        {title}
      </div>
      {/* Isolated Animation Container */}
      <div className="absolute inset-0">{children}</div>
      <div className="absolute bottom-3 right-3 text-[9px] text-white/30 font-mono z-10">
        CSS Keyframe
      </div>
    </div>
  );
}
