"use client";

import React, { useState, useEffect, useRef } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useTheme } from "../ui/ThemeContext";

// 🟢 IMPORTS
import ParticleFx from "../ui/ParticleFx";
import ProjectSelectionCard from "./ProjectSelectionCard";
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
} from "lucide-react";

export default function ProjectIntakeForm() {
  const { setTheme, setIsCinematic, activeStyles, isCinematic, theme } =
    useTheme();
  const activeColor = activeStyles?.color || "#d4af37";

  // --- STATE ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

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
    genres: "",
    notes: "",
    client_type: "",
    base_format: "",
    is_cinematic: false,
    price_tier: "",
  });

  const [dates, setDates] = useState(["", "", ""]);
  const [openCalendarIdx, setOpenCalendarIdx] = useState(null);

  const emptyChar = {
    name: "",
    gender: "",
    age: "",
    style: "",
    preferredActorId: null,
  };
  const [characters, setCharacters] = useState([]);
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
          .select("*")
          .eq("coming_soon", false)
          .order("name");
        const [listsRes, rosterRes] = await Promise.all([listsReq, rosterReq]);

        if (!listsRes.error && !rosterRes.error) {
          setDropdowns({
            genres: [
              ...new Set(listsRes.data.map((i) => i.genre).filter(Boolean)),
            ],
            voiceTypes: [
              ...new Set(
                listsRes.data.map((i) => i.voice_type).filter(Boolean)
              ),
            ],
            ageRanges: [
              ...new Set(listsRes.data.map((i) => i.age_range).filter(Boolean)),
            ],
          });
          setRoster(rosterRes.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    fetchData();
  }, []);

  // --- AUDIO LOGIC ---
  const toggleAudio = (url) => {
    if (!url) return;
    if (playingUrl === url) {
      if (audioRef.current) audioRef.current.pause();
      setPlayingUrl(null);
    } else {
      if (audioRef.current) audioRef.current.pause();
      setPlayingUrl(url);
      audioRef.current = new Audio(url);
      audioRef.current.play();
      audioRef.current.onended = () => setPlayingUrl(null);
    }
  };

  // --- SELECTION HANDLER ---
  const handleServiceSelect = (fullId, baseType, isDrama, price) => {
    setFormData((prev) => ({
      ...prev,
      client_type: fullId,
      base_format: baseType,
      is_cinematic: isDrama,
      price_tier: price,
    }));

    let newTheme = "gold";
    if (baseType === "Dual") newTheme = "pink";
    if (baseType === "Duet") newTheme = "fire";
    if (baseType === "Multi") newTheme = "cyan";

    setTheme(newTheme);
    setIsCinematic(isDrama);

    if (baseType === "Solo") setCharacters([emptyChar]);
    else if (baseType === "Dual" || baseType === "Duet")
      setCharacters([emptyChar, emptyChar]);
    else if (baseType === "Multi")
      setCharacters([emptyChar, emptyChar, emptyChar, emptyChar]);
  };

  // --- SUBMIT ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validDates = dates.filter((d) => d !== "").join("|");

    try {
      const intakeId = "PRJ-" + Math.floor(1000 + Math.random() * 9000);
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
          character_details: JSON.stringify(enrichedCharacters),
          status: "New",
          is_cinematic: formData.is_cinematic,
          base_format: formData.base_format,
          price_tier: formData.price_tier,
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

  // --- HELPER FUNCTIONS ---
  const updateCharacter = (i, f, v) => {
    const n = [...characters];
    n[i][f] = v;
    if (f === "gender") n[i].preferredActorId = null;
    setCharacters(n);
    if (f === "preferredActorId") setActiveDropdownIndex(null);
  };
  const addCharacter = () => {
    if (characters.length < 6) setCharacters([...characters, emptyChar]);
  };
  const removeCharacter = (i) => {
    if (characters.length > 4)
      setCharacters(characters.filter((_, x) => x !== i));
  };
  const getMinDate = (prevDateStr) => {
    if (!prevDateStr) return new Date();
    const d = new Date(prevDateStr);
    d.setDate(d.getDate() + 30);
    return d;
  };

  // --- SERVICE OPTIONS CONFIG ---
  const serviceOptions = [
    {
      id: "Solo-Audiobook",
      baseType: "Solo",
      isDrama: false,
      icon: Mic,
      title: "Solo Audiobook",
      price: "$$",
      desc: "1 Narrator. Classic.",
    },
    {
      id: "Solo-Drama",
      baseType: "Solo",
      isDrama: true,
      icon: Music,
      title: "Solo Audio Drama",
      price: "$$$",
      desc: "1 Narrator + SFX.",
    },
    {
      id: "Dual-Audiobook",
      baseType: "Dual",
      isDrama: false,
      icon: Users,
      title: "Dual Audiobook",
      price: "$$$",
      desc: "2 Narrators (POV).",
    },
    {
      id: "Dual-Drama",
      baseType: "Dual",
      isDrama: true,
      icon: Music,
      title: "Dual Audio Drama",
      price: "$$$$",
      desc: "POV + Cinematic FX.",
    },
    {
      id: "Duet-Audiobook",
      baseType: "Duet",
      isDrama: false,
      icon: Flame,
      title: "Duet Audiobook",
      price: "$$$$",
      desc: "Real-time Dialogue.",
    },
    {
      id: "Duet-Drama",
      baseType: "Duet",
      isDrama: true,
      icon: Music,
      title: "Duet Audio Drama",
      price: "$$$$$",
      desc: "Dialogue + Score.",
    },
    {
      id: "Multi-Audiobook",
      baseType: "Multi",
      isDrama: false,
      icon: Rocket,
      title: "Multi-Cast",
      price: "$$$$$",
      desc: "Full Ensemble.",
    },
    {
      id: "Multi-Drama",
      baseType: "Multi",
      isDrama: true,
      icon: Zap,
      title: "Cinematic Drama",
      price: "$$$$$+",
      desc: "Movie for Ears.",
    },
  ];

  // --- SUCCESS VIEW ---
  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-[#020010] flex items-center justify-center p-6 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <ParticleFx mode="hero" vector="solo" forceTheme="system" />
        </div>
        <div className="max-w-md w-full bg-white/5 border border-green-500/30 p-10 rounded-2xl backdrop-blur-md animate-fade-in-up relative z-10">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-serif mb-4">Manifest Logged</h2>
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
  }

  const HeaderTitle = ({ icon: Icon, title }) => (
    <h2
      className={`text-xl md:text-2xl font-bold flex items-center gap-3 mb-6 ${
        isCinematic ? activeStyles?.shimmer : ""
      }`}
      style={{ color: !isCinematic ? activeColor : undefined }}
    >
      <Icon
        className={isCinematic ? "text-white opacity-50" : ""}
        style={{ color: !isCinematic ? activeColor : undefined }}
        size={24}
      />
      {title}
    </h2>
  );

  return (
    <div
      className="min-h-screen relative font-sans py-24 px-4 md:px-0 transition-colors duration-1000 overflow-hidden"
      style={{ selectionBackgroundColor: `${activeColor}30` }}
    >
      {/* 🟢 BACKGROUND LAYER */}
      <div className="absolute inset-0 z-0 opacity-80 transition-opacity duration-1000">
        <ParticleFx
          mode="hero"
          vector={
            formData.base_format ? formData.base_format.toLowerCase() : "none"
          }
        />
      </div>

      {/* 🟢 MAIN CONTAINER: FULL WIDTH MOBILE, 5XL DESKTOP */}
      <div className="w-full md:max-w-5xl mx-auto relative z-10 px-4 md:px-8">
        <div className="text-center mb-12 md:mb-24 animate-fade-in-up">
          <h1 className="text-3xl md:text-6xl lg:text-7xl font-serif mb-4 md:mb-6">
            Production{" "}
            <span
              className={`transition-colors duration-500 ${
                isCinematic ? activeStyles?.shimmer : ""
              }`}
              style={{ color: !isCinematic ? activeColor : undefined }}
            >
              Intake
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto text-sm md:text-xl leading-relaxed px-4">
            Select your specific format tier below to initialize the studio
            engine.
          </p>
        </div>

        {/* 🟢 RESPONSIVE SPACING: Tighter on mobile (space-y-12) */}
        <form onSubmit={handleSubmit} className="space-y-12 md:space-y-32">
          {/* 1. SELECTION (Z-40) */}
          <section className="animate-fade-in-up relative z-40">
            <HeaderTitle icon={Mic} title="Select Production Format" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[0, 2, 4, 6].map((startIndex) => (
                <div key={startIndex} className="flex flex-col gap-4 md:gap-6">
                  {serviceOptions
                    .slice(startIndex, startIndex + 2)
                    .map((opt) => (
                      <ProjectSelectionCard
                        key={opt.id}
                        {...opt}
                        isSelected={formData.client_type === opt.id}
                        onSelect={(id, base, drama) =>
                          handleServiceSelect(id, base, drama, opt.price)
                        }
                      />
                    ))}
                </div>
              ))}
            </div>
          </section>

          {/* 2. CORE DATA (Z-30) */}
          <section
            className="bg-[#050510]/80 border rounded-3xl p-6 md:p-14 backdrop-blur-md transition-colors duration-500 relative z-30 shadow-2xl"
            style={{ borderColor: `${activeColor}30` }}
          >
            <HeaderTitle icon={BookOpen} title="Core Data" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
              {["Author / Client Name", "Contact Email", "Book Title"].map(
                (label, i) => (
                  <div key={i} className="space-y-2 md:space-y-3">
                    <label className="text-[10px] md:text-xs font-bold uppercase text-gray-400 tracking-widest ml-1">
                      {label}
                    </label>
                    <input
                      required
                      type={label.includes("Email") ? "email" : "text"}
                      // Smaller padding on mobile (py-3)
                      className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 md:py-4 px-4 md:px-6 focus:outline-none transition-all text-white hover:border-white/30 focus:shadow-[0_0_20px_rgba(255,255,255,0.05)] text-sm md:text-base"
                      style={{ caretColor: activeColor }}
                      onFocus={(e) =>
                        (e.target.style.borderColor = activeColor)
                      }
                      onBlur={(e) =>
                        (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                      }
                      value={Object.values(formData)[i]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [Object.keys(formData)[i]]: e.target.value,
                        })
                      }
                    />
                  </div>
                )
              )}
              <div className="space-y-2 md:space-y-3">
                <label className="text-[10px] md:text-xs font-bold uppercase text-gray-400 tracking-widest ml-1">
                  Genre
                </label>
                <div className="relative">
                  <select
                    className="w-full bg-[#0a0a15] border border-white/10 rounded-xl py-3 md:py-4 px-4 md:px-6 appearance-none focus:outline-none text-white cursor-pointer hover:border-white/30 text-sm md:text-base"
                    onFocus={(e) => (e.target.style.borderColor = activeColor)}
                    onBlur={(e) =>
                      (e.target.style.borderColor = "rgba(255,255,255,0.1)")
                    }
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
                  <ChevronDown
                    className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                    size={16}
                  />
                </div>
              </div>
            </div>
          </section>

          {/* 3. CHARACTERS (Z-20) */}
          {formData.client_type && (
            <section
              className="bg-[#050510]/80 border rounded-3xl p-6 md:p-14 backdrop-blur-md transition-colors duration-500 relative z-20 shadow-2xl"
              style={{ borderColor: `${activeColor}30` }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 md:mb-10 gap-4">
                <HeaderTitle icon={User} title="Character Specs" />
                <span className="text-[10px] md:text-xs font-mono font-bold text-gray-400 border border-white/10 px-4 py-2 rounded-full bg-[#0a0a15] uppercase tracking-wider">
                  Slots:{" "}
                  <span className="text-white ml-1">{characters.length}</span>
                </span>
              </div>

              <div className="space-y-6 md:space-y-8">
                {characters.map((char, index) => (
                  <div
                    key={index}
                    className="p-6 md:p-8 border border-white/10 rounded-2xl bg-[#0a0a15] relative group hover:border-white/20 transition-colors"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6 md:mb-8">
                      <div className="space-y-2">
                        <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                          Name
                        </label>
                        <input
                          className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none text-white text-sm transition-colors"
                          style={{ caretColor: activeColor }}
                          onFocus={(e) =>
                            (e.target.style.borderColor = activeColor)
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor =
                              "rgba(255,255,255,0.1)")
                          }
                          value={char.name}
                          onChange={(e) =>
                            updateCharacter(index, "name", e.target.value)
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                          Gender
                        </label>
                        <select
                          className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none text-gray-400 text-sm cursor-pointer hover:text-white transition-colors"
                          value={char.gender}
                          onChange={(e) =>
                            updateCharacter(index, "gender", e.target.value)
                          }
                        >
                          <option value="">Select...</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                          Age
                        </label>
                        <select
                          className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none text-gray-400 text-sm cursor-pointer hover:text-white transition-colors"
                          value={char.age}
                          onChange={(e) =>
                            updateCharacter(index, "age", e.target.value)
                          }
                        >
                          <option value="">Select...</option>
                          {dropdowns.ageRanges.map((a) => (
                            <option key={a} value={a}>
                              {a}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] uppercase text-gray-500 font-bold tracking-wider">
                          Style
                        </label>
                        <select
                          className="w-full bg-transparent border-b border-white/10 py-2 focus:outline-none text-gray-400 text-sm cursor-pointer hover:text-white transition-colors"
                          value={char.style}
                          onChange={(e) =>
                            updateCharacter(index, "style", e.target.value)
                          }
                        >
                          <option value="">Select...</option>
                          {dropdowns.voiceTypes.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="relative">
                      <div
                        className={`w-full bg-white/5 border border-white/10 rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all hover:bg-white/10 hover:border-white/20 group/roster ${
                          !char.gender && "opacity-50 cursor-not-allowed"
                        }`}
                        onClick={() =>
                          char.gender &&
                          setActiveDropdownIndex(
                            activeDropdownIndex === index ? null : index
                          )
                        }
                      >
                        {char.preferredActorId ? (
                          <div className="flex items-center gap-4">
                            <img
                              src={
                                roster.find(
                                  (r) => r.id === char.preferredActorId
                                )?.headshot_url
                              }
                              className="w-10 h-10 rounded-full object-cover border border-white/20"
                            />
                            <div className="flex flex-col">
                              <span className="text-[10px] uppercase text-gray-500 font-bold tracking-wider mb-0.5">
                                Preferred Actor
                              </span>
                              <span className="font-bold text-white text-base">
                                {
                                  roster.find(
                                    (r) => r.id === char.preferredActorId
                                  )?.name
                                }
                              </span>
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-400 italic text-xs md:text-sm flex items-center gap-2 group-hover/roster:text-white transition-colors">
                            <Star
                              size={16}
                              className="text-gray-600 group-hover/roster:text-[#d4af37]"
                            />
                            {char.gender
                              ? `Select ${char.gender} Actor...`
                              : "Select Gender..."}
                          </span>
                        )}
                        <ChevronDown
                          size={18}
                          className={`text-gray-500 transition-transform duration-300 ${
                            activeDropdownIndex === index ? "rotate-180" : ""
                          }`}
                        />
                      </div>

                      {activeDropdownIndex === index && (
                        <div className="absolute z-50 top-full left-0 right-0 mt-3 bg-[#080810] border border-white/10 rounded-2xl max-h-80 overflow-y-auto shadow-[0_20px_60px_rgba(0,0,0,0.8)] backdrop-blur-xl ring-1 ring-white/5 custom-scrollbar">
                          {roster
                            .filter(
                              (a) =>
                                (a.gender || "").toLowerCase() ===
                                char.gender?.toLowerCase()
                            )
                            .map((a) => (
                              <div
                                key={a.id}
                                className="p-4 border-b border-white/5 hover:bg-white/[0.05] flex justify-between items-center group/item transition-colors cursor-pointer"
                                onClick={() =>
                                  updateCharacter(
                                    index,
                                    "preferredActorId",
                                    a.id
                                  )
                                }
                              >
                                <div className="flex gap-4 items-center">
                                  <div className="relative">
                                    <img
                                      src={a.headshot_url}
                                      className="w-14 h-14 rounded-full object-cover border-2 border-white/10 group-hover/item:border-white/30 transition-all"
                                    />
                                    {a.union_status && (
                                      <span className="absolute -bottom-1 -right-1 bg-blue-500/20 text-blue-300 text-[8px] px-1.5 py-0.5 rounded border border-blue-500/30 uppercase tracking-wide">
                                        Union
                                      </span>
                                    )}
                                  </div>
                                  <div>
                                    <span
                                      className="text-white font-bold text-sm block mb-1 group-hover/item:text-[var(--c)] transition-colors"
                                      style={{ "--c": activeColor }}
                                    >
                                      {a.name}
                                    </span>
                                    <div className="flex flex-wrap gap-2 text-[10px] text-gray-500 uppercase tracking-wider">
                                      <span className="border border-white/10 px-1.5 rounded bg-white/5">
                                        {Array.isArray(a.voice_type)
                                          ? a.voice_type.join(", ")
                                          : a.voice_type}
                                      </span>
                                      <span className="border border-white/10 px-1.5 rounded bg-white/5">
                                        {a.age_range}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                {a.demo_url && (
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      toggleAudio(a.demo_url);
                                    }}
                                    className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-all group-hover/item:scale-105 group-hover/item:border-[var(--c)] group-hover/item:text-[var(--c)]"
                                    style={{ "--c": activeColor }}
                                  >
                                    {playingUrl === a.demo_url ? (
                                      <Pause size={16} fill="currentColor" />
                                    ) : (
                                      <Play
                                        size={16}
                                        fill="currentColor"
                                        className="ml-0.5"
                                      />
                                    )}
                                  </button>
                                )}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                    {formData.client_type.includes("Multi") && index >= 4 && (
                      <button
                        type="button"
                        onClick={() => removeCharacter(index)}
                        className="absolute top-4 right-4 text-red-500/50 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* 🟢 FIXED BUTTON: Add Character Slot (High Contrast) */}
              {formData.client_type.includes("Multi") &&
                characters.length < 6 && (
                  <button
                    type="button"
                    onClick={addCharacter}
                    className="mt-10 w-full py-5 rounded-xl border-2 bg-black flex items-center justify-center font-bold uppercase tracking-[0.2em] transition-all hover:bg-gray-900 hover:scale-[1.01] hover:shadow-2xl group"
                    style={{
                      borderColor: activeColor,
                      color: activeColor,
                      boxShadow: `0 0 15px ${activeColor}20`,
                    }}
                  >
                    <Plus
                      size={24}
                      className="mr-3 group-hover:rotate-90 transition-transform duration-300"
                    />
                    Add Character Slot
                  </button>
                )}
            </section>
          )}

          {/* 4. TIMELINE */}
          <section
            className="bg-[#050510]/80 border rounded-3xl p-6 md:p-14 backdrop-blur-md transition-colors duration-500 relative z-10 shadow-2xl"
            style={{ borderColor: `${activeColor}30` }}
          >
            <HeaderTitle icon={Calendar} title="Production Timeline" />
            <div
              className="flex items-start gap-5 mb-8 md:mb-10 bg-black/30 p-6 rounded-xl border-l-2"
              style={{ borderColor: activeColor }}
            >
              <Clock
                size={24}
                style={{ color: activeColor }}
                className="flex-shrink-0 mt-0.5"
              />
              <p className="text-sm md:text-base text-gray-400 leading-relaxed">
                Please select 3 potential start dates. To ensure optimal casting
                availability, we require a{" "}
                <span className="font-bold text-white">30-day gap</span> between
                your submitted choices.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[0, 1, 2].map((idx) => (
                <div key={idx} className="relative">
                  <label className="text-[10px] uppercase text-gray-500 mb-3 block tracking-widest font-bold">
                    Option {idx + 1}
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setOpenCalendarIdx(openCalendarIdx === idx ? null : idx)
                    }
                    className={`w-full bg-[#0a0a15] p-4 rounded-xl border text-left text-sm flex justify-between items-center transition-all duration-300 ${
                      openCalendarIdx === idx
                        ? "border-opacity-100 shadow-[0_0_20px_rgba(0,0,0,0.3)]"
                        : "border-white/10 hover:border-white/30 hover:bg-white/5"
                    }`}
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
                      size={18}
                      className={dates[idx] ? "text-white" : "text-gray-600"}
                      style={{ color: dates[idx] ? activeColor : undefined }}
                    />
                  </button>
                  {openCalendarIdx === idx && (
                    <div className="absolute top-full left-0 z-50 mt-3 w-full min-w-[240px] bg-[#080810] border border-white/20 rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.95)] p-4 animate-in fade-in zoom-in-95 duration-200">
                      <ThemedCalendar
                        activeColor={activeColor}
                        minDate={
                          idx === 0 ? new Date() : getMinDate(dates[idx - 1])
                        }
                        onSelect={(dateStr) => {
                          const newDates = [...dates];
                          newDates[idx] = dateStr;
                          setDates(newDates);
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

          {/* DISCLAIMER (Z-0) */}
          <div className="bg-red-900/10 border border-red-500/20 p-6 md:p-8 rounded-2xl flex gap-5 text-left backdrop-blur-sm relative z-0 mt-8 md:mt-12 items-start">
            <AlertTriangle
              className="text-red-500 flex-shrink-0 mt-1"
              size={28}
            />
            <div className="space-y-2">
              <h4 className="text-red-400 text-sm font-bold uppercase tracking-wider">
                Non-Solicitation Notice
              </h4>
              <p className="text-sm text-red-200/70 leading-relaxed max-w-3xl">
                Many narrators in our roster are exclusively contracted.
                Engaging directly with talent introduced via CineSonic outside
                of this platform may constitute a violation of trade agreements.
              </p>
            </div>
          </div>
          {/* 🟢 FINAL SUBMIT BUTTON: Solid Category Color, Pill Shape, Lighter Hover */}
          <div className="pt-12 pb-24 text-center border-t border-white/10 relative z-0 flex justify-center">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full max-w-sm py-4 rounded-full text-[#020010] font-bold uppercase tracking-[0.2em] text-sm shadow-xl transition-all hover:brightness-125 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor:
                  formData.base_format === "Dual"
                    ? "#ff3399"
                    : formData.base_format === "Duet"
                    ? "#ff4500"
                    : formData.base_format === "Multi"
                    ? "#00f0ff"
                    : "#d4af37", // Default (Solo)
              }}
            >
              {isSubmitting ? "Transmitting..." : "Submit Request"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// 🟢 COMPACT CALENDAR (Same as before)
function ThemedCalendar({ activeColor, minDate, onSelect, selectedDate }) {
  const [viewDate, setViewDate] = useState(
    selectedDate ? new Date(selectedDate) : minDate || new Date()
  );
  useEffect(() => {
    if (minDate && viewDate < minDate && !selectedDate)
      setViewDate(new Date(minDate));
  }, [minDate]);
  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const daysInMonth = getDaysInMonth(
    viewDate.getFullYear(),
    viewDate.getMonth()
  );
  const startDay = getFirstDayOfMonth(
    viewDate.getFullYear(),
    viewDate.getMonth()
  );
  const handlePrev = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNext = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const days = [];
  for (let i = 0; i < startDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  return (
    <div>
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/10">
        <button
          type="button"
          onClick={handlePrev}
          className="p-1 hover:text-white text-gray-500 transition-colors"
        >
          <ChevronLeft size={14} />
        </button>
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
          {viewDate.toLocaleString("default", {
            month: "short",
            year: "numeric",
          })}
        </span>
        <button
          type="button"
          onClick={handleNext}
          className="p-1 hover:text-white text-gray-500 transition-colors"
        >
          <ChevronRight size={14} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[9px] mb-1 text-gray-500 font-mono uppercase">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, i) => {
          if (!day) return <div key={i} />;
          const currentDayDate = new Date(
            viewDate.getFullYear(),
            viewDate.getMonth(),
            day
          );
          const isSelected =
            selectedDate === currentDayDate.toISOString().split("T")[0];
          const cellTime = new Date(currentDayDate).setHours(0, 0, 0, 0);
          const minTime = new Date(minDate).setHours(0, 0, 0, 0);
          const disabled = cellTime < minTime;
          return (
            <button
              key={i}
              type="button"
              disabled={disabled}
              onClick={() =>
                onSelect(currentDayDate.toISOString().split("T")[0])
              }
              className={`h-6 w-6 rounded-full flex items-center justify-center text-[10px] transition-all duration-200 ${
                disabled
                  ? "text-gray-800 cursor-not-allowed"
                  : "hover:bg-white/10 text-gray-300 cursor-pointer"
              } ${
                isSelected
                  ? "font-bold text-black shadow-[0_0_15px_currentColor] scale-110"
                  : ""
              }`}
              style={{
                backgroundColor: isSelected ? activeColor : undefined,
                color: isSelected ? "black" : undefined,
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
