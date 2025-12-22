"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import { useTheme } from "../ui/ThemeContext";
// 🟢 IMPORT THE MATCHMAKER
import { runCreativeMatch } from "../../utils/dashboard/matchmaker";

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
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

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
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false); // Project level

  // WIRED: Modal States for Specs
  const [genderModalIdx, setGenderModalIdx] = useState(null);
  const [ageModalIdx, setAgeModalIdx] = useState(null);
  const [voiceTypeModalIdx, setVoiceTypeModalIdx] = useState(null);
  const [charGenreModalIdx, setCharGenreModalIdx] = useState(null); // 🟢 NEW: Character Specific Genre
  const [accentModalIdx, setAccentModalIdx] = useState(null);

  // STATE: DB Data
  const [dropdowns, setDropdowns] = useState({
    genres: [],
    vocalQualities: [],
    ageRanges: [],
    accents: [],
    gender: [],
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
          gender:
            listData
              .filter((i) => i.category === "gender")
              .map((i) => i.label) || [],
        });
      }

      // Fetch Roster
      const { data: rosterData } = await supabase
        .from("actor_roster_public")
        .select(
          "id, display_name, headshot_url, voice_types, genres, age_ranges, gender, demo_reel_url, accents"
        )
        .order("display_name");

      if (rosterData) {
        setRoster(
          rosterData.map((r) => ({
            id: r.id,
            name: r.display_name,
            headshot_url: r.headshot_url,
            gender: r.gender || "any",
            voice: r.voice_types?.join(", ") || "",
            genres: r.genres?.join(", ") || "",
            age_range: r.age_ranges?.join(" ") || "",
            accents: r.accents?.join(", ") || "",
            demoUrl: r.demo_reel_url || null,
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
          genre: "", // 🟢 NEW FIELD
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
            genre: c.genre || "Any", // 🟢 PASSED TO DB
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
      standardPrice: "$",
      dramaPrice: "$$$",
    },
    {
      baseType: "Dual",
      icon: Users,
      dramaIcon: Heart,
      standardTitle: "Dual Audiobook",
      dramaTitle: "Dual Audio Drama",
      standardDesc: "2 Narrators (POV).",
      dramaDesc: "POV + Cinematic FX.",
      standardPrice: "$$",
      dramaPrice: "$$$$",
    },
    {
      baseType: "Duet",
      icon: Flame,
      dramaIcon: Zap,
      standardTitle: "Duet Audiobook",
      dramaTitle: "Duet Audio Drama",
      standardDesc: "Real-time Dialogue.",
      dramaDesc: "Dialogue + Score.",
      standardPrice: "$$$",
      dramaPrice: "$$$$$",
    },
    {
      baseType: "Multi",
      icon: Rocket,
      dramaIcon: Sparkles,
      standardTitle: "Multi-Cast",
      dramaTitle: "Cinematic Drama",
      standardDesc: "Full Ensemble.",
      dramaDesc: "Movie for Ears.",
      standardPrice: "$$$$",
      dramaPrice: "$x6",
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
                price={isCinematic ? opt.dramaPrice : opt.standardPrice}
                isSelected={formData.base_format === opt.baseType}
                onSelect={handleServiceSelect}
              />
            ))}
          </section>

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
                    className="p-6 border border-white/5 rounded-2xl bg-[#0a0a15] relative group/card flex flex-col gap-4"
                  >
                    {/* 1. NAME */}
                    <input
                      placeholder="Role Name"
                      className="w-full bg-transparent border-b border-white/10 py-1 text-white outline-none focus:border-white/40 transition-all"
                      value={char.name}
                      onChange={(e) =>
                        updateCharacter(index, "name", e.target.value)
                      }
                    />

                    <div className="grid grid-cols-2 gap-4">
                      {/* 2. GENDER */}
                      <button
                        type="button"
                        onClick={() => setGenderModalIdx(index)}
                        className="bg-[#0d0d1a] border border-white/10 rounded-lg p-2 text-xs text-left flex justify-between items-center transition-all hover:border-white/30 hover:bg-white/5 cursor-pointer active:scale-[0.98] group"
                      >
                        <span
                          className={`truncate ${
                            char.gender ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {char.gender || "Gender..."}
                        </span>
                        <ChevronRightIcon
                          size={12}
                          className="text-gray-600 group-hover:text-white transition-colors rotate-90"
                        />
                      </button>

                      {/* 3. AGE */}
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
                    </div>

                    {/* 4. VOCAL QUALITIES (Full Width) */}
                    <div>
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

                    <div className="grid grid-cols-2 gap-4">
                      {/* 5. GENRE (🟢 NEW) */}
                      <button
                        type="button"
                        onClick={() => setCharGenreModalIdx(index)}
                        className="bg-[#0d0d1a] border border-white/10 rounded-lg p-2 text-xs text-left flex justify-between items-center transition-all hover:border-white/30 hover:bg-white/5 cursor-pointer active:scale-[0.98] group"
                      >
                        <span
                          className={`truncate ${
                            char.genre ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {char.genre || "Specific Genre..."}
                        </span>
                        <ChevronRightIcon
                          size={12}
                          className="text-gray-600 group-hover:text-white transition-colors rotate-90"
                        />
                      </button>

                      {/* 6. ACCENT */}
                      <button
                        type="button"
                        onClick={() => setAccentModalIdx(index)}
                        className="bg-[#0d0d1a] border border-white/10 rounded-lg p-2 text-xs text-left flex justify-between items-center transition-all hover:border-white/30 hover:bg-white/5 cursor-pointer active:scale-[0.98] group"
                      >
                        <span
                          className={`truncate ${
                            char.accent ? "text-white" : "text-gray-400"
                          }`}
                        >
                          {char.accent || "Accent..."}
                        </span>
                        <ChevronRightIcon
                          size={12}
                          className="text-gray-600 group-hover:text-white transition-colors rotate-90"
                        />
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

        {/* --- MODALS --- */}
        <PopupSelection
          isOpen={genderModalIdx !== null}
          onClose={() => setGenderModalIdx(null)}
          title="Character Gender"
          activeColor={activeColor}
          currentCount={
            genderModalIdx !== null && characters[genderModalIdx]?.gender
              ? 1
              : 0
          }
          maxCount={1}
        >
          {dropdowns.gender?.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                updateCharacter(genderModalIdx, "gender", g);
                setGenderModalIdx(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs border transition-all ${
                genderModalIdx !== null &&
                characters[genderModalIdx].gender === g
                  ? "text-black font-bold border-transparent"
                  : "border-white/10 text-gray-400 hover:bg-white/5"
              }`}
              style={{
                backgroundColor:
                  genderModalIdx !== null &&
                  characters[genderModalIdx].gender === g
                    ? activeColor
                    : undefined,
              }}
            >
              {g}
            </button>
          ))}
        </PopupSelection>

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

        {/* 🟢 NEW CHARACTER GENRE MODAL */}
        <PopupSelection
          isOpen={charGenreModalIdx !== null}
          onClose={() => setCharGenreModalIdx(null)}
          title="Character Genre Vibe"
          activeColor={activeColor}
          currentCount={
            charGenreModalIdx !== null && characters[charGenreModalIdx]?.genre
              ? 1
              : 0
          }
          maxCount={1}
        >
          {dropdowns.genres.map((g) => (
            <button
              key={g}
              type="button"
              onClick={() => {
                updateCharacter(charGenreModalIdx, "genre", g);
                setCharGenreModalIdx(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs border transition-all ${
                charGenreModalIdx !== null &&
                characters[charGenreModalIdx].genre === g
                  ? "text-black font-bold border-transparent"
                  : "border-white/10 text-gray-400 hover:bg-white/5"
              }`}
              style={{
                backgroundColor:
                  charGenreModalIdx !== null &&
                  characters[charGenreModalIdx].genre === g
                    ? activeColor
                    : undefined,
              }}
            >
              {g}
            </button>
          ))}
        </PopupSelection>

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
          isWide={true}
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
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(typeof Audio !== "undefined" ? new Audio() : null);

  const toggleAudio = (e, url, id) => {
    e.stopPropagation();
    if (!url) return;
    if (playingId === id) {
      audioRef.current.pause();
      setPlayingId(null);
    } else {
      audioRef.current.src = url;
      audioRef.current.play();
      setPlayingId(id);
    }
  };

  const matchResults = useMemo(
    () =>
      runCreativeMatch(
        {
          gender: character?.gender,
          age: character?.age,
          voiceTypes: character?.voiceTypes,
          genre: character?.genre, // 🟢 Passed to Matchmaker
          accent: character?.accent,
          specs: `${formData.style} ${formData.notes}`,
        },
        roster
      ),
    [character, roster, formData]
  );

  return matchResults.map(({ actor, score }) => {
    let scoreColorClass = "text-red-400 border-red-500/30 bg-red-500/10";
    if (score >= 80)
      scoreColorClass =
        "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    else if (score >= 50)
      scoreColorClass = "text-amber-400 border-amber-500/30 bg-amber-500/10";

    return (
      <div
        key={actor.id}
        className="flex items-center gap-6 p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all cursor-pointer group"
        onClick={() => onSelect(actor.id)}
      >
        <button
          type="button"
          onClick={(e) => toggleAudio(e, actor.demoUrl, actor.id)}
          className={`flex-none w-12 h-12 rounded-full flex items-center justify-center border transition-all ${
            playingId === actor.id
              ? "bg-white text-black border-white scale-110"
              : "bg-white/5 text-white border-white/10 hover:border-white hover:scale-105"
          }`}
        >
          {playingId === actor.id ? (
            <Pause size={18} fill="currentColor" />
          ) : (
            <Play size={18} fill="currentColor" className="ml-0.5" />
          )}
        </button>
        <img
          src={actor.headshot_url}
          className="w-16 h-16 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 shadow-lg"
          alt="Actor"
        />
        <div className="flex-1 min-w-0 text-left">
          <h4 className="text-white font-serif text-xl tracking-wide">
            {actor.name}
          </h4>
          <div className="flex flex-col gap-0.5 mt-1">
            <p className="text-xs text-gray-400 truncate">
              <span className="text-gray-600 uppercase text-[9px] font-bold tracking-wider mr-2">
                Voice
              </span>
              <span className="text-gray-300">{actor.voice || "General"}</span>
            </p>
            <p className="text-xs text-gray-400 truncate">
              <span className="text-gray-600 uppercase text-[9px] font-bold tracking-wider mr-2">
                Genre
              </span>
              <span className="text-gray-300">{actor.genres || "General"}</span>
            </p>
          </div>
        </div>
        <div
          className={`px-3 py-1.5 rounded-lg border ${scoreColorClass} flex flex-col items-center justify-center min-w-[60px]`}
        >
          <span className="text-lg font-black tracking-tighter leading-none">
            {score}%
          </span>
          <span className="text-[8px] uppercase font-bold tracking-widest opacity-70">
            Match
          </span>
        </div>
      </div>
    );
  });
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
        </button>{" "}
        {viewDate.toLocaleString("default", {
          month: "short",
          year: "numeric",
        })}{" "}
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
