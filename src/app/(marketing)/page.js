"use client";
import React from "react";
import Link from "next/link";
import { Mic2, Shield, Users, Send } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)] text-white">
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 animate-fade-in-up">
        <div className="text-center mb-16 max-w-2xl">
          <h1 className="text-5xl md:text-7xl font-serif text-white mb-6 leading-tight">
            Voices that <span className="text-gold">Resonate</span>
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            Premium audio production services. From casting to mastering, we
            manage the entire lifecycle of your audio project.
          </p>
        </div>

        {/* PRIMARY ACTIONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
          <Link
            href="/projectform"
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/50 p-10 rounded-2xl text-left transition-all duration-300"
          >
            <div className="absolute top-6 right-6 p-3 bg-gold/10 rounded-full group-hover:bg-gold text-gold group-hover:text-midnight transition-colors">
              <Send size={24} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-2">
              Start a Production
            </h3>
            <p className="text-sm text-gray-400 group-hover:text-gray-200">
              Publishers & Authors: Submit a new project request here.
            </p>
          </Link>

          <Link
            href="/roster"
            className="group relative bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/50 p-10 rounded-2xl text-left transition-all duration-300"
          >
            <div className="absolute top-6 right-6 p-3 bg-gold/10 rounded-full group-hover:bg-gold text-gold group-hover:text-midnight transition-colors">
              <Users size={24} />
            </div>
            <h3 className="text-2xl font-serif text-white mb-2">
              Browse Roster
            </h3>
            <p className="text-sm text-gray-400 group-hover:text-gray-200">
              View our active talent pool and listen to demos.
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
