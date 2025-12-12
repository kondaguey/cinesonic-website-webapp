import Link from "next/link";
import { Film, Mic, Shield, Users, ArrowRight } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white p-4 md:p-6 relative overflow-hidden bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)]">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gold/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      {/* HERO SECTION */}
      <div className="relative z-10 mb-12 md:mb-16 text-center animate-fade-in-up w-full max-w-4xl">
        <img
          src="https://www.danielnotdaylewis.com/img/cinesonic_logo_banner_gold_16x9.png"
          className="h-40 md:h-64 object-contain mx-auto mb-8 shadow-[0_0_40px_rgba(212,175,55,0.15)] rounded-lg border border-gold/10"
          alt="CineSonic Logo"
        />
        <h1 className="text-4xl md:text-6xl font-serif text-gold mb-3 tracking-wide drop-shadow-lg">
          CineSonic
        </h1>
        <p className="text-gray-400 tracking-[0.3em] md:tracking-[0.5em] text-xs md:text-sm uppercase font-light">
          Production Intelligence V13
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full relative z-10 animate-fade-in px-2 mb-10">
        {/* CARD 1: CLIENTS */}
        <Link
          href="/projectintake"
          className="group relative bg-black/40 backdrop-blur-xl border border-gold/20 p-8 md:p-10 rounded-2xl hover:border-gold/60 transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-midnight border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Film className="w-8 h-8 md:w-10 md:h-10 text-gold" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-2 font-serif">
              Publishers
            </h3>
            <p className="text-xs md:text-sm text-gray-400 group-hover:text-white transition-colors">
              Submit New Project
            </p>
          </div>
        </Link>

        {/* CARD 2: TALENT LOGIN */}
        <Link
          href="/talent"
          className="group relative bg-black/40 backdrop-blur-xl border border-gold/20 p-8 md:p-10 rounded-2xl hover:border-gold/60 transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-midnight border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Mic className="w-8 h-8 md:w-10 md:h-10 text-gold" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-2 font-serif">
              Talent Portal
            </h3>
            <p className="text-xs md:text-sm text-gray-400 group-hover:text-white transition-colors">
              Manage Profile & Avail
            </p>
          </div>
        </Link>

        {/* CARD 3: ADMIN */}
        <Link
          href="/admin"
          className="group relative bg-black/40 backdrop-blur-xl border border-gold/20 p-8 md:p-10 rounded-2xl hover:border-gold/60 transition-all duration-300 hover:-translate-y-2 overflow-hidden shadow-2xl"
        >
          <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-midnight border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(212,175,55,0.2)]">
              <Shield className="w-8 h-8 md:w-10 md:h-10 text-gold" />
            </div>
            <h3 className="text-xl md:text-2xl font-bold uppercase tracking-widest text-white mb-2 font-serif">
              Staff Access
            </h3>
            <p className="text-xs md:text-sm text-gray-400 group-hover:text-white transition-colors">
              Studio Dashboard
            </p>
          </div>
        </Link>
      </div>

      {/* 🟢 NEW: SLEEK ROSTER SHOWCASE BUTTON */}
      <div className="relative z-10 animate-fade-in-up delay-300">
        <Link
          href="/roster"
          className="group flex items-center gap-3 px-8 py-3 rounded-full bg-white/5 border border-gold/30 hover:bg-gold hover:text-midnight hover:border-gold transition-all duration-300 shadow-glow hover:shadow-[0_0_30px_rgba(212,175,55,0.4)]"
        >
          <Users className="w-4 h-4 text-gold group-hover:text-midnight transition-colors" />
          <span className="uppercase tracking-[0.2em] text-xs font-bold text-gray-200 group-hover:text-midnight">
            Browse Talent Roster
          </span>
          <ArrowRight className="w-4 h-4 text-gold group-hover:text-midnight transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <footer className="absolute bottom-6 text-[10px] text-white/20 tracking-widest uppercase">
        System Status: Online &bull; Secure Connection
      </footer>
    </div>
  );
}
