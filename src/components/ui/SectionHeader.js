import React from "react";

export default function SectionHeader({ icon: Icon, title, color }) {
  return (
    <div className="flex items-center gap-4 pb-4 border-b border-white/10">
      {Icon && <Icon className={color} size={28} />}
      <h2 className="text-3xl md:text-4xl text-white font-serif">{title}</h2>
    </div>
  );
}
