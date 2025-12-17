import React from "react";

export default function ThemeCard({
  title,
  icon: Icon,
  borderColor,
  hex,
  description,
}) {
  return (
    <div
      className={`bg-white/5 border ${borderColor} p-8 rounded-xl relative overflow-hidden group`}
    >
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500"
        style={{ backgroundColor: hex }}
      />
      <div className="relative z-10 space-y-6">
        <div className="flex justify-between items-start">
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center border border-white/10"
            style={{ backgroundColor: `${hex}20` }}
          >
            {Icon && <Icon size={24} style={{ color: hex }} />}
          </div>
          <span className="font-mono text-[10px] text-white/30">{hex}</span>
        </div>
        <div>
          <h3 className="mb-2 text-xl font-serif">{title}</h3>
        </div>
        <div className="pt-4 border-t border-white/10">
          <p className="text-sm text-white/50 leading-relaxed">{description}</p>
        </div>
      </div>
    </div>
  );
}
