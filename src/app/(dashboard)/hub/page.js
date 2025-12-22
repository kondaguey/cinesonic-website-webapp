"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Mic,
  Palette,
  Globe,
  User,
  Music,
  BookOpen,
  Terminal,
  X,
  Loader2,
  Lock,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } },
};

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

// --- MAIN PAGE COMPONENT ---
export default function HubPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState(null);

  // MODAL STATE
  const [modalState, setModalState] = useState({
    isOpen: false,
    role: "actor",
    redirectPath: "/",
  });

  // 🛡️ AUTH LISTENER
  useEffect(() => {
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) setCurrentUser(session.user);
    };
    getInitialSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_OUT" || !session) {
          setCurrentUser(null);
        } else if (session?.user) {
          setCurrentUser(session.user);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // THE TRAFFIC COP INTERFACE
  const handleAccess = (role, path) => {
    if (currentUser) {
      router.push(path);
    } else {
      setModalState({ isOpen: true, role: role, redirectPath: path });
    }
  };

  return (
    <div className="min-h-screen bg-[#020010] flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-white">
      {/* BACKGROUND FX */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#1a0f5e_0%,_#020010_70%)] pointer-events-none"
      />
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent opacity-30" />

      {/* TOP NAV: LEFT */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute top-8 left-8 z-20"
      >
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-500 hover:text-[#d4af37] text-xs uppercase tracking-widest transition-colors"
        >
          <Globe size={14} /> Return to Public Site
        </Link>
      </motion.div>

      {/* MAIN CONTENT */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="relative z-10 w-full max-w-7xl"
      >
        {/* HEADER */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
            className="inline-block p-4 rounded-full bg-white/5 border border-white/10 mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)]"
          >
            <span className="text-3xl">🎬</span>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-4xl md:text-6xl font-serif text-white mb-4 tracking-tight"
          >
            CineSonic <span className="text-[#d4af37]">Studio Hub</span>
          </motion.h1>
          <motion.p
            variants={itemVariants}
            className="text-gray-400 uppercase tracking-[0.2em] text-xs md:text-sm max-w-lg mx-auto leading-relaxed"
          >
            Select your access terminal. Unauthorized access is prohibited.
          </motion.p>
        </div>

        <div className="space-y-16">
          {/* --- TIER 1: TALENT ROSTERS (Top Row) --- */}
          <div>
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-4 mb-8 opacity-70"
            >
              <div className="h-px bg-gradient-to-r from-transparent to-[#00f0ff] w-24" />
              <h3 className="text-[11px] uppercase tracking-[0.4em] font-black text-[#00f0ff] glow-sm text-center">
                Talent Rosters
              </h3>
              <div className="h-px bg-gradient-to-l from-transparent to-[#00f0ff] w-24" />
            </motion.div>

            <div className="flex flex-wrap justify-center gap-8">
              {/* ACTOR */}
              <motion.div
                variants={itemVariants}
                whileHover="hover"
                onClick={() => handleAccess("actor", "/actor-portal")}
                className="cursor-pointer w-full md:w-96 group relative bg-[#0a0a0a] border border-white/10 hover:border-[#00f0ff] rounded-3xl p-10 flex flex-col items-center text-center overflow-hidden transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#00f0ff]/10 border border-[#00f0ff]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  <Mic className="w-8 h-8 text-[#00f0ff]" />
                </div>
                <h2 className="text-2xl font-serif text-white mb-2 relative z-10 group-hover:text-[#00f0ff] transition-colors">
                  Actor Portal
                </h2>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors relative z-10">
                  <User size={12} className="text-[#00f0ff]" /> Talent Login
                </div>
              </motion.div>

              {/* ARTIST */}
              <motion.div
                variants={itemVariants}
                whileHover="hover"
                onClick={() => handleAccess("artist", "/artist-portal")}
                className="cursor-pointer w-full md:w-96 group relative bg-[#0a0a0a] border border-white/10 hover:border-[#ff3399] rounded-3xl p-10 flex flex-col items-center text-center overflow-hidden transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#ff3399]/10 border border-[#ff3399]/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  <Palette className="w-8 h-8 text-[#ff3399]" />
                </div>
                <h2 className="text-2xl font-serif text-white mb-2 relative z-10 group-hover:text-[#ff3399] transition-colors">
                  Artist Portal
                </h2>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors relative z-10">
                  <Music size={12} className="text-[#ff3399]" /> Creative Login
                </div>
              </motion.div>

              {/* AUTHOR */}
              <motion.div
                variants={itemVariants}
                whileHover="hover"
                onClick={() => handleAccess("author", "/author-portal")}
                className="cursor-pointer w-full md:w-96 group relative bg-[#0a0a0a] border border-white/10 hover:border-orange-500 rounded-3xl p-10 flex flex-col items-center text-center overflow-hidden transition-all duration-300"
              >
                <div className="w-16 h-16 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 relative z-10">
                  <BookOpen className="w-8 h-8 text-orange-500" />
                </div>
                <h2 className="text-2xl font-serif text-white mb-2 relative z-10 group-hover:text-orange-500 transition-colors">
                  Author Portal
                </h2>
                <div className="mt-8 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 group-hover:text-white transition-colors relative z-10">
                  <User size={12} className="text-orange-500" /> Literary Login
                </div>
              </motion.div>
            </div>
          </div>

          {/* --- TIER 2: SYSTEM OPERATIONS (Bottom Row) --- */}
          <div>
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-center gap-4 mb-6 opacity-50 hover:opacity-100 transition-opacity"
            >
              <div className="h-px bg-white/20 w-12" />
              <h3 className="text-[10px] uppercase tracking-[0.3em] font-bold text-white">
                System Operations
              </h3>
              <div className="h-px bg-white/20 w-12" />
            </motion.div>

            <div className="flex flex-wrap justify-center gap-6">
              {/* COMMAND CENTER */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={() =>
                  handleAccess("admin", "/admin/master-controller")
                }
                className="cursor-pointer w-full md:w-80 group relative bg-[#0a0a0a] border border-white/5 hover:border-red-900 rounded-2xl p-6 flex flex-col items-center text-center overflow-hidden opacity-80 hover:opacity-100 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform relative z-10">
                  <Terminal className="w-5 h-5 text-red-700 group-hover:text-red-500" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1 group-hover:text-red-500 transition-colors">
                  Command Center
                </h2>
              </motion.div>

              {/* CREW */}
              <motion.div
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -2 }}
                onClick={() => handleAccess("crew", "/crew-portal")}
                className="cursor-pointer w-full md:w-80 group relative bg-[#0a0a0a] border border-white/5 hover:border-[#d4af37]/50 rounded-2xl p-6 flex flex-col items-center text-center overflow-hidden opacity-80 hover:opacity-100 transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/10 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform relative z-10">
                  <Shield className="w-5 h-5 text-[#8a7224] group-hover:text-[#d4af37]" />
                </div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-1 group-hover:text-[#d4af37] transition-colors">
                  Crew Portal
                </h2>
              </motion.div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-center border-t border-white/5 pt-8"
        >
          <div className="flex justify-center items-center gap-2 text-[10px] text-gray-600 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            System Operational • V4.5.3
          </div>
        </motion.div>
      </motion.div>

      {/* DYNAMIC KEYCARD MODAL */}
      <AnimatePresence>
        {modalState.isOpen && (
          <LoginModal
            isOpen={modalState.isOpen}
            onClose={() => setModalState({ ...modalState, isOpen: false })}
            targetRole={modalState.role}
            redirectPath={modalState.redirectPath}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// --- LOGIN MODAL COMPONENT (Internal) ---
function LoginModal({ isOpen, onClose, targetRole, redirectPath }) {
  const router = useRouter();

  // STATE
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // CONFIG
  const roleConfig = {
    actor: { color: "#00f0ff", icon: Mic, label: "Actor Access" },
    artist: { color: "#ff3399", icon: Palette, label: "Artist Access" },
    author: { color: "#f97316", icon: BookOpen, label: "Author Access" },
    admin: { color: "#ef4444", icon: Terminal, label: "Command Override" },
    crew: { color: "#d4af37", icon: Shield, label: "Crew Verification" },
  };

  const config = roleConfig[targetRole] || roleConfig.actor;
  const RoleIcon = config.icon;

  // LOGIN LOGIC
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      onClose();
      router.push(redirectPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
      />

      {/* Modal Card */}
      <motion.div
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        style={{ borderColor: config.color }}
      >
        <div className="h-1 w-full" style={{ backgroundColor: config.color }} />

        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div
                className="p-2 rounded-lg bg-white/5 border border-white/10"
                style={{ color: config.color }}
              >
                <RoleIcon size={20} />
              </div>
              <div>
                <h3 className="text-xl font-serif text-white">
                  {config.label}
                </h3>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest">
                  Secure Connection Required
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 p-3 rounded-lg flex items-center gap-2 text-red-400 text-xs">
                <AlertCircle size={14} />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[10px] uppercase tracking-widest text-gray-500">
                Identity (Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="name@cinesonic.studio"
                  required
                />
                <User
                  size={16}
                  className="absolute right-3 top-3.5 text-gray-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              {/* 👇 SIMPLIFIED LINK TO RECOVERY PAGE 👇 */}
              <div className="flex justify-between items-center">
                <label className="text-[10px] uppercase tracking-widest text-gray-500">
                  Passcode
                </label>
                <Link
                  href="/password-rescue"
                  className="text-[10px] hover:underline cursor-pointer transition-colors"
                  style={{ color: config.color }}
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors"
                  placeholder="••••••••"
                  required
                />
                <Lock
                  size={16}
                  className="absolute right-3 top-3.5 text-gray-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 mt-6 transition-all hover:brightness-110 active:scale-95"
              style={{ backgroundColor: config.color, color: "#000" }}
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  Authenticate <ChevronRight size={14} />
                </>
              )}
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
