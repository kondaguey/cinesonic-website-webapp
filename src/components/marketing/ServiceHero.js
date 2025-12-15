import React from "react";
import { ArrowDownCircle } from "lucide-react";

const ServiceHero = ({
  title,
  subtitle,
  badgeText,
  accentColor = "#d4af37", // Default to Cinema Gold
  backgroundImageUrl,
}) => {
  return (
    <section className="relative w-full min-h-[80vh] flex items-center justify-center overflow-hidden bg-[#050505]">
      {/* 1. Dynamic Ambient Glow (The "Aura") */}
      {/* Uses the accentColor prop to cast a colored light into the void */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-20 blur-[120px] pointer-events-none"
        style={{ backgroundColor: accentColor }}
      />

      {/* 2. Background Texture / Image Overlay */}
      <div className="absolute inset-0 z-0">
        {backgroundImageUrl && (
          <img
            src={backgroundImageUrl}
            alt="Background"
            className="w-full h-full object-cover opacity-30 mix-blend-overlay"
          />
        )}
        {/* Noise Texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
        {/* Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-[#050505]"></div>
      </div>

      {/* 3. Content Layer */}
      <div className="relative z-10 container mx-auto px-6 text-center flex flex-col items-center">
        {/* Badge */}
        <div
          className="mb-6 px-4 py-1 border rounded-full backdrop-blur-md uppercase tracking-[0.25em] text-[10px] font-bold shadow-[0_0_15px_rgba(0,0,0,0.5)]"
          style={{
            borderColor: `${accentColor}40`, // 40 is hex opacity
            color: accentColor,
            boxShadow: `0 0 20px -5px ${accentColor}40`,
          }}
        >
          {badgeText}
        </div>

        {/* Cinematic Title */}
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-white leading-tight drop-shadow-2xl mb-6">
          {title}
        </h1>

        {/* Subtitle */}
        <p className="font-sans text-white/60 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
          {subtitle}
        </p>

        {/* CTA Button */}
        <button className="group relative px-8 py-4 bg-[#d4af37] text-black font-bold uppercase tracking-widest text-xs transition-all duration-300 hover:scale-105 hover:shadow-[0_0_30px_#d4af37]">
          <span className="relative z-10 flex items-center gap-2">
            Start Production
          </span>
        </button>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 animate-bounce text-white/20">
          <ArrowDownCircle size={32} strokeWidth={1} />
        </div>
      </div>
    </section>
  );
};

export default ServiceHero;
