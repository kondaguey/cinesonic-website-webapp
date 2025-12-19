"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Cookies from "js-cookie";
import { Shield, Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function ProspectLogin() {
  const [keyInput, setKeyInput] = useState("");
  const [status, setStatus] = useState("Awaiting access key");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showKey, setShowKey] = useState(false);

  const handleEntry = async () => {
    if (!keyInput) return;
    setIsLoading(true);

    const enteredKey = keyInput.trim().toUpperCase();
    const tables = [
      "actors",
      "artists",
      "authors",
      "admin",
      "crew",
      "site_keys",
    ];

    try {
      let match = null;

      for (const table of tables) {
        const { data } = await supabase
          .from(table)
          .select("login_key")
          .eq("login_key", enteredKey)
          .maybeSingle();

        if (data) {
          match = data;
          break;
        }
      }

      if (match) {
        Cookies.set("cinesonic-beta-access", enteredKey, {
          expires: 7,
          path: "/",
        });
        window.location.href = "/"; // Or your logic for admin redirect
      } else {
        setStatus("INVALID_KEY");
        setIsError(true);
      }
    } catch (err) {
      setStatus("ERROR");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-deep-space flex items-center justify-center p-6 font-sans text-white/90">
      <div className="max-w-sm w-full animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="font-serif text-[10px] tracking-[0.5em] text-white/30 uppercase mb-2">
            CineSonic Productions
          </h1>
          <h2 className="font-serif text-lg text-shimmer-silver tracking-wide">
            Access Portal
          </h2>
        </div>

        <div className="glass-panel p-8 shadow-2xl relative border-white/5 bg-white/[0.01]">
          <div className="space-y-6">
            <div className="relative">
              <label className="text-[9px] uppercase tracking-widest text-white/20 mb-2 block ml-1 font-bold">
                Personal Access Key
              </label>

              <div className="relative group">
                <input
                  autoFocus
                  type={showKey ? "text" : "password"}
                  className={`w-full bg-white/[0.03] border rounded-xl py-4 px-5 text-xl outline-none transition-all font-sans tracking-widest placeholder:text-white/5 ${
                    isError
                      ? "border-red-900/50 text-red-200"
                      : "border-white/10 focus:border-blurple/50 focus:bg-white/[0.05]"
                  }`}
                  placeholder="Enter code"
                  value={keyInput}
                  onChange={(e) => {
                    setKeyInput(e.target.value);
                    if (isError) setIsError(false);
                  }}
                  onKeyDown={(e) => e.key === "Enter" && handleEntry()}
                  disabled={isLoading}
                />

                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/10 hover:text-white/40 transition-colors"
                >
                  {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              onClick={handleEntry}
              disabled={isLoading || !keyInput}
              className={`w-full py-4 rounded-xl font-bold text-xs tracking-widest transition-all flex items-center justify-center gap-2 border shadow-lg ${
                isLoading
                  ? "bg-white/5 border-white/5 text-white/20 cursor-wait"
                  : "bg-midnight border-white/10 text-white/80 hover:bg-blurple hover:border-white/20 active:scale-[0.99]"
              } disabled:opacity-20`}
            >
              {isLoading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                <>
                  Enter Portal <ArrowRight size={14} className="opacity-40" />
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center">
          <div className="flex items-center gap-2 opacity-40">
            <div
              className={`w-1 h-1 rounded-full ${
                isError ? "bg-red-500" : "bg-blurple"
              }`}
            />
            <span className="text-[10px] font-medium tracking-wide">
              {status}
            </span>
          </div>
          <p className="mt-6 text-[9px] text-white/10 uppercase tracking-[0.2em] font-sans">
            Restricted Beta • 2025
          </p>
        </div>
      </div>
    </div>
  );
}
