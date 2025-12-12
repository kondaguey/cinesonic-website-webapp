"use client";
import React, { useState, useEffect } from "react";
import {
  Film,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  Info,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

// 🟢 INITIALIZE SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default function AuthorForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // 🟢 DYNAMIC LISTS STATE
  const [listOptions, setListOptions] = useState({
    genres: [],
    voices: [],
    ages: [],
  });

  const [formData, setFormData] = useState({
    clientType: "",
    clientName: "",
    email: "",
    bookTitle: "",
    wordCount: "",
    style: "",
    genres: { primary: "", secondary: "", tertiary: "" },
    notes: "",
    date1: "",
    date2: "",
    date3: "",
    characters: [],
  });

  // 🟢 FETCH LISTS FROM SUPABASE ('lists_db')
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const { data, error } = await supabase.from("lists_db").select("*");

        if (data) {
          // Extract unique lists from the rows
          const genres = [...new Set(data.map((d) => d.genre).filter(Boolean))];
          const voices = [
            ...new Set(data.map((d) => d.voice_type).filter(Boolean)),
          ];
          const ages = [
            ...new Set(data.map((d) => d.age_range).filter(Boolean)),
          ];

          setListOptions({ genres, voices, ages });
        }
      } catch (err) {
        console.error("Failed to load lists:", err);
      }
    };
    fetchLists();
  }, []);

  // DATE CALCULATOR
  const getMinDate = (baseDate) => {
    if (!baseDate) return undefined;
    const date = new Date(baseDate);
    date.setDate(date.getDate() + 30);
    return date.toISOString().split("T")[0];
  };

  // WORD COUNT FORMATTER (Visual only)
  const handleWordCountChange = (e) => {
    const rawValue = e.target.value.replace(/,/g, "");
    if (isNaN(rawValue)) return;
    const formatted = rawValue ? Number(rawValue).toLocaleString() : "";
    setFormData((prev) => ({ ...prev, wordCount: formatted }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (level, value) => {
    setFormData((prev) => ({
      ...prev,
      genres: { ...prev.genres, [level]: value },
    }));
  };

  const handleStyleChange = (e) => {
    const style = e.target.value;
    let charCount = 0;
    if (style === "Solo Narration") charCount = 1;
    else if (style.includes("Dual") || style.includes("Duet")) charCount = 2;
    else if (style.includes("Multicast")) charCount = 4;

    const newChars = Array(charCount)
      .fill(null)
      .map(() => ({ name: "", gender: "Male", age: "", vocal: "" }));
    setFormData((prev) => ({ ...prev, style, characters: newChars }));
  };

  const updateCharacter = (index, field, value) => {
    const updatedChars = [...formData.characters];
    updatedChars[index] = { ...updatedChars[index], [field]: value };
    setFormData((prev) => ({ ...prev, characters: updatedChars }));
  };

  // 🟢 SUBMIT TO SUPABASE ('project_intake_db')
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Format Characters String (Same logic as Google Script)
    let mCount = 0;
    let fCount = 0;
    const charStringBlock = formData.characters
      .map((c) => {
        let prefix = "O";
        if (c.gender === "Male") {
          mCount++;
          prefix = `M${mCount}`;
        } else {
          fCount++;
          prefix = `F${fCount}`;
        }
        return `${prefix}: ${c.name} - ${c.age} - ${c.vocal}`;
      })
      .join("\n");

    // 2. Format Genres String
    const genreString = [
      formData.genres.primary,
      formData.genres.secondary,
      formData.genres.tertiary,
    ]
      .filter(Boolean)
      .join(", ");

    // 3. Format Timeline String
    const timelineBlock = `${formData.date1}|${formData.date2}|${formData.date3}`;

    // 4. Generate a Short "Intake ID" (Like the old system)
    const intakeId = "INT-" + Math.floor(1000 + Math.random() * 9000);

    try {
      // 5. INSERT
      const { error } = await supabase.from("project_intake_db").insert([
        {
          intake_id: intakeId,
          client_type: formData.clientType,
          client_name: formData.clientName,
          email: formData.email,
          project_title: formData.bookTitle,
          // ⚠️ Remove commas so numeric column accepts it
          word_count: Number(formData.wordCount.replace(/,/g, "")),
          style: formData.style,
          genres: genreString,
          character_details: charStringBlock,
          timeline_prefs: timelineBlock,
          notes: formData.notes,
          status: "NEW", // Default status
        },
      ]);

      if (error) throw error;
      setSubmitted(true);
    } catch (error) {
      console.error("Submission Error:", error);
      alert("System Error: Could not save request.");
    }
    setLoading(false);
  };

  // --- STYLES ---
  const inputClass =
    "w-full bg-white/5 border-b border-gold/30 py-4 px-4 text-lg text-white outline-none focus:border-gold transition-colors placeholder:text-gray-500 " +
    "[&:-webkit-autofill]:shadow-[0_0_0_1000px_#0c0442_inset] " +
    "[&:-webkit-autofill]:-webkit-text-fill-color:white " +
    "[&:-webkit-autofill]:transition-[background-color_5000s_ease-in-out_0s]";

  const selectClass =
    "w-full bg-white/5 border-b border-gold/30 py-4 px-4 text-lg text-white appearance-none outline-none focus:border-gold transition-colors cursor-pointer [&>option]:bg-midnight";

  // --- RENDER ---
  if (submitted)
    return (
      <div className="min-h-screen bg-deep-space flex flex-col items-center justify-center p-6 text-center animate-fade-in">
        <div className="bg-black/40 backdrop-blur-md border border-gold/50 p-12 rounded-xl shadow-2xl max-w-lg w-full">
          <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-glow">
            <CheckCircle className="w-12 h-12 text-gold" />
          </div>
          <h2 className="text-3xl font-serif text-white mb-2 font-bold">
            Request Received
          </h2>
          <p className="text-gold/80 uppercase tracking-widest text-xs mb-8">
            Production Estimate Generated
          </p>
          <Link
            href="/"
            className="px-8 py-3 border border-gold/30 text-gold hover:bg-gold hover:text-midnight font-bold rounded uppercase text-xs tracking-widest transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a0f5e] via-[#0c0442] to-black text-white p-4 md:p-8 font-sans pb-32">
      <div className="max-w-4xl mx-auto animate-fade-in-up">
        {/* BANNER */}
        <div className="mb-2 shadow-glow rounded-xl overflow-hidden border border-gold/30 bg-midnight relative z-0">
          <img
            src="https://www.danielnotdaylewis.com/img/cinesonic_logo_banner_gold_16x9.png"
            className="w-full h-32 md:h-56 object-cover opacity-90"
            alt="Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <Link
            href="/"
            className="absolute top-4 right-4 text-xs text-gold/50 hover:text-gold uppercase tracking-widest z-20 bg-black/40 px-3 py-1 rounded-full border border-white/10"
          >
            Cancel / Exit
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-black/40 backdrop-blur-xl p-8 md:p-12 rounded-xl shadow-2xl border border-gold/20 space-y-10 relative z-10"
        >
          {/* CLIENT INFO */}
          <div className="pb-10 border-b border-gold/20">
            <h3 className="text-lg font-bold uppercase tracking-widest text-gold mb-8 flex items-center gap-2 font-serif">
              <Film className="w-5 h-5" /> Client Information
            </h3>
            <div className="grid gap-8">
              <div className="relative">
                <select
                  name="clientType"
                  value={formData.clientType}
                  onChange={handleChange}
                  className={selectClass}
                  required
                >
                  <option value="" disabled>
                    I'm a...
                  </option>
                  <option value="Publisher">Publisher</option>
                  <option value="Production Company">Production Company</option>
                  <option value="Indie Author">Indie Author</option>
                  <option value="Talent Agency">Talent Agency</option>
                </select>
                <ChevronDown className="absolute right-4 top-5 w-5 h-5 text-gold/50 pointer-events-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <input
                  name="clientName"
                  placeholder="Full Name / Company Name"
                  onChange={handleChange}
                  className={inputClass}
                  required
                  autoComplete="off"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  className={inputClass}
                  required
                  autoComplete="off"
                />
              </div>
            </div>
          </div>

          {/* PROJECT DETAILS */}
          <div className="pb-10 border-b border-gold/20">
            <h3 className="text-lg font-bold uppercase tracking-widest text-gold mb-8 flex items-center gap-2 font-serif">
              <BookOpen className="w-5 h-5" /> Project Details
            </h3>

            <input
              name="bookTitle"
              value={formData.bookTitle}
              placeholder="Project Title"
              onChange={handleChange}
              className="w-full text-3xl bg-transparent border-b border-gold/30 py-4 px-2 mb-8 font-serif outline-none focus:border-gold transition-colors placeholder:text-gray-600 text-white"
              required
              autoComplete="off"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <input
                name="wordCount"
                type="text"
                value={formData.wordCount}
                placeholder="Word Count (Est.)"
                onChange={handleWordCountChange}
                className={inputClass}
                required
                autoComplete="off"
              />

              <div className="relative">
                <select
                  name="style"
                  value={formData.style}
                  onChange={handleStyleChange}
                  className={selectClass}
                  required
                >
                  <option value="" disabled>
                    Production Style...
                  </option>
                  <option value="Solo Narration">Solo Narration</option>
                  <option value="Dual Narration">Dual Narration</option>
                  <option value="Duet Narration">Duet Narration</option>
                  <option value="Full Multicast">Full Multicast</option>
                </select>
                <ChevronDown className="absolute right-4 top-5 w-5 h-5 text-gold/50 pointer-events-none" />
              </div>
            </div>

            {/* GENRES */}
            <label className="text-xs text-gold uppercase tracking-widest mb-2 block ml-1 font-bold">
              Genre Breakdown
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {["primary", "secondary", "tertiary"].map((level, idx) => (
                <div className="relative" key={level}>
                  <select
                    value={formData.genres[level]}
                    onChange={(e) => handleGenreChange(level, e.target.value)}
                    className={selectClass}
                    required={idx === 0}
                  >
                    <option value="" disabled className="text-gray-500">
                      {level.charAt(0).toUpperCase() + level.slice(1)}...
                    </option>
                    {listOptions.genres.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-5 w-4 h-4 text-gold/50 pointer-events-none" />
                </div>
              ))}
            </div>

            {/* CHARACTERS */}
            {formData.characters.length > 0 && (
              <div className="bg-white/5 p-8 rounded-lg border border-gold/10 mb-8 animate-fade-in">
                <h4 className="text-gold text-sm font-bold uppercase mb-6 border-b border-white/5 pb-2">
                  Character Breakdown
                </h4>
                {formData.characters.map((char, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-6 items-end"
                  >
                    <div className="md:col-span-1 text-gold text-sm font-bold pb-3">
                      #{i + 1}
                    </div>

                    <div className="md:col-span-3">
                      <input
                        placeholder="Character Name"
                        value={char.name}
                        onChange={(e) =>
                          updateCharacter(i, "name", e.target.value)
                        }
                        className="w-full bg-transparent border-b border-white/20 p-2 text-base outline-none focus:border-gold placeholder:text-gray-600 text-white"
                        autoComplete="off"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <select
                        value={char.gender}
                        onChange={(e) =>
                          updateCharacter(i, "gender", e.target.value)
                        }
                        className="w-full bg-transparent border-b border-white/20 p-2 text-base outline-none focus:border-gold text-white [&>option]:bg-midnight cursor-pointer"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <select
                        value={char.age}
                        onChange={(e) =>
                          updateCharacter(i, "age", e.target.value)
                        }
                        className="w-full bg-transparent border-b border-white/20 p-2 text-base outline-none focus:border-gold text-white [&>option]:bg-midnight cursor-pointer"
                      >
                        <option value="" disabled>
                          Select Age...
                        </option>
                        {listOptions.ages.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <select
                        value={char.vocal}
                        onChange={(e) =>
                          updateCharacter(i, "vocal", e.target.value)
                        }
                        className="w-full bg-transparent border-b border-white/20 p-2 text-base outline-none focus:border-gold text-white [&>option]:bg-midnight cursor-pointer"
                      >
                        <option value="" disabled>
                          Select Vocal Style...
                        </option>
                        {listOptions.voices.map((v) => (
                          <option key={v} value={v}>
                            {v}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gold/10 border-l-2 border-gold p-6 mb-8 rounded-r-lg flex gap-4">
              <Info className="w-6 h-6 text-gold shrink-0 mt-0.5" />
              <p className="text-gold/90 text-sm leading-relaxed font-sans">
                <strong>We welcome mature and complex subject matter</strong>{" "}
                that demonstrates genuine literary merit, authentically
                exploring the full spectrum of the human experience. However, we
                prohibit material that promotes illegal activity or Age Gap
                themes involving minors.
              </p>
            </div>

            <textarea
              name="notes"
              placeholder="Additional Notes / Vibes..."
              onChange={handleChange}
              className="w-full bg-white/5 p-6 h-32 rounded border border-transparent focus:border-gold/30 outline-none text-base placeholder:text-gray-600 resize-none text-white"
            ></textarea>
          </div>

          {/* TIMELINE */}
          <div>
            <h3 className="text-lg font-bold uppercase tracking-widest text-gold mb-4 flex items-center gap-2 font-serif">
              <Calendar className="w-5 h-5" /> Timeline Preferences
            </h3>

            {/* DISCLAIMER BLOCK */}
            <div className="mb-8 flex items-start gap-3 bg-white/5 p-4 rounded-lg border border-gold/10">
              <Clock className="w-5 h-5 text-gold/70 mt-0.5 shrink-0" />
              <p className="text-xs text-gray-300 leading-relaxed">
                <span className="text-gold font-bold uppercase tracking-widest block mb-1">
                  Availability Tip
                </span>
                To secure the best casting options, we recommend spacing your
                start date preferences by at least{" "}
                <strong className="text-white">30 days</strong>.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {/* Option 1 */}
              <div className="flex flex-col gap-2 bg-midnight/40 border border-gold/20 p-4 rounded-lg">
                <span className="text-xs font-bold uppercase text-gold">
                  Option 1 (Preferred)
                </span>
                <input
                  type="date"
                  name="date1"
                  onChange={handleChange}
                  required
                  className="bg-transparent text-white outline-none w-full uppercase font-bold text-base cursor-pointer [color-scheme:dark]"
                />
              </div>

              {/* Option 2 */}
              <div
                className={`flex flex-col gap-2 bg-midnight/40 border border-gold/10 p-4 rounded-lg transition ${
                  !formData.date1 ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                <span className="text-xs font-bold uppercase text-gold">
                  Option 2
                </span>
                <input
                  type="date"
                  name="date2"
                  min={getMinDate(formData.date1)}
                  disabled={!formData.date1}
                  onChange={handleChange}
                  className="bg-transparent text-white outline-none w-full uppercase font-bold text-base cursor-pointer [color-scheme:dark]"
                />
              </div>

              {/* Option 3 */}
              <div
                className={`flex flex-col gap-2 bg-midnight/40 border border-gold/10 p-4 rounded-lg transition ${
                  !formData.date2 ? "opacity-30 pointer-events-none" : ""
                }`}
              >
                <span className="text-xs font-bold uppercase text-gold">
                  Option 3
                </span>
                <input
                  type="date"
                  name="date3"
                  min={getMinDate(formData.date2)}
                  disabled={!formData.date2}
                  onChange={handleChange}
                  className="bg-transparent text-white outline-none w-full uppercase font-bold text-base cursor-pointer [color-scheme:dark]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-gradient-to-r from-gold via-[#e5c558] to-gold text-midnight font-bold py-6 rounded-lg shadow-glow hover:shadow-lg hover:scale-[1.01] transition-all duration-300 uppercase tracking-[0.2em] relative overflow-hidden text-lg"
            >
              {loading ? (
                <span className="animate-pulse">Processing...</span>
              ) : (
                <span>Initiate Request</span>
              )}
              <div className="absolute inset-0 bg-white/30 transform -translate-x-full group-hover:translate-x-full transition duration-700 ease-in-out"></div>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
