"use client";

import React from "react";
import { Shield, Lock, ArrowRight, Key } from "lucide-react";
import { unlockSite } from "../actions";

export default function SiteLockedPage({ searchParams }) {
  return (
    <div className="min-h-screen bg-[#020010] flex flex-col items-center justify-center relative overflow-hidden text-white font-sans p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#3b82f6_0%,_transparent_60%)] opacity-10 animate-pulse" />

      <div className="z-10 flex flex-col items-center text-center max-w-lg w-full">
        <div className="w-24 h-24 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(59,130,246,0.2)]">
          <Shield className="text-blue-500 w-10 h-10" />
        </div>

        <h1 className="text-4xl md:text-5xl font-serif mb-4 tracking-tight">
          RESTRICTED <span className="text-blue-500">ACCESS</span>
        </h1>

        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
          <form action={unlockSite} className="flex flex-col gap-4">
            <div className="relative">
              <Key
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                name="password"
                type="password"
                placeholder="ENTER SITE PASSWORD"
                className="w-full bg-black/50 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-xs font-mono text-white placeholder:text-gray-600 focus:border-blue-500 outline-none"
                required
              />
            </div>

            {searchParams?.error && (
              <p className="text-red-500 text-[10px] uppercase font-bold text-left">
                Invalid Password
              </p>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-white text-black rounded-xl font-bold uppercase tracking-widest hover:bg-gray-200 transition-colors flex items-center justify-center gap-2 text-xs"
            >
              Authenticate <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
