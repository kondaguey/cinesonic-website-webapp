import React from "react";

export default function Badge({ label, color, bg, border, className = "" }) {
  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest border ${bg} ${color} ${border} ${className}`}
    >
      {label}
    </span>
  );
}
