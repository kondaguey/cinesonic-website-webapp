import Link from "next/link";
import { Film, Mic, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center text-white p-6 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-gold/5 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="relative z-10 mb-12 text-center animate-fade-in-up">
        {/* Replace with your actual image path if hosted locally, or keep remote URL */}
        <img
          src="https://www.danielnotdaylewis.com/img/cinesonic_logo_banner_gold_16x9.png"
          className="h-32 object-contain mx-auto mb-6 shadow-glow rounded-lg border border-gold/10"
          alt="CineSonic Logo"
        />
        <h1 className="text-5xl font-serif text-gold mb-2 tracking-wide drop-shadow-lg">
          CINESONIC
        </h1>
        <p className="text-gray-400 tracking-[0.4em] text-sm uppercase font-light">
          Production Intelligence V8
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full relative z-10 animate-fade-in">
        {/* CARD 1: CLIENTS */}
        <Link
          href="/authorform"
          className="group relative bg-glass backdrop-blur-md border border-gold/20 p-8 rounded-xl hover:border-gold/60 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-midnight border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-glow">
              <Film className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-2 font-serif">
              Publishers
            </h3>
            <p className="text-xs text-gray-400 group-hover:text-gold-light transition-colors">
              Submit New Project
            </p>
          </div>
        </Link>

        {/* CARD 2: TALENT */}
        <Link
          href="/talent"
          className="group relative bg-glass backdrop-blur-md border border-gold/20 p-8 rounded-xl hover:border-gold/60 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-midnight border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-glow">
              <Mic className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-2 font-serif">
              Talent
            </h3>
            <p className="text-xs text-gray-400 group-hover:text-gold-light transition-colors">
              Manage Profile & Avail
            </p>
          </div>
        </Link>

        {/* CARD 3: ADMIN */}
        <Link
          href="/admin"
          className="group relative bg-glass backdrop-blur-md border border-gold/20 p-8 rounded-xl hover:border-gold/60 transition-all duration-300 hover:-translate-y-1 overflow-hidden"
        >
          <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <div className="relative z-10 text-center">
            <div className="w-16 h-16 bg-midnight border border-gold/30 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-glow">
              <Shield className="w-8 h-8 text-gold" />
            </div>
            <h3 className="text-xl font-bold uppercase tracking-widest text-white mb-2 font-serif">
              Staff Access
            </h3>
            <p className="text-xs text-gray-400 group-hover:text-gold-light transition-colors">
              Studio Dashboard
            </p>
          </div>
        </Link>
      </div>

      <footer className="absolute bottom-6 text-[10px] text-white/20 tracking-widest uppercase">
        System Status: Online &bull; Secure Connection
      </footer>
    </div>
  );
}
