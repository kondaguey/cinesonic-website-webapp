"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const ThemeContext = createContext();

// 🟢 COLORS
export const THEME_COLORS = {
  GOLD: "#d4af37", // Standard / Solo
  PINK: "#ff3399", // Dual
  FIRE: "#ff4500", // Duet
  CYAN: "#00f0ff", // Multi
  VIOLET: "#7c3aed", // Cinema / Drama (Static)
  SYSTEM: "#3b82f6", // Admin / Dashboard
};

// 🟢 HELPER: Determine Theme based on Project Format string
export const getProjectTheme = (formatString) => {
  if (!formatString) return THEME_COLORS.GOLD;
  const lower = formatString.toLowerCase();

  // If it's a Drama/Cinema -> VIOLET
  if (lower.includes("drama") || lower.includes("cinema")) {
    return THEME_COLORS.VIOLET;
  }

  // Otherwise -> GOLD (Standard)
  return THEME_COLORS.GOLD;
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("gold");
  const [isCinematic, setIsCinematic] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    // URL Logic
    const colorZones = {
      "/dual-audio-production": "pink",
      "/duet-audio-production": "fire",
      "/multicast-audio-production": "cyan",
      "/solo-audio-production": "gold",
    };

    const zoneTheme = colorZones[pathname];

    if (zoneTheme) {
      setTheme(zoneTheme);
    } else if (
      pathname.includes("/crewportal") ||
      pathname.includes("/dashboard")
    ) {
      // 🟢 DASHBOARD MODE: Default to System
      setTheme("system");
      setIsCinematic(false);
    } else {
      setTheme("gold");
      setIsCinematic(false);
    }
  }, [pathname]);

  const activeStyles = {
    color: isCinematic
      ? THEME_COLORS.VIOLET
      : THEME_COLORS[theme.toUpperCase()] || THEME_COLORS.GOLD,
  };

  return (
    <ThemeContext.Provider
      value={{ theme, setTheme, isCinematic, setIsCinematic, activeStyles }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

const FxSolo = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-[#d4af37] rounded-full blur-[50px] animate-[pulseGlow_4s_ease-in-out_infinite]" />
    {[...Array(8)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full animate-pulse"
        style={{
          width: Math.random() * 4 + 1 + "px",
          height: Math.random() * 4 + 1 + "px",
          backgroundColor: "#d4af37",
          top: Math.random() * 100 + "%",
          left: Math.random() * 100 + "%",
          opacity: Math.random() * 0.5 + 0.3,
          animationDuration: Math.random() * 2 + 1 + "s",
        }}
      />
    ))}
  </div>
);

const FxDual = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(6)].map((_, i) => (
      <div
        key={i}
        className="absolute text-[#ff3399] text-sm"
        style={{
          left: Math.random() * 80 + 10 + "%",
          bottom: "-20px",
          opacity: 0,
          animation: `floatUp ${Math.random() * 4 + 3}s ease-in-out infinite`,
          animationDelay: Math.random() * 2 + "s",
        }}
      >
        ♥
      </div>
    ))}
  </div>
);

const FxDuet = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(15)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full"
        style={{
          width: Math.random() * 3 + 1 + "px",
          height: Math.random() * 3 + 1 + "px",
          backgroundColor: "#ff4500",
          left: Math.random() * 100 + "%",
          bottom: "-20px",
          opacity: 0,
          animation: `riseFast ${Math.random() * 2 + 1}s linear infinite`,
          animationDelay: Math.random() * 2 + "s",
        }}
      />
    ))}
  </div>
);

const FxMulti = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(12)].map((_, i) => (
      <div
        key={i}
        className="absolute w-[1px] bg-[#00f0ff]"
        style={{
          height: Math.random() * 40 + 20 + "px",
          left: Math.random() * 100 + "%",
          bottom: "-50px",
          opacity: 0,
          animation: `warpUp ${Math.random() * 2 + 1.5}s linear infinite`,
          animationDelay: Math.random() * 2 + "s",
        }}
      />
    ))}
  </div>
);

export default function ProjectIntakeForm() {
  // 🟢 ACCESS THEME CONTROLLER
  const { setTheme } = useTheme();

  // --- STATE ---
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // Data Sources
  const [dropdowns, setDropdowns] = useState({
    genres: [],
    voiceTypes: [],
    ageRanges: [],
  });
  const [roster, setRoster] = useState([]);

  // Main Form Data
  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    project_title: "",
    word_count: "",
    style: "Narration",
    genres: "",
    notes: "",
    client_type: "", // Initially empty
  });

  // Dates
  const [dates, setDates] = useState(["", "", ""]);

  // Characters
  const emptyChar = {
    name: "",
    gender: "",
    age: "",
    style: "",
    preferredActorId: null,
  };
  const [characters, setCharacters] = useState([]);

  // UI State
  const [activeDropdownIndex, setActiveDropdownIndex] = useState(null);
  const [playingUrl, setPlayingUrl] = useState(null);
  const audioRef = useRef(null);

  // --- FETCH DATA ---
  useEffect(() => {
    async function fetchData() {
      try {
        const listsReq = supabase.from("lists_db").select("*");
        const rosterReq = supabase
          .from("actor_db")
          .select(
            "id, name, gender, voice_type, age_range, headshot_url, demo_url"
          )
          .eq("coming_soon", false)
          .order("name");

        const [listsRes, rosterRes] = await Promise.all([listsReq, rosterReq]);

        if (listsRes.error) throw listsRes.error;
        if (rosterRes.error) throw rosterRes.error;

        const genres = [
          ...new Set(listsRes.data.map((i) => i.genre).filter(Boolean)),
        ];
        const voiceTypes = [
          ...new Set(listsRes.data.map((i) => i.voice_type).filter(Boolean)),
        ];
        const ageRanges = [
          ...new Set(listsRes.data.map((i) => i.age_range).filter(Boolean)),
        ];

        setDropdowns({ genres, voiceTypes, ageRanges });
        setRoster(rosterRes.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  // --- AUDIO LOGIC ---
  const toggleAudio = (url) => {
    if (!url) return;
    if (playingUrl === url) {
      audioRef.current.pause();
      setPlayingUrl(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      setPlayingUrl(url);
      audioRef.current = new Audio(url);
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingUrl(null);
    }
  };

  // --- HANDLERS ---
  const handleServiceSelect = (type) => {
    setFormData((prev) => ({ ...prev, client_type: type }));

    // 🟢 DYNAMIC THEME SWITCHING (Triggers Navbar Change)
    if (type === "Solo") setTheme("gold");
    if (type === "Dual") setTheme("pink");
    if (type === "Duet") setTheme("fire");
    if (type === "Multi") setTheme("cyan");

    // Character Logic
    if (type === "Solo") setCharacters([emptyChar]);
    else if (type === "Dual" || type === "Duet")
      setCharacters([emptyChar, emptyChar]);
    else if (type === "Multi")
      setCharacters([emptyChar, emptyChar, emptyChar, emptyChar]);
  };

  const updateCharacter = (index, field, value) => {
    const newChars = [...characters];
    newChars[index][field] = value;
    if (field === "gender") newChars[index].preferredActorId = null;
    setCharacters(newChars);
    if (field === "preferredActorId") setActiveDropdownIndex(null);
  };

  const addCharacter = () => {
    if (characters.length < 6) setCharacters([...characters, emptyChar]);
  };
  const removeCharacter = (index) => {
    if (characters.length > 4)
      setCharacters(characters.filter((_, i) => i !== index));
  };

  const handleDateChange = (index, value) => {
    const newDates = [...dates];
    newDates[index] = value;
    setDates(newDates);
  };
  const getMinDate = (prevDateString) => {
    if (!prevDateString) return new Date().toISOString().split("T")[0];
    const d = new Date(prevDateString);
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validDates = dates.filter((d) => d !== "").join("|");

    try {
      const intakeId = "PRJ-" + Math.floor(1000 + Math.random() * 9000);

      // ENRICH CHARACTERS FOR DB
      const enrichedCharacters = characters.map((char) => {
        if (char.preferredActorId) {
          const actor = roster.find((r) => r.id === char.preferredActorId);
          return {
            ...char,
            preferredActorName: actor ? actor.name : "Unknown ID",
          };
        }
        return char;
      });

      const charDetailsString = JSON.stringify(enrichedCharacters);

      const { error } = await supabase.from("project_intake_db").insert([
        {
          intake_id: intakeId,
          client_type: formData.client_type,
          client_name: formData.client_name,
          email: formData.email,
          project_title: formData.project_title,
          word_count: formData.word_count || 0,
          style: formData.style,
          genres: formData.genres,
          timeline_prefs: validDates,
          notes: formData.notes,
          character_details: charDetailsString,
          status: "New",
        },
      ]);

      if (error) throw error;
      setSubmitStatus("success");
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- DYNAMIC BUTTON CONFIG ---
  const getButtonConfig = () => {
    switch (formData.client_type) {
      case "Solo":
        return {
          text: "Submit Solo Request",
          bg: "bg-[#d4af37]",
          shadow: "hover:shadow-[0_0_40px_rgba(212,175,55,0.6)]",
        };
      case "Dual":
        return {
          text: "Submit Dual Request",
          bg: "bg-[#ff3399]",
          shadow: "hover:shadow-[0_0_40px_rgba(255,51,153,0.6)]",
        };
      case "Duet":
        return {
          text: "Submit Duet Request",
          bg: "bg-[#ff4500]",
          shadow: "hover:shadow-[0_0_40px_rgba(255,69,0,0.6)]",
        };
      case "Multi":
        return {
          text: "Submit Multi-Cast Request",
          bg: "bg-[#00f0ff]",
          shadow: "hover:shadow-[0_0_40px_rgba(0,240,255,0.6)]",
        };
      default:
        return {
          text: "Initiate Sequence",
          bg: "bg-white",
          shadow: "hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]",
        };
    }
  };
  const btnConfig = getButtonConfig();

  // --- SUCCESS VIEW ---
  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-[#020010] flex items-center justify-center p-6 text-white text-center">
        <div className="max-w-md w-full bg-white/5 border border-green-500/30 p-10 rounded-2xl backdrop-blur-md">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-serif mb-4">Manifest Logged</h2>
          <p className="text-gray-400 mb-8">
            We have received your project specs. A producer will review the
            timeline and casting requirements shortly.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-green-500/20 text-green-400 border border-green-500/50 rounded-full hover:bg-green-500/30 transition"
          >
            Start New Project
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020010] text-white font-sans selection:bg-[#00f0ff]/30 py-24 px-4 sm:px-6">
      {/* 🟢 GLOBAL ANIMATION STYLES */}
      <style jsx global>{`
        @keyframes riseFast {
          0% {
            transform: translateY(0) scale(1);
            opacity: 0;
          }
          20% {
            opacity: 1;
          }
          100% {
            transform: translateY(-400px) scale(0);
            opacity: 0;
          }
        }
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          30% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-300px) rotate(20deg);
            opacity: 0;
          }
        }
        @keyframes warpUp {
          0% {
            transform: translateY(200px);
            opacity: 0;
          }
          20% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-600px);
            opacity: 0;
          }
        }
        @keyframes pulseGlow {
          0%,
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 0.15;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0.3;
          }
        }
      `}</style>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-4xl md:text-6xl font-serif mb-4">
            Production <span className="text-[#d4af37]">Intake</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Initialize your audiobook production. Select your format, define
            your characters, and lock in your timeline.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* 1. SERVICE SELECTION (ANIMATED CARDS) */}
          <section className="animate-fade-in-up">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Mic className="text-[#00f0ff]" /> Select Format
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                {
                  id: "Solo",
                  icon: Mic,
                  color: "#d4af37",
                  text: "1 Narrator",
                  fx: <FxSolo />,
                },
                {
                  id: "Dual",
                  icon: Users,
                  color: "#ff3399",
                  text: "2 Narrators (POV)",
                  fx: <FxDual />,
                },
                {
                  id: "Duet",
                  icon: Flame,
                  color: "#ff4500",
                  text: "Real-time Dialogue",
                  fx: <FxDuet />,
                },
                {
                  id: "Multi",
                  icon: Rocket,
                  color: "#00f0ff",
                  text: "Full Ensemble",
                  fx: <FxMulti />,
                },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleServiceSelect(s.id)}
                  className={`relative h-48 rounded-2xl border transition-all duration-300 overflow-hidden group text-left p-6 flex flex-col justify-end ${
                    formData.client_type === s.id
                      ? "shadow-2xl"
                      : "border-white/10 bg-[#0a0a15] hover:border-white/30"
                  }`}
                  style={{
                    borderColor: formData.client_type === s.id ? s.color : "",
                    backgroundColor:
                      formData.client_type === s.id ? `${s.color}10` : "",
                    boxShadow:
                      formData.client_type === s.id
                        ? `0 0 30px ${s.color}20`
                        : "",
                  }}
                >
                  {formData.client_type === s.id && s.fx}
                  <s.icon
                    className="mb-auto w-8 h-8 relative z-10"
                    style={{
                      color:
                        formData.client_type === s.id ? s.color : "#4b5563",
                    }}
                  />
                  <div className="relative z-10">
                    <h3 className="text-xl font-serif font-bold">{s.id}</h3>
                    <p className="text-xs text-gray-400 mt-1">{s.text}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* 2. PROJECT DETAILS */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm space-y-8 animate-fade-in-up">
            <h2 className="text-xl font-bold text-[#d4af37] flex items-center gap-2">
              <BookOpen className="text-[#d4af37]" /> Core Data
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">
                  Author / Client Name
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-4 focus:border-[#d4af37] focus:outline-none text-white"
                  placeholder="Jane Doe"
                  value={formData.client_name}
                  onChange={(e) =>
                    setFormData({ ...formData, client_name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">
                  Contact Email
                </label>
                <input
                  required
                  type="email"
                  className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-4 focus:border-[#d4af37] focus:outline-none text-white"
                  placeholder="jane@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">
                  Book Title
                </label>
                <input
                  required
                  type="text"
                  className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-4 focus:border-[#d4af37] focus:outline-none text-white"
                  placeholder="The Stars Above"
                  value={formData.project_title}
                  onChange={(e) =>
                    setFormData({ ...formData, project_title: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-500">
                  Genre
                </label>
                <select
                  className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-4 focus:border-[#d4af37] focus:outline-none appearance-none text-white"
                  value={formData.genres}
                  onChange={(e) =>
                    setFormData({ ...formData, genres: e.target.value })
                  }
                >
                  <option value="">Select Genre...</option>
                  {dropdowns.genres.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          {/* 3. DYNAMIC CHARACTERS WITH STICKY CASTING DROPDOWN */}
          {formData.client_type && (
            <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm animate-fade-in-up">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-xl font-bold text-[#00f0ff] flex items-center gap-2">
                  <User className="text-[#00f0ff]" /> Character Specs
                </h2>
                <span className="text-xs font-mono text-gray-500 border border-white/10 px-2 py-1 rounded bg-[#0a0a15]">
                  Slots: {characters.length}
                </span>
              </div>

              <div className="space-y-6">
                {characters.map((char, index) => {
                  const availableActors = roster.filter((a) => {
                    if (!char.gender) return false;
                    return (
                      (a.gender || "").toLowerCase() ===
                      char.gender.toLowerCase()
                    );
                  });

                  return (
                    <div
                      key={index}
                      className="p-6 bg-[#0a0a15] border border-white/10 rounded-2xl relative group"
                    >
                      {/* Top Row: Basic Info */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] uppercase text-gray-500">
                            Name
                          </label>
                          <input
                            type="text"
                            placeholder="Character Name"
                            className="w-full bg-transparent border-b border-white/10 focus:border-[#00f0ff] focus:outline-none py-2 text-white"
                            value={char.name}
                            onChange={(e) =>
                              updateCharacter(index, "name", e.target.value)
                            }
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] uppercase text-gray-500 text-[#00f0ff]">
                            Gender
                          </label>
                          <select
                            className="w-full bg-transparent border-b border-white/10 focus:border-[#00f0ff] focus:outline-none py-2 appearance-none text-white"
                            value={char.gender}
                            onChange={(e) =>
                              updateCharacter(index, "gender", e.target.value)
                            }
                          >
                            <option value="">Select Gender...</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                          </select>
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] uppercase text-gray-500">
                            Age Range
                          </label>
                          <select
                            className="w-full bg-transparent border-b border-white/10 focus:border-[#00f0ff] focus:outline-none py-2 appearance-none text-gray-300"
                            value={char.age}
                            onChange={(e) =>
                              updateCharacter(index, "age", e.target.value)
                            }
                          >
                            <option value="">Select Age...</option>
                            {dropdowns.ageRanges.map((a) => (
                              <option key={a} value={a}>
                                {a}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="flex-1 space-y-1">
                          <label className="text-[10px] uppercase text-gray-500">
                            Vocal Style
                          </label>
                          <select
                            className="w-full bg-transparent border-b border-white/10 focus:border-[#00f0ff] focus:outline-none py-2 appearance-none text-gray-300"
                            value={char.style}
                            onChange={(e) =>
                              updateCharacter(index, "style", e.target.value)
                            }
                          >
                            <option value="">Select Style...</option>
                            {dropdowns.voiceTypes.map((v) => (
                              <option key={v} value={v}>
                                {v}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      {/* --- CASTING DROPDOWN (STICKY) --- */}
                      <div className="mt-4 pt-4 border-t border-white/5">
                        <div className="relative">
                          <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
                            <span>Have a specific actor in mind?</span>
                            {!char.gender && (
                              <span className="text-red-500/50 italic">
                                (Select Gender above to browse roster)
                              </span>
                            )}
                          </div>

                          {/* BACKDROP TO CLOSE */}
                          {activeDropdownIndex === index && (
                            <div
                              className="fixed inset-0 z-40"
                              onClick={() => setActiveDropdownIndex(null)}
                            />
                          )}

                          {/* TRIGGER BAR */}
                          <div
                            className={`relative z-50 w-full bg-white/5 border border-white/10 rounded-lg p-3 flex items-center justify-between cursor-pointer transition-colors ${
                              !char.gender
                                ? "opacity-50 cursor-not-allowed"
                                : "hover:border-[#00f0ff]/50"
                            }`}
                            onClick={() => {
                              if (char.gender)
                                setActiveDropdownIndex(
                                  activeDropdownIndex === index ? null : index
                                );
                            }}
                          >
                            {char.preferredActorId ? (
                              (() => {
                                const a = roster.find(
                                  (r) => r.id === char.preferredActorId
                                );
                                return a ? (
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={a.headshot_url}
                                      alt={a.name}
                                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                                    />
                                    <span className="text-[#00f0ff] font-bold">
                                      {a.name}
                                    </span>
                                  </div>
                                ) : (
                                  <span>Select from Roster...</span>
                                );
                              })()
                            ) : (
                              <span className="text-gray-400 italic">
                                Browse available {char.gender || ""} actors...
                              </span>
                            )}
                            <ChevronDown
                              size={16}
                              className={`text-gray-500 transition-transform ${
                                activeDropdownIndex === index
                                  ? "rotate-180"
                                  : ""
                              }`}
                            />
                          </div>

                          {/* DROPDOWN MENU */}
                          {activeDropdownIndex === index && (
                            <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-[#050510] border border-[#00f0ff]/30 rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.9)] max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
                              {availableActors.length > 0 ? (
                                availableActors.map((actor) => (
                                  <div
                                    key={actor.id}
                                    className="p-3 border-b border-white/5 hover:bg-white/5 flex items-center justify-between group/item transition-colors"
                                  >
                                    <div
                                      className="flex items-center gap-3 flex-1 cursor-pointer"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateCharacter(
                                          index,
                                          "preferredActorId",
                                          actor.id
                                        );
                                      }}
                                    >
                                      <img
                                        src={
                                          actor.headshot_url ||
                                          "https://placehold.co/50"
                                        }
                                        className="w-10 h-10 rounded-full object-cover"
                                      />
                                      <div>
                                        <div className="text-sm font-bold text-white group-hover/item:text-[#00f0ff]">
                                          {actor.name}
                                        </div>
                                        <div className="text-[10px] text-gray-500">
                                          {actor.age_range} •{" "}
                                          {actor.voice_type
                                            ? actor.voice_type.replace(
                                                /[\[\]"]/g,
                                                ""
                                              )
                                            : "Voice Actor"}
                                        </div>
                                      </div>
                                    </div>
                                    {actor.demo_url && (
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleAudio(actor.demo_url);
                                        }}
                                        className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#00f0ff] hover:text-black flex items-center justify-center transition-all z-50"
                                      >
                                        {playingUrl === actor.demo_url ? (
                                          <Pause
                                            size={12}
                                            fill="currentColor"
                                          />
                                        ) : (
                                          <Play size={12} fill="currentColor" />
                                        )}
                                      </button>
                                    )}
                                  </div>
                                ))
                              ) : (
                                <div className="p-4 text-center text-gray-500 text-xs">
                                  No {char.gender} actors currently revealed in
                                  roster.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Delete Button (Multi Only) */}
                      {formData.client_type === "Multi" && index >= 4 && (
                        <button
                          type="button"
                          onClick={() => removeCharacter(index)}
                          className="absolute top-2 right-2 text-red-500/50 hover:text-red-500"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ADD BUTTON */}
              {formData.client_type === "Multi" && characters.length < 6 && (
                <button
                  type="button"
                  onClick={addCharacter}
                  className="mt-6 w-full py-4 border border-dashed border-white/20 rounded-2xl text-gray-400 hover:border-[#00f0ff] hover:text-[#00f0ff] hover:bg-[#00f0ff]/5 transition flex items-center justify-center gap-2 group"
                >
                  <Plus
                    size={18}
                    className="group-hover:rotate-90 transition-transform"
                  />{" "}
                  Add Additional Character Slot
                </button>
              )}
            </section>
          )}

          {/* 4. TIMELINE */}
          <section className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-sm animate-fade-in-up">
            <h2 className="text-xl font-bold text-gray-200 mb-2 flex items-center gap-2">
              <Calendar className="text-gray-400" /> Production Timeline
            </h2>
            <p className="text-sm text-gray-500 mb-8 max-w-2xl">
              Please select 3 potential start dates.{" "}
              <span className="text-[#d4af37] font-bold">
                Ensure dates are at least 30 days apart.
              </span>
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              {[0, 1, 2].map((idx) => {
                const label =
                  idx === 0
                    ? "Priority Option 1"
                    : `Option ${idx + 1} (+30 Days)`;
                const min =
                  idx === 0
                    ? new Date().toISOString().split("T")[0]
                    : getMinDate(dates[idx - 1]);
                const disabled = idx > 0 && !dates[idx - 1];
                return (
                  <div
                    key={idx}
                    className={`bg-[#0a0a15] p-4 rounded-xl border ${
                      !disabled
                        ? "border-white/10"
                        : "border-white/5 opacity-50"
                    }`}
                  >
                    <label
                      className={`text-[10px] uppercase tracking-widest mb-2 block ${
                        idx === 0 ? "text-[#d4af37]" : "text-gray-400"
                      }`}
                    >
                      {label}
                    </label>
                    <input
                      type="date"
                      required
                      disabled={disabled}
                      min={min}
                      className="w-full bg-transparent text-white focus:outline-none text-sm disabled:cursor-not-allowed"
                      value={dates[idx]}
                      onChange={(e) => handleDateChange(idx, e.target.value)}
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* DISCLAIMERS & SUBMIT */}
          <div className="pt-8 border-t border-white/10 animate-fade-in-up">
            <div className="flex gap-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl mb-8">
              <AlertCircle className="text-amber-500 shrink-0" size={20} />
              <p className="text-xs text-amber-500/80 leading-relaxed">
                <strong>Conflict of Interest Disclosure:</strong> CineSonic
                ownership consists of working professional narrators. To
                maintain industry ethics, we will not cast any actor currently
                engaged with a production company that our owners actively
                narrate for.
              </p>
            </div>

            <div className="text-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full max-w-md mx-auto py-4 text-black font-bold text-lg uppercase tracking-[0.2em] rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed ${btnConfig.bg} ${btnConfig.shadow}`}
              >
                {isSubmitting ? "Transmitting..." : btnConfig.text}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
