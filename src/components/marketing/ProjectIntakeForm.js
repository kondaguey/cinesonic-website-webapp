"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useTheme } from "../ui/ThemeContext";

// 🟢 IMPORTS
import ParticleFx from "../ui/ParticleFx";
import ProjectSelectionCard from "./ProjectSelectionCard";
import CineSonicToggle from "../ui/CineSonicToggle";
import Button from "../ui/Button";

// ICONS
import {
  User,
  BookOpen,
  Mic,
  Plus,
  Trash2,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  AlertTriangle,
  Star,
  Clock,
  Music,
  Users,
  Rocket,
  Flame,
  Zap,
  CheckCircle,
  Sparkles,
  Heart,
  Cpu,
  X,
  Layers,
  Settings2,
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

// --- 🟢 2. REUSABLE SELECTION MODAL ---
const SelectionModal = ({
  isOpen,
  onClose,
  title,
  items,
  selectedItems,
  onToggle,
  maxItems,
  activeColor,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-md"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-[#080810] border border-white/10 rounded-3xl overflow-hidden flex flex-col shadow-2xl animate-fade-in-up">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-serif text-white tracking-widest uppercase">
              {title}
            </h3>
            <p className="text-[10px] text-gray-500 font-mono mt-1 uppercase tracking-tighter">
              Select up to {maxItems} • {selectedItems.length} selected
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-white bg-white/5 rounded-full"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[50vh] flex flex-wrap gap-2 custom-scrollbar">
          {items.map((item) => {
            const isSelected = selectedItems.includes(item);
            return (
              <button
                key={item}
                type="button"
                onClick={() => onToggle(item)}
                className={`px-4 py-2 rounded-xl text-xs border transition-all ${
                  isSelected
                    ? "text-black font-bold border-transparent"
                    : "border-white/10 text-gray-400 hover:border-white/30 hover:bg-white/5"
                }`}
                style={{
                  backgroundColor: isSelected ? activeColor : undefined,
                }}
              >
                {item}
              </button>
            );
          })}
        </div>
        <div className="p-4 bg-white/[0.02] border-t border-white/5">
          <button
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-white/10 text-white text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};

// --- 🟢 3. MAIN COMPONENT ---
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

  // Modal States
  const [isGenreModalOpen, setIsGenreModalOpen] = useState(false);
  const [voiceTypeModalIdx, setVoiceTypeModalIdx] = useState(null);

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

  // HELPERS
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

  const updateCharacter = (index, field, value) => {
    setCharacters((prev) => {
      const n = [...prev];
      n[index][field] = value;
      if (field === "gender") n[index].preferredActorId = null;
      return n;
    });
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

  const toggleCharVoice = (charIdx, vt) => {
    setCharacters((prev) => {
      const n = [...prev];
      const current = n[charIdx].voiceTypes || [];
      if (current.includes(vt))
        n[charIdx].voiceTypes = current.filter((x) => x !== vt);
      else if (current.length < 2) n[charIdx].voiceTypes = [...current, vt];
      return n;
    });
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

  const handleServiceSelect = (id, baseType) => {
    const opt = serviceBase.find((o) => o.baseType === baseType);
    setFormData((prev) => ({
      ...prev,
      client_type: id,
      base_format: baseType,
      price_tier: opt.price,
    }));
    const themes = { Solo: "gold", Dual: "pink", Duet: "fire", Multi: "cyan" };
    setTheme(themes[baseType]);
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

  const HeaderTitle = ({ icon: Icon, title }) => (
    <h2
      className={`text-xl font-bold flex items-center gap-3 transition-all duration-500 ${
        isCinematic ? shimmerClass : ""
      }`}
      style={{ color: !isCinematic ? baseColor : undefined }}
    >
      <Icon size={20} style={{ color: activeColor }} />
      {title}
    </h2>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const intakeId = "PRJ-" + Math.floor(1000 + Math.random() * 9000);
      const flatChars = characters
        .map(
          (c) =>
            `${c.name || "Unknown"}, ${c.gender || "Any"}, ${
              c.age || "Any"
            }, Voices: ${c.voiceTypes?.join("/") || "Standard"}, ${
              c.preferredActorId || "None"
            }`
        )
        .join(" | ");
      const { error } = await supabase.from("master_production_log").insert([
        {
          intake_id: intakeId,
          client_type: formData.client_type,
          client_name: formData.client_name,
          email: formData.email,
          project_title: formData.project_title,
          word_count: parseFloat(formData.word_count) || 0,
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
          requested_actor_id:
            characters[0]?.preferredActorId === "Matchmaker"
              ? null
              : characters[0]?.preferredActorId || null,
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
        <div className="text-center mb-10 animate-fade-in-up">
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
          {/* 1. SELECTION CARDS */}
          <section className="animate-fade-in-up">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-10 -m-10 overflow-visible">
              {serviceBase.map((opt) => (
                <div key={opt.baseType} className="relative overflow-visible">
                  <ProjectSelectionCard
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
                </div>
              ))}
            </div>
          </section>

          {/* 2. CORE INFO */}
          <section
            className="bg-[#050510]/80 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl space-y-6 transition-all duration-500"
            style={{ borderColor: `${activeColor}30` }}
          >
            <HeaderTitle icon={BookOpen} title="Title Core Info" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                required
                placeholder="Author / Client"
                className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-6 text-white text-sm outline-none"
                value={formData.client_name}
                onChange={(e) =>
                  setFormData({ ...formData, client_name: e.target.value })
                }
              />
              <input
                required
                type="email"
                placeholder="Contact Email"
                className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-6 text-white text-sm outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                required
                placeholder="Project Title"
                className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-6 text-white text-sm outline-none"
                value={formData.project_title}
                onChange={(e) =>
                  setFormData({ ...formData, project_title: e.target.value })
                }
              />
              <div className="relative">
                <input
                  required
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 px-6 text-white text-sm font-mono outline-none"
                  value={formatCommas(formData.word_count)}
                  onChange={handleWordCountChange}
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-500">
                  WORDS
                </div>
              </div>

              {/* Genre Selection Trigger */}
              <div className="md:col-span-2 space-y-3">
                <label className="text-[10px] uppercase text-gray-500 font-bold tracking-widest">
                  Book most similar genre
                </label>
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
                        Tap to select genres...
                      </span>
                    )}
                  </div>
                  <Settings2 size={16} className="text-gray-500" />
                </button>
              </div>
            </div>
          </section>

          {/* 3. CHARACTER SPECS */}
          {formData.base_format && (
            <section
              className="glass-panel p-6 md:p-8 animate-fade-in-up"
              style={{ borderColor: `${activeColor}30` }}
            >
              <div className="flex justify-between items-center mb-6">
                <HeaderTitle icon={User} title="Character Specs" />
                <span className="text-[9px] font-mono font-bold text-gray-500 border border-white/10 px-3 py-1 rounded bg-black">
                  SLOTS: {characters.length}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {characters.map((char, index) => (
                  <div
                    key={index}
                    className="p-6 border border-white/5 rounded-2xl bg-[#0a0a15] relative group"
                  >
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <input
                        placeholder="Name"
                        className="col-span-2 w-full bg-transparent border-b border-white/10 py-1 text-white text-sm outline-none"
                        value={char.name}
                        onChange={(e) =>
                          updateCharacter(index, "name", e.target.value)
                        }
                      />
                      <select
                        className="bg-transparent border-b border-white/10 py-1 text-gray-400 text-xs outline-none"
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
                        className="bg-transparent border-b border-white/10 py-1 text-gray-400 text-xs outline-none"
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

                    <div className="mb-6 space-y-2">
                      <label className="text-[9px] uppercase text-gray-600 font-bold">
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
                      className={`w-full bg-white/5 border border-white/10 rounded-xl p-3 flex items-center justify-between transition-all ${
                        !char.gender
                          ? "opacity-30 cursor-not-allowed"
                          : "hover:bg-white/10 hover:border-white/30"
                      }`}
                      onClick={() => {
                        if (char.gender) {
                          setScoutTargetIndex(index);
                          setIsScoutOpen(true);
                        }
                      }}
                    >
                      {char.preferredActorId === "Matchmaker" ? (
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                            <Sparkles size={14} className="text-yellow-500" />
                          </div>
                          <div className="text-left">
                            <span className="text-white text-xs font-bold block">
                              Matchmaker
                            </span>
                          </div>
                        </div>
                      ) : char.preferredActorId ? (
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              roster.find((r) => r.id === char.preferredActorId)
                                ?.headshot_url
                            }
                            className="w-8 h-8 rounded-full object-cover border border-white/20"
                            alt="H"
                          />
                          <div className="text-left">
                            <span className="text-white text-xs font-bold block">
                              {
                                roster.find(
                                  (r) => r.id === char.preferredActorId
                                )?.name
                              }
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic text-xs flex items-center gap-2">
                          <Star size={14} /> Scout Talent...
                        </span>
                      )}
                      <ChevronRight size={16} className="text-gray-600" />
                    </button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* 4. TIMELINE */}
          <section
            className="bg-[#050510]/80 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md shadow-2xl space-y-6 transition-all duration-500"
            style={{ borderColor: `${activeColor}30` }}
          >
            <HeaderTitle icon={Calendar} title="Production Timeline" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="relative">
                  <label className="text-[10px] uppercase text-gray-500 mb-2 block font-bold">
                    Option {idx + 1}
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCalendarIdx(openCalendarIdx === idx ? null : idx)
                    }
                    className="w-full bg-[#0a0a15] p-4 rounded-xl border border-white/10 text-left text-xs flex justify-between items-center"
                    style={{
                      borderColor:
                        openCalendarIdx === idx ? activeColor : undefined,
                    }}
                  >
                    <span
                      className={
                        dates[idx]
                          ? "text-white font-mono"
                          : "text-gray-500 italic"
                      }
                    >
                      {dates[idx] || "Select Date..."}
                    </span>
                    <Calendar
                      size={16}
                      style={{ color: dates[idx] ? activeColor : undefined }}
                    />
                  </button>
                  {openCalendarIdx === idx && (
                    <div className="absolute top-full left-0 z-50 mt-3 w-full bg-[#080810] border border-white/20 rounded-2xl p-4 shadow-2xl">
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

          {/* SUBMIT */}
          <div className="pt-10 pb-20 text-center flex flex-col items-center gap-6 border-t border-white/10">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-sm py-5 rounded-full text-black font-bold uppercase tracking-[0.2em] text-sm shadow-2xl transition-all hover:scale-[1.02] disabled:opacity-50"
              style={{ backgroundColor: activeColor }}
            >
              {isSubmitting ? "Transmitting..." : "Initialize Production"}
            </button>
          </div>
        </form>
      </div>

      {/* MODALS */}
      <SelectionModal
        isOpen={isGenreModalOpen}
        onClose={() => setIsGenreModalOpen(false)}
        title="Project Genre"
        items={dropdowns.genres}
        selectedItems={formData.genres}
        onToggle={toggleGenre}
        maxItems={3}
        activeColor={activeColor}
      />

      <SelectionModal
        isOpen={voiceTypeModalIdx !== null}
        onClose={() => setVoiceTypeModalIdx(null)}
        title={`Voice Specs: ${
          characters[voiceTypeModalIdx]?.name || "Character"
        }`}
        items={dropdowns.voiceTypes}
        selectedItems={characters[voiceTypeModalIdx]?.voiceTypes || []}
        onToggle={(vt) => toggleCharVoice(voiceTypeModalIdx, vt)}
        maxItems={2}
        activeColor={activeColor}
      />

      {isScoutOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-0 md:p-8">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-xl animate-fade-in"
            onClick={() => setIsScoutOpen(false)}
          />
          <div className="relative w-full h-full md:h-auto md:max-h-[85vh] md:max-w-2xl bg-[#080810] border-x md:border border-white/10 md:rounded-3xl overflow-hidden flex flex-col shadow-[0_0_100px_rgba(0,0,0,1)] animate-fade-in-up">
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
              <div>
                <h3 className="text-xl font-serif text-white tracking-widest uppercase flex items-center gap-3">
                  <Sparkles size={20} style={{ color: activeColor }} />{" "}
                  CineSonic Matchmaker
                </h3>
              </div>
              <button
                onClick={() => setIsScoutOpen(false)}
                className="p-3 text-gray-500 hover:text-white bg-white/5 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-6 custom-scrollbar space-y-3">
              <div
                className="p-5 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border border-indigo-500/30 hover:border-indigo-500/60 transition-all cursor-pointer group mb-6"
                onClick={() => {
                  updateCharacter(
                    scoutTargetIndex,
                    "preferredActorId",
                    "Matchmaker"
                  );
                  setIsScoutOpen(false);
                }}
              >
                <div className="flex items-center gap-4">
                  <Cpu className="text-indigo-400" size={24} />
                  <div className="flex-1">
                    <h4 className="text-indigo-300 font-bold text-sm">
                      Delegate to Matchmaker
                    </h4>
                  </div>
                  <ChevronRight className="text-indigo-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
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
          </div>
        </div>
      )}

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
  );
}

// --- 🟢 4. HELPER COMPONENTS (RESTORED) ---
function ScoutResultsList({
  roster,
  character,
  formData,
  onSelect,
  activeColor,
}) {
  const [playingUrl, setPlayingUrl] = useState(null);
  const audioRef = useRef(null);

  const matchResults = useMemo(() => {
    const role = {
      Gender: character?.gender || "any",
      "Age Range": character?.age || "",
      "Vocal Specs": `${formData.style} ${formData.notes} ${
        character?.voiceTypes?.join(" ") || ""
      }`,
    };
    return runCreativeMatch(role, roster);
  }, [character, roster, formData]);

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

  return matchResults.map(({ actor, score }) => (
    <div
      key={actor.id}
      className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all cursor-pointer"
      onClick={() => onSelect(actor.id)}
    >
      <div className="relative">
        <img
          src={actor.headshot_url}
          className="w-14 h-14 rounded-xl object-cover border border-white/10"
          alt="H"
        />
        <div
          className="absolute -bottom-2 -right-2 px-1.5 py-0.5 rounded-md text-[9px] font-black shadow-lg"
          style={{
            backgroundColor: score > 80 ? "#22c55e" : activeColor,
            color: "#000",
          }}
        >
          {score}%
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="text-white font-bold text-sm truncate">{actor.name}</h4>
        <p className="text-[10px] text-gray-500 uppercase tracking-wider truncate">
          {Array.isArray(actor.voice_type)
            ? actor.voice_type.join(" • ")
            : actor.voice_type}
        </p>
      </div>
      {actor.demo_url && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleAudio(actor.demo_url);
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/20"
        >
          {playingUrl === actor.demo_url ? (
            <Pause size={16} fill="white" />
          ) : (
            <Play size={16} fill="white" className="ml-0.5" />
          )}
        </button>
      )}
    </div>
  ));
}

function ThemedCalendar({ activeColor, minDate, onSelect, selectedDate }) {
  const [viewDate, setViewDate] = useState(
    selectedDate ? new Date(selectedDate) : minDate || new Date()
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
    <div>
      <div className="flex justify-between items-center mb-4 text-white text-[10px] font-bold uppercase tracking-widest px-2">
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
        {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
          <div key={d} className="text-[8px] text-gray-500 font-bold mb-2">
            {d}
          </div>
        ))}
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const d = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
          const isSelected = selectedDate === d.toISOString().split("T")[0];
          const disabled =
            d.setHours(0, 0, 0, 0) < new Date(minDate).setHours(0, 0, 0, 0);
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(d.toISOString().split("T")[0])}
              className={`h-7 w-7 rounded-full text-[10px] transition-all flex items-center justify-center ${
                disabled
                  ? "text-gray-800"
                  : isSelected
                  ? "text-black font-bold"
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
