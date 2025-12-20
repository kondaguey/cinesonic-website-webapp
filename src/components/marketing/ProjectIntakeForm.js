"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useTheme } from "../ui/ThemeContext";

// 🟢 IMPORTS
import ParticleFx from "../ui/ParticleFx";
import ProjectSelectionCard from "./ProjectSelectionCard";
import CineSonicToggle from "../ui/CineSonicToggle";
import Button from "../ui/Button";
import PopupSelection from "../ui/PopupSelection";
import { subscribeToWaitlist } from "../../actions/subscribeActions"; // 🟢 NEW IMPORT

// ICONS
import {
  User,
  BookOpen,
  Mic,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  AlertTriangle,
  Star,
  Music,
  Users,
  Rocket,
  Flame,
  Zap,
  CheckCircle,
  Check, // 🟢 NEW ICON
  Sparkles,
  Heart,
  Cpu,
  X,
  Layers,
  Settings2,
  Clock,
  ChevronRight as ChevronRightIcon,
} from "lucide-react";

// --- 🟢 1. ROBUST MATCHMAKER ALGO ---
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
    let voicePoints = 0;
    let genrePoints = 0;

    keywords.forEach((word) => {
      if (word === "client" || word === "request") return;
      if (actorVoice.includes(word)) voicePoints += 15;
      if (actorGenres.includes(word)) genrePoints += 10;
    });

    score += Math.min(voicePoints, 30);
    score += Math.min(genrePoints, 10);
    score += 5;
    return { actor: actor, score: Math.min(score, 99) };
  });

  return scoredCandidates.sort((a, b) => b.score - a.score);
}

// --- 🟢 2. MAIN COMPONENT ---
export default function ProjectIntakeForm() {
  const {
    setTheme,
    setIsCinematic,
    activeColor,
    activeStyles,
    isCinematic,
    baseColor,
  } = useTheme();
  const shimmerClass = activeStyles?.shimmer || "";

  // STATE
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [isScoutOpen, setIsScoutOpen] = useState(false);
  const [scoutTargetIndex, setScoutTargetIndex] = useState(null);
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [voiceTypeModalIdx, setVoiceTypeModalIdx] = useState(null);
  const [optIn, setOptIn] = useState(false); // 🟢 NEW STATE

  const [dropdowns, setDropdowns] = useState({
    genres: [],
    voiceTypes: [],
    ageRanges: [],
  });
  const [roster, setRoster] = useState([]);
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
  const [dates, setDates] = useState(["", "", ""]);
  const [openCalendarIdx, setOpenCalendarIdx] = useState(null);
  const [characters, setCharacters] = useState([]);

  // LOGIC HELPERS
  const updateCharacter = (index, field, value) => {
    setCharacters((prev) =>
      prev.map((char, i) =>
        i === index
          ? {
              ...char,
              [field]: value,
              ...(field === "gender" ? { preferredActorId: null } : {}),
            }
          : char
      )
    );
  };

  const toggleCharVoice = (charIdx, vt) => {
    setCharacters((prev) =>
      prev.map((char, i) => {
        if (i !== charIdx) return char;
        const current = char.voiceTypes || [];
        const isSelected = current.includes(vt);

        if (isSelected) {
          return { ...char, voiceTypes: current.filter((x) => x !== vt) };
        } else if (current.length < 2) {
          return { ...char, voiceTypes: [...current, vt] };
        }
        return char;
      })
    );
  };

  const toggleGenre = (g) => {
    setFormData((prev) => {
      const current = prev.genres || [];
      if (current.includes(g))
        return { ...prev, genres: current.filter((x) => x !== g) };
      if (current.length < 3) return { ...prev, genres: [...current, g] };
      return prev;
    });
  };

  const formatCommas = (val) =>
    val ? val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") : "";

  const handleWordCountChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (!isNaN(rawValue)) setFormData({ ...formData, word_count: rawValue });
  };

  const calculateDuration = (words) => {
    const count = parseFloat(words) || 0;
    if (count === 0) return null;
    const totalHours = count / 9300;
    const hours = Math.floor(totalHours);
    const minutes = Math.round((totalHours - hours) * 60);
    return { hours, minutes, totalDecimal: totalHours.toFixed(2) };
  };

  const duration = calculateDuration(formData.word_count);

  const getMinDate = (prevDateStr) => {
    if (!prevDateStr) return new Date();
    const d = new Date(prevDateStr);
    d.setDate(d.getDate() + 30);
    return d;
  };

  useEffect(() => {
    async function fetchData() {
      const listsReq = supabase.from("lists_db").select("*");
      const rosterReq = supabase
        .from("actor_db")
        .select("*")
        .eq("coming_soon", false)
        .order("name");
      const [lRes, rRes] = await Promise.all([listsReq, rosterReq]);
      if (!lRes.error && !rRes.error) {
        setDropdowns({
          genres: [...new Set(lRes.data.map((i) => i.genre).filter(Boolean))],
          voiceTypes: [
            ...new Set(lRes.data.map((i) => i.voice_type).filter(Boolean)),
          ],
          ageRanges: [
            ...new Set(lRes.data.map((i) => i.age_range).filter(Boolean)),
          ],
        });
        setRoster(rRes.data || []);
      }
    }
    fetchData();
  }, []);

  const handleServiceSelect = (id, baseType) => {
    const opt = serviceBase.find((o) => o.baseType === baseType);
    setFormData((prev) => ({
      ...prev,
      client_type: id,
      base_format: baseType,
      price_tier: opt.price,
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
          voiceTypes: [],
          preferredActorId: null,
        }))
    );
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
      price: "$$",
    },
    {
      baseType: "Dual",
      icon: Users,
      dramaIcon: Heart,
      standardTitle: "Dual Audiobook",
      dramaTitle: "Dual Audio Drama",
      standardDesc: "2 Narrators (POV).",
      dramaDesc: "POV + Cinematic FX.",
      price: "$$$",
    },
    {
      baseType: "Duet",
      icon: Flame,
      dramaIcon: Zap,
      standardTitle: "Duet Audiobook",
      dramaTitle: "Duet Audio Drama",
      standardDesc: "Real-time Dialogue.",
      dramaDesc: "Dialogue + Score.",
      price: "$$$$",
    },
    {
      baseType: "Multi",
      icon: Rocket,
      dramaIcon: Sparkles,
      standardTitle: "Multi-Cast",
      dramaTitle: "Cinematic Drama",
      standardDesc: "Full Ensemble.",
      dramaDesc: "Movie for Ears.",
      price: "$$$$$",
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 🟢 1. HANDLE MARKETING OPT-IN
      if (optIn && formData.email) {
        const subForm = new FormData();
        subForm.append("email", formData.email);
        subForm.append("source", "client_intake");
        // We fire this silently without awaiting to prevent blocking the main submission
        subscribeToWaitlist(subForm);
      }

      const intakeId = "PRJ-" + Math.floor(1000 + Math.random() * 9000);

      // 🟢 ALIGNED: Uses Pipes to prevent comma-clashes in parsing
      const flatChars = characters
        .map(
          (c) =>
            `${c.name || "TBD"} | ${c.gender || "Any"} | ${c.age || "Any"} | ${
              c.voiceTypes?.join("/") || "Standard"
            } | ${c.preferredActorId || "NULL"}`
        )
        .join(" || ");

      const { error } = await supabase.from("master_production_log").insert([
        {
          intake_id: intakeId,
          client_name: formData.client_name,
          email: formData.email,
          project_title: formData.project_title,
          word_count: parseFloat(formData.word_count) || 0,
          production_style: formData.style, // 🟢 MATCHED to DB column name
          genres: formData.genres.join(", "),
          character_details: flatChars,
          timeline_prefs: dates.filter((d) => d).join(" | "),
          notes:
            `Est. Duration: ${duration?.totalDecimal || 0} PFH. ` +
            formData.notes,
          status: "New",
          is_cinematic: isCinematic,
          base_format: formData.base_format,
          price_tier: formData.price_tier,
          requested_actor_id: characters[0]?.preferredActorId || null,
        },
      ]);

      if (error) throw error;
      setSubmitStatus("success");
    } catch (err) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitStatus === "success")
    return (
      <div className="min-h-screen bg-[#020010] flex items-center justify-center p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParticleFx mode="hero" vector="solo" forceTheme="system" />
        </div>
        <div className="max-w-md w-full glass-panel p-10 relative z-10 border-green-500/30">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-serif mb-4 text-white">
            Manifest Logged
          </h2>
          <Button
            onClick={() => window.location.reload()}
            theme="system"
            variant="outline"
            className="w-full"
          >
            Start New Project
          </Button>
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
                price={opt.price}
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
                className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-6 text-white outline-none"
                value={formData.client_name}
                onChange={(e) =>
                  setFormData({ ...formData, client_name: e.target.value })
                }
              />
              <input
                required
                type="email"
                placeholder="Contact Email"
                className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-6 text-white outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                required
                placeholder="Project Title"
                className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-6 text-white outline-none"
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
                      {duration.hours > 0 && `${duration.hours}h `}{" "}
                      {duration.minutes}m est. runtime{" "}
                      <span className="text-gray-600 ml-1">
                        ({duration.totalDecimal} PFH)
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
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-3 text-white">
                  <User size={20} style={{ color: activeColor }} /> Character
                  Specs
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {characters.map((char, index) => (
                  <div
                    key={index}
                    className="p-6 border border-white/5 rounded-2xl bg-[#0a0a15] relative"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        placeholder="Name"
                        className="col-span-2 bg-transparent border-b border-white/10 py-1 text-white outline-none"
                        value={char.name}
                        onChange={(e) =>
                          updateCharacter(index, "name", e.target.value)
                        }
                      />
                      <select
                        className="bg-transparent border-b border-white/10 py-1 text-gray-400 text-xs"
                        value={char.gender}
                        onChange={(e) =>
                          updateCharacter(index, "gender", e.target.value)
                        }
                      >
                        <option value="">Gender...</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                      <select
                        className="bg-transparent border-b border-white/10 py-1 text-gray-400 text-xs"
                        value={char.age}
                        onChange={(e) =>
                          updateCharacter(index, "age", e.target.value)
                        }
                      >
                        <option value="">Age...</option>
                        {dropdowns.ageRanges.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="mb-6">
                      <label className="text-[9px] uppercase text-gray-600 font-bold block mb-2">
                        Voice Types
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
                              Select...
                            </span>
                          )}
                        </div>
                        <Layers size={14} className="text-gray-600" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className={`w-full bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between ${
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
                        <span className="text-white text-xs font-bold">
                          Talent Selected
                        </span>
                      ) : (
                        <span className="text-gray-400 italic text-xs flex items-center gap-2">
                          <Star size={14} /> Scout Talent...
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
                <Calendar size={20} style={{ color: activeColor }} /> Production
                Timeline
              </h2>
              <div className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 flex items-center gap-3">
                <AlertTriangle size={14} className="text-yellow-500" />
                <span className="text-[9px] uppercase tracking-tighter text-gray-400 leading-tight">
                  Casting Window: Options must be{" "}
                  <span className="text-white font-bold">30 days apart</span>{" "}
                  for optimal talent availability.
                </span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="relative">
                  <label className="text-[9px] font-black text-gray-600 uppercase mb-2 block tracking-widest">
                    Option 0{idx + 1}
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCalendarIdx(openCalendarIdx === idx ? null : idx)
                    }
                    className="w-full bg-[#0a0a15] p-4 rounded-xl border border-white/10 text-left text-xs flex justify-between items-center text-white hover:border-white/30 transition-all"
                  >
                    {dates[idx] ? (
                      <span className="font-mono">{dates[idx]}</span>
                    ) : (
                      <span className="text-gray-600">Select Date...</span>
                    )}{" "}
                    <Calendar size={16} />
                  </button>
                  {openCalendarIdx === idx && (
                    <div className="absolute bottom-full left-0 z-[100] mb-3 w-full bg-[#0d0d1a] border border-white/20 rounded-2xl p-4 shadow-[0_-20px_50px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-200 backdrop-blur-xl">
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
              ))}
            </div>
          </section>

          {/* 🟢 OPT-IN CHECKBOX */}
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
                Production Waitlist
              </span>{" "}
              for exclusive casting updates & industry intel.
            </span>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-5 rounded-full text-black font-bold uppercase tracking-widest text-sm transition-all hover:scale-[1.01]"
            style={{ backgroundColor: activeColor }}
          >
            {isSubmitting ? "Transmitting..." : "Initialize Production"}
          </button>
        </form>

        <PopupSelection
          isOpen={isGenreModalOpen}
          onClose={() => setIsGenreModalOpen(false)}
          title="Project Genre"
          activeColor={activeColor}
          currentCount={formData.genres.length}
          maxCount={3}
        >
          <div className="flex flex-wrap gap-2">
            {dropdowns.genres.map((g) => {
              const isSelected = formData.genres.includes(g);
              return (
                <button
                  key={g}
                  type="button"
                  onClick={() => toggleGenre(g)}
                  className={`px-4 py-2 rounded-xl text-xs border transition-all duration-200 ${
                    isSelected
                      ? "text-black font-bold border-transparent shadow-lg"
                      : "border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5"
                  }`}
                  style={{
                    backgroundColor: isSelected ? activeColor : undefined,
                  }}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </PopupSelection>

        <PopupSelection
          isOpen={voiceTypeModalIdx !== null}
          onClose={() => setVoiceTypeModalIdx(null)}
          title="Voice Specs"
          activeColor={activeColor}
          currentCount={
            voiceTypeModalIdx !== null
              ? characters[voiceTypeModalIdx]?.voiceTypes?.length || 0
              : 0
          }
          maxCount={2}
        >
          <div className="flex flex-wrap gap-2">
            {dropdowns.voiceTypes.map((vt) => {
              const isSelected =
                voiceTypeModalIdx !== null &&
                characters[voiceTypeModalIdx]?.voiceTypes?.includes(vt);
              return (
                <button
                  key={vt}
                  type="button"
                  onClick={() => toggleCharVoice(voiceTypeModalIdx, vt)}
                  className={`px-4 py-2 rounded-xl text-xs border transition-all duration-200 ${
                    isSelected
                      ? "text-black font-bold border-transparent shadow-lg"
                      : "border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5"
                  }`}
                  style={{
                    backgroundColor: isSelected ? activeColor : undefined,
                  }}
                >
                  {vt}
                </button>
              );
            })}
          </div>
        </PopupSelection>

        <PopupSelection
          isOpen={isScoutOpen}
          onClose={() => setIsScoutOpen(false)}
          title="CineSonic Talent Roster"
          activeColor={activeColor}
          currentCount={
            scoutTargetIndex !== null &&
            characters[scoutTargetIndex]?.preferredActorId
              ? 1
              : 0
          }
          maxCount={1}
        >
          <div className="space-y-3">
            {scoutTargetIndex !== null && (
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
            )}
          </div>
        </PopupSelection>

        <style jsx global>{`
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
        `}</style>
      </div>
    </div>
  );
}

// --- 🟢 HELPER COMPONENTS ---
function ScoutResultsList({
  roster,
  character,
  formData,
  onSelect,
  activeColor,
}) {
  const [playingUrl, setPlayingUrl] = useState(null);
  const audioRef = useRef(null);

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

  const toggleAudio = (url) => {
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

  const getMatchStyles = (score) => {
    if (score <= 15)
      return {
        bg: "bg-orange-500/10",
        border: "border-orange-500/30",
        text: "text-orange-500",
      };
    if (score <= 25)
      return {
        bg: "bg-yellow-400/10",
        border: "border-yellow-400/30",
        text: "text-yellow-400",
      };
    if (score <= 50)
      return {
        bg: "bg-purple-500/10",
        border: "border-purple-500/30",
        text: "text-purple-400",
      };
    if (score <= 75)
      return {
        bg: "bg-blue-500/10",
        border: "border-blue-500/30",
        text: "text-blue-400",
      };
    return {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      text: "text-green-400",
    };
  };

  return matchResults.map(({ actor, score }) => {
    const tier = getMatchStyles(score);
    return (
      <div
        key={actor.id}
        className="flex items-center gap-4 p-4 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all cursor-pointer group"
        onClick={() => onSelect(actor.id)}
      >
        <div className="relative flex-shrink-0">
          <img
            src={actor.headshot_url}
            className="w-16 h-16 rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            alt="Actor"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-white font-serif text-lg truncate tracking-wide">
              {actor.name}
            </h4>
            <div
              className={`px-2 py-0.5 rounded-md border ${tier.bg} ${tier.border} ${tier.text} text-[9px] font-black uppercase tracking-tighter`}
            >
              {score}% MATCH
            </div>
          </div>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest truncate">
            {actor.voice_type}
          </p>
        </div>
        {actor.demo_url && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              toggleAudio(actor.demo_url);
            }}
            className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:border-white/30 transition-all"
          >
            {playingUrl === actor.demo_url ? (
              <Pause size={18} className="text-white" />
            ) : (
              <Play size={18} className="text-white fill-white ml-1" />
            )}
          </button>
        )}
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
    <div className="relative z-[100]">
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
          <div
            key={`day-header-${i}`}
            className="text-[8px] text-gray-500 font-bold mb-2"
          >
            {d}
          </div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={`empty-${i}`} />;
          const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
          const isSelected = selectedDate === d.toISOString().split("T")[0];
          const isTooEarly =
            d.getTime() < new Date(minDate).setHours(0, 0, 0, 0);

          return (
            <button
              key={`day-${i}`}
              type="button"
              disabled={isTooEarly}
              onClick={() => onSelect(d.toISOString().split("T")[0])}
              className={`h-7 w-7 rounded-full text-[10px] flex items-center justify-center transition-all ${
                isTooEarly
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
