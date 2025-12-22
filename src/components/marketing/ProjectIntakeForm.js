"use client";

import React, { useState, useEffect, useMemo } from "react";
import { createClient } from "@supabase/supabase-js";
import { useTheme } from "../ui/ThemeContext";

// UI COMPONENTS
import ProjectSelectionCard from "./ProjectSelectionCard";
import CineSonicToggle from "../ui/CineSonicToggle";
import PopupSelection from "../ui/PopupSelection";

// ICONS
import {
  User,
  BookOpen,
  Mic,
  Calendar,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Star,
  Music,
  Users,
  Rocket,
  Flame,
  Zap,
  CheckCircle,
  Check,
  Sparkles,
  Heart,
  Layers,
  Settings2,
  Clock,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- MATCHMAKER ALGO ---
export function runCreativeMatch(role, roster) {
  if (!roster || !role) return [];
  const roleGender = (role["Gender"] || "any").toLowerCase().trim();
  const roleAge = (role["Age Range"] || "").toLowerCase().trim();
  const roleSpecs = (role["Vocal Specs"] || "").toLowerCase();

  let requestedActorName = null;
  if (roleSpecs.includes("client request:")) {
    const parts = roleSpecs.split("client request:");
    if (parts[1])
      requestedActorName = parts[1].replace(/\*\*/g, "").trim().toLowerCase();
  }

  let candidates = roster.filter((actor) => {
    const actorGender = (actor.gender || "").toLowerCase().trim();
    if (["any", "tbd", ""].includes(roleGender)) return true;
    if (roleGender === "male")
      return actorGender.includes("male") && !actorGender.includes("female");
    if (roleGender === "female") return actorGender.includes("female");
    return actorGender === roleGender;
  });

  const scoredCandidates = candidates.map((actor) => {
    if (requestedActorName && actor.name.toLowerCase() === requestedActorName) {
      return { actor: actor, score: 100, isRequested: true };
    }
    let score = 0;
    const actorAges = (actor.ages || actor.age_range || "").toLowerCase();
    const actorVoice = (actor.voice || "").toLowerCase();
    const actorGenres = (actor.genres || "").toLowerCase();

    if (roleAge && actorAges.includes(roleAge)) score += 60;
    const keywords = roleSpecs.split(/[\s,.-]+/).filter((k) => k.length > 3);

    keywords.forEach((word) => {
      if (word === "client" || word === "request") return;
      if (actorVoice.includes(word)) score += 15;
      if (actorGenres.includes(word)) score += 10;
    });

    return { actor: actor, score: Math.min(score + 5, 99) };
  });

  return scoredCandidates.sort((a, b) => b.score - a.score);
}

export default function ProjectIntakeForm() {
  const { setTheme, activeColor, activeStyles, isCinematic, baseColor } =
    useTheme();
  const shimmerClass = activeStyles?.shimmer || "";

  // STATE: Flow Control
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  // STATE: Modals
  const [isScoutOpen, setIsScoutOpen] = useState(false);
  const [scoutTargetIndex, setScoutTargetIndex] = useState(null);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);

  // WIRED: Modal States for Specs
  const [voiceTypeModalIdx, setVoiceTypeModalIdx] = useState(null);
  const [ageModalIdx, setAgeModalIdx] = useState(null);
  const [accentModalIdx, setAccentModalIdx] = useState(null);

  // STATE: DB Data
  const [dropdowns, setDropdowns] = useState({
    genres: [],
    vocalQualities: [],
    ageRanges: [],
    accents: [],
  });
  const [roster, setRoster] = useState([]);

  // STATE: Form Data
  const [optIn, setOptIn] = useState(false);
  const [formData, setFormData] = useState({
    client_name: "",
    email: "",
    project_title: "",
    word_count: "",
    style: "Narration",
    genres: [],
    notes: "",
    client_type: "",
    base_format: "",
    price_tier: "",
  });
  const [dates, setDates] = useState(["", ""]);
  const [openCalendarIdx, setOpenCalendarIdx] = useState(null);
  const [characters, setCharacters] = useState([]);

  // 🛠️ 30-Day Logic
  const getMinDate = (prevDateStr) => {
    if (!prevDateStr) return new Date();
    const d = new Date(prevDateStr);
    d.setDate(d.getDate() + 30);
    return d;
  };

  // 1. DYNAMIC DATA FETCH
  useEffect(() => {
    async function fetchData() {
      // Fetch Lists
      const { data: listData } = await supabase
        .from("lists")
        .select("category, label")
        .order("sort_order", { ascending: true });

      if (listData) {
        setDropdowns({
          genres: listData
            .filter((i) => i.category === "genre")
            .map((i) => i.label),
          vocalQualities: listData
            .filter((i) => i.category === "vocal_quality")
            .map((i) => i.label),
          ageRanges: listData
            .filter((i) => i.category === "age_range")
            .map((i) => i.label),
          accents: listData
            .filter((i) => i.category === "accent")
            .map((i) => i.label),
        });
      }

      // Fetch Roster
      const { data: rosterData } = await supabase
        .from("actor_roster_public")
        .select(
          "id, display_name, headshot_url, voice_types, genres, age_ranges"
        )
        .order("display_name");

      if (rosterData) {
        setRoster(
          rosterData.map((r) => ({
            id: r.id,
            name: r.display_name,
            headshot_url: r.headshot_url,
            gender: r.display_name.toLowerCase().includes("actor")
              ? "male"
              : "any",
            voice: r.voice_types?.join(" ") || "",
            genres: r.genres?.join(" ") || "",
            age_range: r.age_ranges?.join(" ") || "",
          }))
        );
      }
    }
    fetchData();
  }, []);

  // 2. FORM HELPERS
  const updateCharacter = (index, field, value) => {
    setCharacters((prev) =>
      prev.map((char, i) => (i === index ? { ...char, [field]: value } : char))
    );
  };

  const toggleCharVoice = (charIdx, vq) => {
    setCharacters((prev) =>
      prev.map((char, i) => {
        if (i !== charIdx) return char;
        const current = char.voiceTypes || [];
        return current.includes(vq)
          ? { ...char, voiceTypes: current.filter((x) => x !== vq) }
          : { ...char, voiceTypes: [...current, vq].slice(0, 3) };
      })
    );
  };

  const handleWordCountChange = (e) => {
    // 🛠️ Fix: Strip non-numeric characters to prevent loop
    const raw = e.target.value.replace(/[^0-9]/g, "");
    setFormData({ ...formData, word_count: raw });
  };

  const handleServiceSelect = (id, baseType) => {
    const opt = serviceBase.find((o) => o.baseType === baseType);
    setFormData((prev) => ({
      ...prev,
      client_type: id,
      base_format: baseType,
      price_tier: isCinematic ? opt.dramaPrice : opt.standardPrice,
    }));
    setTheme(
      { Solo: "gold", Dual: "pink", Duet: "fire", Multi: "cyan" }[baseType]
    );
    const slots = baseType === "Solo" ? 1 : baseType === "Multi" ? 4 : 2;
    setCharacters(
      Array(slots)
        .fill(0)
        .map(() => ({
          name: "",
          gender: "",
          age: "",
          accent: "",
          voiceTypes: [],
          preferredActorId: null,
        }))
    );
  };

  const formatCommas = (val) =>
    val ? val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";

  const duration = useMemo(() => {
    const count = parseInt(formData.word_count) || 0;
    if (count === 0) return null;
    const totalHours = count / 9300;
    return {
      hours: Math.floor(totalHours),
      minutes: Math.round((totalHours % 1) * 60),
      total: totalHours.toFixed(2),
    };
  }, [formData.word_count]);

  // 3. SUBMISSION
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const { error } = await supabase.from("project_intake").insert([
        {
          client_name: formData.client_name,
          client_email: formData.email,
          client_type: formData.client_type,
          project_title: formData.project_title,
          word_count: parseInt(formData.word_count) || 0,
          style: formData.style,
          genres: formData.genres,
          base_format: formData.base_format,
          price_tier: formData.price_tier,
          is_cinematic: isCinematic,
          opt_in: optIn,
          notes: formData.notes,
          start_date_1: dates[0] || null,
          start_date_2: dates[1] || null,
          status: "NEW",
          character_details: characters.map((c) => ({
            name: c.name || "TBD",
            gender: c.gender || "Any",
            age: c.age || "Any",
            accent: c.accent || "General American",
            vocal_qualities: c.voiceTypes || [],
            actor_request: c.preferredActorId || null,
          })),
        },
      ]);

      if (error) throw error;
      setSubmitStatus("success");
    } catch (err) {
      console.error("Submission Error:", err);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };
  const serviceBase = [
    {
      baseType: "Solo",
      icon: Mic,
      dramaIcon: Music,
      standardTitle: "Solo Audiobook",
      dramaTitle: "Solo Audio Drama",
      standardDesc: "1 Narrator. Classic.",
      dramaDesc: "1 Narrator + SFX.",
      standardPrice: "$", // 🟢 NEW
      dramaPrice: "$$$", // 🟢 NEW
    },
    {
      baseType: "Dual",
      icon: Users,
      dramaIcon: Heart,
      standardTitle: "Dual Audiobook",
      dramaTitle: "Dual Audio Drama",
      standardDesc: "2 Narrators (POV).",
      dramaDesc: "POV + Cinematic FX.",
      standardPrice: "$$", // 🟢 NEW
      dramaPrice: "$$$$", // 🟢 NEW
    },
    {
      baseType: "Duet",
      icon: Flame,
      dramaIcon: Zap,
      standardTitle: "Duet Audiobook",
      dramaTitle: "Duet Audio Drama",
      standardDesc: "Real-time Dialogue.",
      dramaDesc: "Dialogue + Score.",
      standardPrice: "$$$", // 🟢 NEW
      dramaPrice: "$$$$$", // 🟢 NEW
    },
    {
      baseType: "Multi",
      icon: Rocket,
      dramaIcon: Sparkles,
      standardTitle: "Multi-Cast",
      dramaTitle: "Cinematic Drama",
      standardDesc: "Full Ensemble.",
      dramaDesc: "Movie for Ears.",
      standardPrice: "$$$$", // 🟢 NEW
      dramaPrice: "$x6", // 🟢 NEW
    },
  ];

  if (submitStatus === "success")
    return (
      <div className="min-h-screen bg-[#020010] flex items-center justify-center p-6 text-center relative overflow-hidden">
        <ParticleFx mode="hero" vector="solo" forceTheme="system" />
        <div className="max-w-md w-full glass-panel p-10 relative z-10 border-green-500/30">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-serif mb-4 text-white">
            Manifest Logged
          </h2>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-3 rounded-full border border-white/20 text-white hover:bg-white/10 transition-all text-xs font-bold uppercase tracking-widest"
          >
            New Manifest
          </button>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen relative py-8 md:py-12 transition-colors duration-1000 overflow-hidden">
      <div
        className="absolute inset-0 z-0 transition-all duration-1000"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${activeColor}15 0%, transparent 70%)`,
        }}
      />
      <div className="w-full md:max-w-5xl mx-auto relative z-10 px-4">
        <div className="text-center mb-10">
          <h1
            className={`text-4xl md:text-7xl font-serif mb-4 transition-all duration-500 ${
              isCinematic ? shimmerClass : ""
            }`}
            style={{ color: !isCinematic ? baseColor : undefined }}
          >
            Production Intake
          </h1>
          <CineSonicToggle />
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* SERVICE SELECTION */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceBase.map((opt) => (
              <ProjectSelectionCard
                key={opt.baseType}
                id={isCinematic ? opt.dramaTitle : opt.standardTitle}
                title={isCinematic ? opt.dramaTitle : opt.standardTitle}
                desc={isCinematic ? opt.dramaDesc : opt.standardDesc}
                icon={isCinematic ? opt.dramaIcon : opt.icon}
                baseType={opt.baseType}
                isDrama={isCinematic}
                // 🟢 UI UPDATE: Display price based on mode
                price={isCinematic ? opt.dramaPrice : opt.standardPrice}
                isSelected={formData.base_format === opt.baseType}
                onSelect={handleServiceSelect}
              />
            ))}
          </section>

          {/* TITLE INFO */}
          <section
            className="bg-[#050510]/80 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md space-y-6"
            style={{ borderColor: `${activeColor}30` }}
          >
            <h2
              className="text-xl font-bold flex items-center gap-3"
              style={{ color: activeColor }}
            >
              <BookOpen size={20} /> Title Core Info
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                required
                placeholder="Author / Client"
                className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-6 text-white outline-none focus:border-white/30 transition-all"
                value={formData.client_name}
                onChange={(e) =>
                  setFormData({ ...formData, client_name: e.target.value })
                }
              />
              <input
                required
                type="email"
                placeholder="Contact Email"
                className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-6 text-white outline-none focus:border-white/30 transition-all"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                required
                placeholder="Project Title"
                className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-6 text-white outline-none focus:border-white/30 transition-all"
                value={formData.project_title}
                onChange={(e) =>
                  setFormData({ ...formData, project_title: e.target.value })
                }
              />
              <div className="space-y-2">
                <div className="relative">
                  <input
                    required
                    type="text"
                    inputMode="numeric"
                    className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-6 text-white font-mono outline-none focus:border-white/30 transition-all"
                    value={formatCommas(formData.word_count)}
                    onChange={handleWordCountChange}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-500 font-black tracking-widest">
                    WORDS
                  </div>
                </div>
                {duration && (
                  <div className="px-2 animate-in fade-in slide-in-from-top-1 duration-500">
                    <span
                      className="text-[10px] font-mono uppercase tracking-widest flex items-center gap-2"
                      style={{ color: activeColor }}
                    >
                      <Clock size={12} />{" "}
                      {duration.hours > 0 && `${duration.hours}h `}
                      {duration.minutes}m runtime{" "}
                      <span className="text-gray-600 ml-1">
                        ({duration.total} PFH)
                      </span>
                    </span>
                  </div>
                )}
              </div>
              <div className="md:col-span-2">
                <button
                  type="button"
                  onClick={() => setIsGenreModalOpen(true)}
                  className="w-full flex items-center justify-between bg-[#0a0a15] border border-white/10 rounded-xl py-4 px-6 text-white text-sm hover:border-white/30 transition-all"
                >
                  <div className="flex gap-2 flex-wrap">
                    {formData.genres.length > 0 ? (
                      formData.genres.map((g) => (
                        <span
                          key={g}
                          className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-white/70"
                        >
                          {g}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500 italic">
                        Select Project Genres...
                      </span>
                    )}
                  </div>
                  <Settings2 size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          </section>

          {/* CHARACTER SPECS */}
          {formData.base_format && (
            <section
              className="glass-panel p-6 md:p-8"
              style={{ borderColor: `${activeColor}30` }}
            >
              <h2 className="text-xl font-bold flex items-center gap-3 text-white mb-6">
                <User size={20} style={{ color: activeColor }} /> Character
                Specs
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {characters.map((char, index) => (
                  <div
                    key={index}
                    className="p-6 border border-white/5 rounded-2xl bg-[#0a0a15] relative group/card"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        placeholder="Role Name"
                        className="col-span-2 bg-transparent border-b border-white/10 py-1 text-white outline-none focus:border-white/40 transition-all"
                        value={char.name}
                        onChange={(e) =>
                          updateCharacter(index, "name", e.target.value)
                        }
                      />

                      <select
                        className="bg-[#0d0d1a] border border-white/10 rounded-lg p-2 text-gray-400 text-xs outline-none focus:border-white/30 transition-all cursor-pointer hover:bg-white/5"
                        value={char.gender}
                        onChange={(e) =>
                          updateCharacter(index, "gender", e.target.value)
                        }
                      >
                        <option value="">Gender...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => setAgeModalIdx(index)}
                        className="bg-[#0d0d1a] border border-white/10 rounded-lg p-2 text-xs text-left flex justify-between items-center transition-all hover:border-white/30 hover:bg-white/5 cursor-pointer active:scale-[0.98] group"
                      >
                        <span
                          className={`truncate ${
                            char.age ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {char.age || "Age..."}
                        </span>
                        <ChevronRightIcon
                          size={12}
                          className="text-gray-600 group-hover:text-white transition-colors rotate-90"
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() => setAccentModalIdx(index)}
                        className="col-span-2 bg-[#0d0d1a] border border-white/10 rounded-lg p-2 text-xs text-left flex justify-between items-center transition-all hover:border-white/30 hover:bg-white/5 cursor-pointer active:scale-[0.98] group"
                      >
                        <span
                          className={`truncate ${
                            char.accent ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {char.accent || "Specific Accent..."}
                        </span>
                        <ChevronRightIcon
                          size={12}
                          className="text-gray-600 group-hover:text-white transition-colors rotate-90"
                        />
                      </button>
                    </div>

                    <div className="mb-6">
                      <label className="text-[9px] uppercase text-gray-600 font-bold block mb-2 tracking-widest">
                        Vocal Qualities (Max 3)
                      </label>
                      <button
                        type="button"
                        onClick={() => setVoiceTypeModalIdx(index)}
                        className="w-full flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-xl py-2.5 px-4 text-white text-xs hover:border-white/20 transition-all"
                      >
                        <div className="flex gap-1 flex-wrap">
                          {char.voiceTypes?.length > 0 ? (
                            char.voiceTypes.map((v) => (
                              <span
                                key={v}
                                className="bg-white/5 px-1.5 py-0.5 rounded text-[9px] text-white/50"
                              >
                                {v}
                              </span>
                            ))
                          ) : (
                            <span className="text-gray-600 italic">
                              Select qualities...
                            </span>
                          )}
                        </div>
                        <Layers size={14} className="text-gray-600" />
                      </button>
                    </div>

                    <button
                      type="button"
                      className={`w-full bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between transition-all ${
                        !char.gender
                          ? "opacity-30 cursor-not-allowed"
                          : "hover:bg-white/10"
                      }`}
                      onClick={() => {
                        if (char.gender) {
                          setScoutTargetIndex(index);
                          setIsScoutOpen(true);
                        }
                      }}
                    >
                      {char.preferredActorId ? (
                        <span className="text-white text-xs font-bold flex items-center gap-2">
                          <Star size={12} className="fill-white" /> Talent
                          Preference Noted
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs flex items-center gap-2">
                          <Star size={14} /> Scout Casting...
                        </span>
                      )}
                      <ChevronRightIcon size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* TIMELINE */}
          <section
            className="bg-[#050510]/80 border border-white/10 rounded-3xl p-6 backdrop-blur-md relative z-[50]"
            style={{ borderColor: `${activeColor}30` }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                <Calendar size={20} style={{ color: activeColor }} /> Preferred
                Timeline
              </h2>
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <AlertTriangle size={14} className="text-yellow-500" />
                <span className="text-[9px] uppercase tracking-tighter text-gray-400 leading-tight">
                  Casting Window: Options must be{" "}
                  <span className="text-white font-bold">30 days apart</span>.
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[0, 1].map((idx) => {
                // 🔒 LOCKING LOGIC: If idx=1 (Option 2), verify Date 1 exists.
                const isLocked = idx > 0 && !dates[idx - 1];

                return (
                  <div key={idx} className="relative">
                    <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block tracking-widest">
                      Option 0{idx + 1}
                    </label>
                    <button
                      type="button"
                      disabled={isLocked}
                      onClick={() =>
                        setOpenCalendarIdx(openCalendarIdx === idx ? null : idx)
                      }
                      className={`w-full bg-[#0a0a15] p-4 rounded-xl border border-white/10 text-left text-xs flex justify-between items-center text-white transition-all ${
                        isLocked
                          ? "opacity-30 cursor-not-allowed pointer-events-none"
                          : "hover:border-white/30"
                      }`}
                    >
                      {dates[idx] ? (
                        <span className="font-mono">{dates[idx]}</span>
                      ) : (
                        <span className="text-gray-600">
                          {isLocked
                            ? "Select Option 01 First..."
                            : "Select Start Date..."}
                        </span>
                      )}
                      <Calendar size={16} />
                    </button>
                    {!isLocked && openCalendarIdx === idx && (
                      <div className="absolute bottom-full left-0 z-[100] mb-3 w-full bg-[#0d0d1a] border border-white/20 rounded-2xl p-4 shadow-2xl animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl">
                        <ThemedCalendar
                          activeColor={activeColor}
                          minDate={
                            idx === 0 ? new Date() : getMinDate(dates[idx - 1])
                          }
                          onSelect={(d) => {
                            const n = [...dates];
                            n[idx] = d;
                            setDates(n);
                            setOpenCalendarIdx(null);
                          }}
                          selectedDate={dates[idx]}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>

          {/* SUBMIT */}
          <div className="space-y-6">
            <div
              className="flex items-center gap-3 px-2 cursor-pointer group"
              onClick={() => setOptIn(!optIn)}
            >
              <div
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all duration-300 ${
                  optIn
                    ? "bg-white border-white"
                    : "bg-transparent border-white/30 group-hover:border-white/50"
                }`}
              >
                {optIn && <Check size={14} className="text-black stroke-[3]" />}
              </div>
              <span className="text-xs text-gray-400 select-none">
                Join the{" "}
                <span className="text-white font-medium">
                  Production Insider
                </span>{" "}
                newsletter.
              </span>
            </div>
            <button
              type="submit"
              disabled={isSubmitting || !formData.base_format}
              className="w-full md:max-w-md mx-auto block py-3.5 rounded-full text-black font-bold uppercase tracking-[0.2em] text-xs transition-all hover:scale-[1.01] shadow-2xl disabled:opacity-30"
              style={{ backgroundColor: activeColor }}
            >
              {isSubmitting
                ? "Transmitting Manifest..."
                : "Initialize Production Engine"}
            </button>
          </div>
        </form>

        {/* --- MODALS (NO WRAPPER DIVS FOR SORTING) --- */}

        {/* 1. GENRES */}
        <PopupSelection
          isOpen={isGenreModalOpen}
          onClose={() => setIsGenreModalOpen(false)}
          title="Project Genre"
          activeColor={activeColor}
          currentCount={formData.genres.length}
          maxCount={3}
        >
          {dropdowns.genres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() =>
                setFormData((p) => ({
                  ...p,
                  genres: p.genres.includes(g)
                    ? p.genres.filter((x) => x !== g)
                    : [...p.genres, g].slice(0, 3),
                }))
              }
              className={`px-4 py-2 rounded-xl text-xs border transition-all ${
                formData.genres.includes(g)
                  ? "text-black font-bold border-transparent"
                  : "border-white/10 text-gray-400 hover:bg-white/5"
              }`}
              style={{
                backgroundColor: formData.genres.includes(g)
                  ? activeColor
                  : undefined,
              }}
            >
              {g}
            </button>
          ))}
        </PopupSelection>

        {/* 2. VOCAL QUALITIES */}
        <PopupSelection
          isOpen={voiceTypeModalIdx !== null}
          onClose={() => setVoiceTypeModalIdx(null)}
          title="Vocal Qualities"
          activeColor={activeColor}
          currentCount={
            voiceTypeModalIdx !== null
              ? characters[voiceTypeModalIdx]?.voiceTypes?.length || 0
              : 0
          }
          maxCount={3}
        >
          {dropdowns.vocalQualities.map((vq) => (
            <button
              key={vq}
              type="button"
              onClick={() => toggleCharVoice(voiceTypeModalIdx, vq)}
              className={`px-4 py-2 rounded-xl text-xs border transition-all ${
                voiceTypeModalIdx !== null &&
                characters[voiceTypeModalIdx]?.voiceTypes?.includes(vq)
                  ? "text-black font-bold border-transparent"
                  : "border-white/10 text-gray-400 hover:bg-white/5"
              }`}
              style={{
                backgroundColor:
                  voiceTypeModalIdx !== null &&
                  characters[voiceTypeModalIdx]?.voiceTypes?.includes(vq)
                    ? activeColor
                    : undefined,
              }}
            >
              {vq}
            </button>
          ))}
        </PopupSelection>

        {/* 3. AGE RANGES */}
        <PopupSelection
          isOpen={ageModalIdx !== null}
          onClose={() => setAgeModalIdx(null)}
          title="Character Age"
          activeColor={activeColor}
          currentCount={
            ageModalIdx !== null && characters[ageModalIdx]?.age ? 1 : 0
          }
          maxCount={1}
        >
          {dropdowns.ageRanges.map((age) => (
            <button
              key={age}
              type="button"
              onClick={() => {
                updateCharacter(ageModalIdx, "age", age);
                setAgeModalIdx(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs border transition-all ${
                ageModalIdx !== null && characters[ageModalIdx].age === age
                  ? "text-black font-bold border-transparent"
                  : "border-white/10 text-gray-400 hover:bg-white/5"
              }`}
              style={{
                backgroundColor:
                  ageModalIdx !== null && characters[ageModalIdx].age === age
                    ? activeColor
                    : undefined,
              }}
            >
              {age}
            </button>
          ))}
        </PopupSelection>

        {/* 4. ACCENTS */}
        <PopupSelection
          isOpen={accentModalIdx !== null}
          onClose={() => setAccentModalIdx(null)}
          title="Character Accent"
          activeColor={activeColor}
          currentCount={
            accentModalIdx !== null && characters[accentModalIdx]?.accent
              ? 1
              : 0
          }
          maxCount={1}
        >
          {dropdowns.accents.map((acc) => (
            <button
              key={acc}
              type="button"
              onClick={() => {
                updateCharacter(accentModalIdx, "accent", acc);
                setAccentModalIdx(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs border transition-all ${
                accentModalIdx !== null &&
                characters[accentModalIdx].accent === acc
                  ? "text-black font-bold border-transparent"
                  : "border-white/10 text-gray-400 hover:bg-white/5"
              }`}
              style={{
                backgroundColor:
                  accentModalIdx !== null &&
                  characters[accentModalIdx].accent === acc
                    ? activeColor
                    : undefined,
              }}
            >
              {acc}
            </button>
          ))}
        </PopupSelection>

        {/* 5. SCOUT */}
        <PopupSelection
          isOpen={isScoutOpen}
          onClose={() => setIsScoutOpen(false)}
          title="CineSonic Talent Scout"
          activeColor={activeColor}
          currentCount={
            scoutTargetIndex !== null &&
            characters[scoutTargetIndex]?.preferredActorId
              ? 1
              : 0
          }
          maxCount={1}
        >
          {scoutTargetIndex !== null && (
            <div className="space-y-3">
              <ScoutResultsList
                roster={roster}
                character={characters[scoutTargetIndex]}
                formData={formData}
                onSelect={(id) => {
                  updateCharacter(scoutTargetIndex, "preferredActorId", id);
                  setIsScoutOpen(false);
                }}
                activeColor={activeColor}
              />
            </div>
          )}
        </PopupSelection>
      </div>
    </div>
  );
}

// --- HELPER COMPONENTS ---
function ScoutResultsList({ roster, character, formData, onSelect }) {
  const matchResults = useMemo(
    () =>
      runCreativeMatch(
        {
          Gender: character?.gender || "any",
          "Age Range": character?.age || "",
          "Vocal Specs": `${formData.style} ${formData.notes} ${
            character?.voiceTypes?.join(" ") || ""
          }`,
        },
        roster
      ),
    [character, roster, formData]
  );
  return matchResults.map(({ actor, score }) => (
    <div
      key={actor.id}
      className="flex items-center gap-4 p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all cursor-pointer group"
      onClick={() => onSelect(actor.id)}
    >
      <img
        src={actor.headshot_url}
        className="w-14 h-14 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
        alt="Actor"
      />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h4 className="text-white font-serif text-lg truncate tracking-wide">
            {actor.name}
          </h4>
          <div className="px-2 py-0.5 rounded-md border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-[9px] font-black uppercase tracking-tighter">
            {score}% MATCH
          </div>
        </div>
      </div>
      <ChevronRightIcon size={16} className="text-gray-600" />
    </div>
  ));
}

function ThemedCalendar({ activeColor, minDate, onSelect, selectedDate }) {
  const [viewDate, setViewDate] = useState(
    selectedDate ? new Date(selectedDate) : minDate
  );
  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0
  ).getDate();
  const startDay = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1
  ).getDay();
  const days = Array(startDay)
    .fill(null)
    .concat([...Array(daysInMonth).keys()].map((i) => i + 1));
  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-4 text-white text-[10px] font-bold uppercase tracking-widest">
        <button
          type="button"
          onClick={() =>
            setViewDate(
              new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1)
            )
          }
        >
          <ChevronLeft size={16} />
        </button>
        {viewDate.toLocaleString("default", {
          month: "short",
          year: "numeric",
        })}
        <button
          type="button"
          onClick={() =>
            setViewDate(
              new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1)
            )
          }
        >
          <ChevronRight size={16} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} className="text-[8px] text-gray-500 font-bold mb-2">
            {d}
          </div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
          const isSelected = selectedDate === d.toISOString().split("T")[0];
          const isPast = d.getTime() < new Date(minDate).setHours(0, 0, 0, 0);
          return (
            <button
              key={i}
              type="button"
              disabled={isPast}
              onClick={() => onSelect(d.toISOString().split("T")[0])}
              className={`h-7 w-7 rounded-full text-[10px] flex items-center justify-center transition-all ${
                isPast
                  ? "opacity-10 cursor-not-allowed"
                  : isSelected
                  ? "text-black font-bold scale-110"
                  : "text-gray-300 hover:bg-white/10"
              }`}
              style={{ backgroundColor: isSelected ? activeColor : undefined }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
