import React, { useEffect } from "react";

const ActorModal = ({ actor, onClose }) => {
  // 1. Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // 2. SMART PARSER (For Lists & JSON)
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

  // 3. VOICE TYPE FORMATTER
  const formatVoiceTypes = (input) => {
    const list = parseList(input);
    if (list.length === 0) return "N/A";
    return list.join("  •  ");
  };

  if (!actor) return null;
  const display = (val) => val || "N/A";

  return (
    // DARK BACKDROP
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[var(--color-deep-space)]/95 backdrop-blur-md transition-opacity duration-300">
      <div className="absolute inset-0" onClick={onClose} />

      {/* THE DOSSIER CARD */}
      <div className="glass-panel relative w-full max-w-5xl max-h-[95vh] overflow-y-auto rounded-2xl flex flex-col md:flex-row shadow-2xl border border-white/10 animate-[zoomIn_0.3s_ease-out]">
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 text-white/40 hover:text-white transition-colors p-2 bg-black/50 rounded-full border border-white/5"
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
        <div className="w-full md:w-[320px] flex-shrink-0 bg-black/50 border-r border-white/5 flex flex-col">
          {/* IMAGE */}
          <div className="relative h-[380px] w-full group overflow-hidden">
            <img
              src={actor.headshot_url}
              alt={actor.name}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            {/* Subtle gradient overlay at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />

            {/* Status Badge */}
            <div className="absolute top-4 left-4">
              <span className="px-3 py-1 bg-black/60 backdrop-blur border border-[var(--color-gold)]/50 rounded text-[10px] uppercase tracking-[0.2em] text-[var(--color-gold)] font-bold shadow-[0_0_10px_rgba(212,175,55,0.2)]">
                {display(actor.status)}
              </span>
            </div>
          </div>

          {/* ACTIONS */}
          {/* Removed 'justify-end' so buttons sit right under the image */}
          <div className="p-6 space-y-3 flex flex-col bg-gradient-to-b from-transparent to-black/80">
            {/* 1. LISTEN BUTTON (Gold) */}
            {actor.demo_url && (
              <a
                href={actor.demo_url}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center justify-center gap-3 w-full py-3 bg-[var(--color-gold)] text-black font-bold uppercase tracking-wider text-xs rounded-sm hover:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(212,175,55,0.3)]"
              >
                <svg
                  className="w-4 h-4 group-hover:scale-110 transition-transform"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
                Listen to Demo
              </a>
            )}

            {/* 2. CASTING BUTTON (White Outline) */}
            <a
              href="mailto:casting@cinesonicaudiobooks.com"
              className="flex items-center justify-center gap-2 w-full py-3 border border-white/20 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] text-white font-medium uppercase tracking-wider text-xs rounded-sm transition-all duration-300"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              I Like What I Hear
            </a>

            {/* 3. SUB LINKS */}
            <div className="grid grid-cols-2 gap-2 mt-2">
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
        <div className="flex-1 p-8 md:p-10 bg-[var(--color-midnight)]/40 overflow-y-auto custom-scrollbar">
          {/* HEADER */}
          <div className="mb-8 border-b border-white/5 pb-6">
            <h2 className="text-4xl md:text-6xl text-white font-serif tracking-tight mb-2 drop-shadow-lg">
              {actor.name}
            </h2>
            <p className="text-lg md:text-xl text-[var(--color-gold)] font-light italic opacity-90">
              {formatVoiceTypes(actor.voice_type)}
            </p>
          </div>

          {/* VITALS (3 COLUMNS NOW) */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="p-4 bg-white/5 rounded border border-white/5">
              <h5 className="opacity-40 text-[10px] uppercase tracking-widest mb-1">
                Age Range
              </h5>
              <p className="text-base font-medium text-gray-200">
                {display(actor.age_range)}
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded border border-white/5">
              <h5 className="opacity-40 text-[10px] uppercase tracking-widest mb-1">
                Gender
              </h5>
              <p className="text-base font-medium text-gray-200">
                {display(actor.gender)}
              </p>
            </div>
            <div className="p-4 bg-white/5 rounded border border-white/5">
              <h5 className="opacity-40 text-[10px] uppercase tracking-widest mb-1">
                Availability
              </h5>
              <p className="text-base font-medium text-green-400">
                {display(actor.next_available)}
              </p>
            </div>
          </div>

          {/* BIO - UPDATED: Larger text */}
          <div className="mb-8">
            <h5 className="text-[var(--color-gold)] text-xs font-bold uppercase tracking-widest mb-3">
              Bio
            </h5>
            <p className="text-gray-300 leading-relaxed text-base md:text-lg whitespace-pre-wrap font-light">
              {display(actor.bio)}
            </p>
          </div>

          {/* CAPABILITIES */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div>
              <h5 className="text-[var(--color-gold)] text-xs font-bold uppercase tracking-widest mb-3">
                Genres
              </h5>
              <div className="flex flex-wrap gap-2">
                {parseList(actor.genres).map((tag, i) => (
                  <span
                    key={i}
                    className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-gray-300 uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
                {parseList(actor.genres).length === 0 && (
                  <span className="text-gray-600 text-xs">N/A</span>
                )}
              </div>
            </div>
            <div>
              <h5 className="text-[var(--color-gold)] text-xs font-bold uppercase tracking-widest mb-3">
                Narrated
              </h5>
              <p className="text-gray-300 text-sm font-light">
                {display(actor.audiobooks_narrated)}
              </p>
            </div>
          </div>

          {/* PRODUCTION INTELLIGENCE */}
          <div className="space-y-6 pt-6 border-t border-white/5">
            <h5 className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500">
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Production Intelligence
            </h5>

            {/* Standard Data Points (Neutral) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="block text-[10px] text-gray-600 uppercase mb-1">
                  Bookouts
                </span>
                <p className="text-sm text-gray-300">
                  {display(actor.bookouts)}
                </p>
              </div>
              <div>
                <span className="block text-[10px] text-gray-600 uppercase mb-1">
                  Training
                </span>
                {/* UPDATED: Added whitespace-pre-wrap to respect line breaks */}
                <p className="text-sm text-gray-300 whitespace-pre-wrap">
                  {display(actor.training_notes)}
                </p>
              </div>
            </div>

            {/* The RED ZONE (Triggers Only) */}
            <div>
              <span className="block text-[10px] text-red-500/70 uppercase mb-2 flex items-center gap-2">
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                Content Boundaries
              </span>
              <div className="bg-red-950/20 border border-red-500/20 rounded p-3">
                <p className="text-sm text-red-200/80 italic">
                  {display(actor.triggers)}
                </p>
              </div>
            </div>
          </div>

          {/* FOOTER (Tech ID) */}
          <div className="mt-10 text-right">
            <span className="text-[9px] font-mono text-gray-700 tracking-widest opacity-50">
              SYS_REC_ID :: {actor.id}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActorModal;
