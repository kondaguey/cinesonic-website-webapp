import React, { useEffect, useState, useRef } from "react";
import { Play, Pause, AlertCircle } from "lucide-react"; // Make sure you have lucide-react installed

const ActorModal = ({ actor, onClose }) => {
  // 1. Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // 2. DATA PARSING HELPERS
  const parseList = (input) => {
    if (!input) return [];
    let rawList = [];
    if (Array.isArray(input)) {
      rawList = input;
    } else if (typeof input === "string") {
      const trimmed = input.trim();
      if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
        try {
          const jsonStr = trimmed.replace(/'/g, '"');
          rawList = JSON.parse(jsonStr);
        } catch (e) {
          rawList = trimmed.replace(/[\[\]"]/g, "").split(",");
        }
      } else {
        rawList = input.split(",");
      }
    }
    return rawList.map((item) => item.trim()).filter((item) => item.length > 0);
  };

  const formatVoiceTypes = (input) => {
    const list = parseList(input);
    if (list.length === 0) return "N/A";
    return list.join("  •  ");
  };

  const display = (val) => val || "N/A";

  if (!actor) return null;

  return (
    // DARK BACKDROP
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#020010]/95 backdrop-blur-md transition-opacity duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      {/* THE DOSSIER CARD */}
      <div className="relative w-full max-w-5xl max-h-[95vh] overflow-hidden rounded-2xl flex flex-col md:flex-row shadow-[0_0_50px_rgba(0,0,0,0.8)] border border-white/10 animate-[zoomIn_0.3s_ease-out] bg-[#0a0a0a]">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 text-white/40 hover:text-white transition-colors p-2 bg-black/50 rounded-full border border-white/5 hover:border-white/30"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* === LEFT COLUMN: VISUALS (35%) === */}
        <div className="w-full md:w-[340px] flex-shrink-0 bg-black/50 border-r border-white/5 flex flex-col">
          {/* IMAGE */}
          <div className="relative h-[400px] w-full group overflow-hidden">
            <img
              src={actor.headshot_url}
              alt={actor.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-black/60 backdrop-blur border border-[#d4af37]/50 rounded text-[10px] uppercase tracking-[0.2em] text-[#d4af37] font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                {display(actor.status)}
              </span>
            </div>
          </div>

          {/* ACTIONS & PLAYER */}
          <div className="p-6 space-y-4 flex flex-col flex-1 bg-gradient-to-b from-[#050505] to-[#020010]">
            {/* 🟢 INTEGRATED COOL PLAYER */}
            {actor.demo_url ? (
              <InlinePlayer src={actor.demo_url} />
            ) : (
              <div className="w-full py-4 border border-dashed border-white/10 text-white/30 text-xs uppercase tracking-widest text-center">
                No Audio Data
              </div>
            )}

            {/* EMAIL CTA */}
            <a
              href={`mailto:casting@cinesonicaudiobooks.com?subject=Inquiry regarding ${actor.name}`}
              className="flex items-center justify-center gap-2 w-full py-3 border border-white/10 hover:border-[#d4af37] hover:text-[#d4af37] text-white font-medium uppercase tracking-wider text-xs rounded transition-all duration-300 group"
            >
              <MailIcon className="w-3 h-3 group-hover:scale-110 transition-transform" />
              Request Booking
            </a>

            {/* SUB LINKS */}
            <div className="grid grid-cols-2 gap-2 mt-auto">
              <a
                href={actor.resume_url || "#"}
                target="_blank"
                rel="noreferrer"
                className={`text-center py-2 bg-white/5 hover:bg-white/10 rounded-sm text-[10px] uppercase tracking-widest text-gray-400 hover:text-white transition-colors ${
                  !actor.resume_url && "opacity-30 cursor-not-allowed"
                }`}
              >
                Resume
              </a>
              <a
                href={actor.website_link || "#"}
                target="_blank"
                rel="noreferrer"
                className={`text-center py-2 bg-white/5 hover:bg-white/10 rounded-sm text-[10px] uppercase tracking-widest text-gray-400 hover:text-white transition-colors ${
                  !actor.website_link && "opacity-30 cursor-not-allowed"
                }`}
              >
                Website
              </a>
            </div>
          </div>
        </div>

        {/* === RIGHT COLUMN: DATA (65%) === */}
        <div className="flex-1 p-8 md:p-10 bg-[#0a0a0a] overflow-y-auto custom-scrollbar">
          {/* HEADER */}
          <div className="mb-8 border-b border-white/5 pb-6">
            <h2 className="text-4xl md:text-5xl text-white font-serif tracking-tight mb-2">
              {actor.name}
            </h2>
            <p className="text-lg text-[#d4af37] font-light italic opacity-90">
              {formatVoiceTypes(actor.voice_type)}
            </p>
          </div>

          {/* VITALS GRID */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <VitalCard label="Age Range" value={actor.age_range} />
            <VitalCard label="Gender" value={actor.gender} />
            <VitalCard
              label="Availability"
              value={actor.next_available}
              highlight
            />
          </div>

          {/* BIO */}
          <div className="mb-8">
            <h5 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3">
              Bio
            </h5>
            <p className="text-gray-300 leading-relaxed text-base whitespace-pre-wrap font-light">
              {display(actor.bio)}
            </p>
          </div>

          {/* CAPABILITIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h5 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3">
                Genres
              </h5>
              <div className="flex flex-wrap gap-2">
                {parseList(actor.genres).map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-300 uppercase tracking-wide hover:border-[#d4af37]/50 transition-colors"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h5 className="text-[#d4af37] text-xs font-bold uppercase tracking-widest mb-3">
                Narrated Titles
              </h5>
              <p className="text-gray-300 text-sm font-light">
                {display(actor.audiobooks_narrated)}
              </p>
            </div>
          </div>

          {/* PRODUCTION INTEL */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              Production Intelligence
            </h5>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="block text-[10px] text-gray-600 uppercase mb-1">
                  Bookouts
                </span>
                <p className="text-sm text-gray-400">
                  {display(actor.bookouts)}
                </p>
              </div>
              <div>
                <span className="block text-[10px] text-gray-600 uppercase mb-1">
                  Training
                </span>
                <p className="text-sm text-gray-400 whitespace-pre-wrap">
                  {display(actor.training_notes)}
                </p>
              </div>
            </div>

            {/* TRIGGERS */}
            {actor.triggers && (
              <div>
                <span className="block text-[10px] text-red-500/70 uppercase mb-2 flex items-center gap-2">
                  <AlertCircle size={12} /> Content Boundaries
                </span>
                <div className="bg-red-950/20 border border-red-500/20 rounded p-3">
                  <p className="text-sm text-red-200/80 italic">
                    {actor.triggers}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-10 text-right">
            <span className="text-[9px] font-mono text-gray-800 tracking-widest">
              ID: {actor.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorModal;

// --- SUB-COMPONENTS ---

const VitalCard = ({ label, value, highlight }) => (
  <div className="p-4 bg-white/5 rounded border border-white/5">
    <h5 className="opacity-40 text-[10px] uppercase tracking-widest mb-1">
      {label}
    </h5>
    <p
      className={`text-sm font-medium ${
        highlight ? "text-green-400" : "text-gray-200"
      }`}
    >
      {value || "N/A"}
    </p>
  </div>
);

const MailIcon = (props) => (
  <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

// --- THE COOL INLINE PLAYER ---
const InlinePlayer = ({ src }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const dur = audioRef.current.duration;
    if (dur) setProgress((current / dur) * 100);
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    if (!audioRef.current) return;
    const newTime =
      (e.nativeEvent.offsetX / e.target.offsetWidth) *
      audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  const formatTime = (time) => {
    if (!time) return "0:00";
    const min = Math.floor(time / 60);
    const sec = Math.floor(time % 60);
    return `${min}:${sec < 10 ? "0" : ""}${sec}`;
  };

  return (
    <div className="w-full bg-black/40 border border-[#d4af37]/30 rounded-lg p-3 flex flex-col gap-2 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="flex items-center gap-3">
        {/* Play Button */}
        <button
          onClick={togglePlay}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#d4af37] text-black hover:scale-110 transition-transform flex-shrink-0"
        >
          {isPlaying ? (
            <Pause size={14} fill="black" />
          ) : (
            <Play size={14} fill="black" className="ml-0.5" />
          )}
        </button>

        {/* Waveform / Progress Bar */}
        <div className="flex-1 flex flex-col justify-center h-full gap-1">
          {/* Visualizer Bars Animation (CSS Only) */}
          <div className="flex items-end gap-[2px] h-3 opacity-50">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className={`w-1 bg-[#d4af37] rounded-t-sm transition-all duration-300 ${
                  isPlaying ? "animate-pulse" : ""
                }`}
                style={{
                  height: isPlaying ? `${Math.random() * 100}%` : "20%",
                  animationDelay: `${i * 0.05}s`,
                }}
              />
            ))}
          </div>

          {/* Progress Track */}
          <div
            className="relative w-full h-1 bg-white/10 rounded-full cursor-pointer group"
            onClick={handleSeek}
          >
            <div
              className="absolute top-0 left-0 h-full bg-[#d4af37] rounded-full transition-all duration-100"
              style={{ width: `${progress}%` }}
            />
            {/* Hover Handle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `${progress}%`, marginLeft: "-4px" }}
            />
          </div>
        </div>

        {/* Time */}
        <div className="text-[10px] font-mono text-[#d4af37] w-8 text-right">
          {formatTime(audioRef.current?.currentTime || 0)}
        </div>
      </div>
    </div>
  );
};
