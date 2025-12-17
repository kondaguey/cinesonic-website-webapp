import React from "react";

export default function ColorSwatch({ color, label, hex }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className={`w-full h-16 rounded-lg shadow-inner border border-white/10 ${color}`}
        style={{ backgroundColor: hex }}
      ></div>
      <div>
        <p className="text-white font-bold text-sm">{label}</p>
        <p className="text-white/40 text-xs font-mono">{hex}</p>
      </div>
    </div>
  );
}
