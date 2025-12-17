import React from "react";

export default function TypographyRow({ label, className, children }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[150px_1fr] gap-8 items-baseline border-b border-white/5 pb-4 last:border-0">
      <span className="text-xs text-white/30 font-mono text-right">
        {label}
      </span>
      <p className={className}>{children}</p>
    </div>
  );
}
