"use client";
import React, { useState, useEffect } from "react";
import {
  Film,
  BookOpen,
  Calendar,
  CheckCircle,
  ChevronDown,
  Info,
} from "lucide-react";
import axios from "axios";
import Link from "next/link";

// 🔴 REPLACE WITH YOUR V8 URL
const API_URL =
  "https://script.google.com/macros/s/AKfycbxjKTIkZgMvjuCv49KK00885LI5r2Ir6qMY7UGb29iqojgnhTck0stR__yejTODfLVO/exec";

export default function AuthorForm() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [listOptions, setListOptions] = useState({ genres: [] });

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
    date3: "", // 🟢 ADDED 3rd DATE
    characters: [],
  });

  // 🟢 FETCH DYNAMIC LISTS ON MOUNT
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const res = await axios.get(`${API_URL}?op=get_lists`);
        if (res.data.genres) {
          setListOptions({ genres: res.data.genres });
        }
      } catch (err) {
        console.error("Failed to load lists");
      }
    };
    fetchLists();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      op: "client_intake",
      ...formData,
      genres: [
        formData.genres.primary,
        formData.genres.secondary,
        formData.genres.tertiary,
      ].filter(Boolean),
      maleDetails: formData.characters
        .filter((c) => c.gender === "Male")
        .map((c, i) => `M${i + 1}: ${c.name} - ${c.age} - ${c.vocal}`),
      femaleDetails: formData.characters
        .filter((c) => c.gender !== "Male")
        .map((c, i) => `F${i + 1}: ${c.name} - ${c.age} - ${c.vocal}`),
    };

    try {
      await axios.post(API_URL, JSON.stringify(payload), {
        headers: { "Content-Type": "text/plain;charset=utf-8" },
      });
      setSubmitted(true);
    } catch (error) {
      alert("Connection Error. Please try again.");
    }
    setLoading(false);
  };

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
    <div className="min-h-screen bg-deep-space text-white p-4 md:p-8 font-sans pb-32">
      <div className="max-w-3xl mx-auto animate-fade-in-up">
        {/* BANNER */}
        <div className="mb-2 shadow-glow rounded-xl overflow-hidden border border-gold/30 bg-midnight relative z-0">
          <img
            src="https://www.danielnotdaylewis.com/img/cinesonic_logo_banner_gold_16x9.png"
            className="w-full h-32 md:h-48 object-cover opacity-90"
            alt="Banner"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-deep-space/90 to-transparent"></div>
          <Link
            href="/"
            className="absolute top-4 right-4 text-xs text-gold/50 hover:text-gold uppercase tracking-widest z-20"
          >
            Cancel / Exit
          </Link>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-black/40 backdrop-blur-xl p-6 md:p-10 rounded-xl shadow-2xl border border-gold/20 space-y-8 relative z-10"
        >
          {/* CLIENT INFO */}
          <div className="pb-8 border-b border-gold/20">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gold mb-6 flex items-center gap-2">
              <Film className="w-4 h-4" /> Client Information
            </h3>
            <div className="grid gap-6">
              <div className="relative">
                <select
                  name="clientType"
                  onChange={handleChange}
                  className="w-full bg-white/5 border-b border-gold/30 py-3 px-4 text-white appearance-none outline-none focus:border-gold transition-colors cursor-pointer [&>option]:bg-midnight"
                  required
                >
                  <option value="" disabled selected>
                    I'm a...
                  </option>
                  <option value="Publisher">Publisher</option>
                  <option value="Production Company">Production Company</option>
                  <option value="Indie Author">Indie Author</option>
                  <option value="Talent Agency">Talent Agency</option>{" "}
                  {/* 🟢 ADDED */}
                </select>
                <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-gold/50 pointer-events-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <input
                  name="clientName"
                  placeholder="Full Name / Company Name"
                  onChange={handleChange}
                  className="bg-white/5 border-b border-gold/30 py-3 px-4 outline-none focus:border-gold transition-colors placeholder:text-gray-500 text-white"
                  required
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Email Address"
                  onChange={handleChange}
                  className="bg-white/5 border-b border-gold/30 py-3 px-4 outline-none focus:border-gold transition-colors placeholder:text-gray-500 text-white"
                  required
                />
              </div>
            </div>
          </div>

          {/* PROJECT DETAILS */}
          <div className="pb-8 border-b border-gold/20">
            <h3 className="text-sm font-bold uppercase tracking-widest text-gold mb-6 flex items-center gap-2">
              <BookOpen className="w-4 h-4" /> Project Details
            </h3>

            <input
              name="bookTitle"
              placeholder="Project Title"
              onChange={handleChange}
              className="w-full text-xl bg-transparent border-b border-gold/30 py-3 px-2 mb-6 font-serif outline-none focus:border-gold transition-colors placeholder:text-gray-600 text-white"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <input
                name="wordCount"
                type="number"
                placeholder="Word Count (Est.)"
                onChange={handleChange}
                className="bg-white/5 border-b border-gold/30 py-3 px-4 outline-none focus:border-gold transition-colors placeholder:text-gray-500 text-white"
                required
              />

              <div className="relative">
                <select
                  name="style"
                  onChange={handleStyleChange}
                  className="w-full bg-white/5 border-b border-gold/30 py-3 px-4 appearance-none outline-none focus:border-gold transition-colors cursor-pointer text-white [&>option]:bg-midnight"
                  required
                >
                  <option value="" disabled selected>
                    Production Style...
                  </option>
                  <option value="Solo Narration">Solo Narration</option>
                  <option value="Dual Narration">Dual Narration</option>
                  <option value="Duet Narration">Duet Narration</option>
                  <option value="Full Multicast">Full Multicast</option>
                </select>
                <ChevronDown className="absolute right-4 top-4 w-4 h-4 text-gold/50 pointer-events-none" />
              </div>
            </div>

            {/* DYNAMIC GENRES */}
            <label className="text-[10px] text-gold uppercase tracking-widest mb-2 block ml-1">
              Genre Breakdown
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {["primary", "secondary", "tertiary"].map((level, idx) => (
                <div className="relative" key={level}>
                  <select
                    onChange={(e) => handleGenreChange(level, e.target.value)}
                    className="w-full bg-white/5 border-b border-gold/30 py-2 px-3 text-sm appearance-none outline-none focus:border-gold cursor-pointer text-white [&>option]:bg-midnight"
                    required={idx === 0}
                  >
                    <option
                      value=""
                      disabled
                      selected
                      className="text-gray-500"
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}...
                    </option>
                    {/* 🟢 DYNAMIC LIST MAPPING */}
                    {listOptions.genres.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 w-3 h-3 text-gold/50 pointer-events-none" />
                </div>
              ))}
            </div>

            {/* CHARACTERS */}
            {formData.characters.length > 0 && (
              <div className="bg-white/5 p-6 rounded-lg border border-gold/10 mb-8 animate-fade-in">
                <h4 className="text-gold text-xs font-bold uppercase mb-4 border-b border-white/5 pb-2">
                  Character Breakdown
                </h4>
                {formData.characters.map((char, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-4 items-end"
                  >
                    <div className="md:col-span-1 text-gold text-xs font-bold pb-2">
                      #{i + 1}
                    </div>
                    <div className="md:col-span-4">
                      <input
                        placeholder="Character Name"
                        value={char.name}
                        onChange={(e) =>
                          updateCharacter(i, "name", e.target.value)
                        }
                        className="w-full bg-transparent border-b border-white/20 p-2 text-sm outline-none focus:border-gold placeholder:text-gray-600 text-white"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <select
                        value={char.gender}
                        onChange={(e) =>
                          updateCharacter(i, "gender", e.target.value)
                        }
                        className="w-full bg-midnight border-b border-white/20 p-2 text-sm outline-none focus:border-gold text-white"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                    <div className="md:col-span-2">
                      <input
                        placeholder="Age"
                        value={char.age}
                        onChange={(e) =>
                          updateCharacter(i, "age", e.target.value)
                        }
                        className="w-full bg-transparent border-b border-white/20 p-2 text-sm outline-none focus:border-gold placeholder:text-gray-600 text-white"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <input
                        placeholder="Vocal (e.g. Raspy)"
                        value={char.vocal}
                        onChange={(e) =>
                          updateCharacter(i, "vocal", e.target.value)
                        }
                        className="w-full bg-transparent border-b border-white/20 p-2 text-sm outline-none focus:border-gold placeholder:text-gray-600 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 🟢 POLICY DISCLAIMER */}
            <div className="bg-gold/10 border-l-2 border-gold p-4 mb-6 rounded-r-lg flex gap-3">
              <Info className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <p className="text-gold/90 text-xs leading-relaxed font-sans">
                <strong>We welcome mature and complex subject matter</strong>{" "}
                that demonstrates genuine literary merit, authentically
                exploring the full spectrum of the human experience, including
                crime, violent acts, and sometimes deeply disturbing themes.
                That said, we prohibit material that promotes, instructs, or
                praises real-world illegal activity, as well as Age Gap themes
                involving minors.
              </p>
            </div>

            <textarea
              name="notes"
              placeholder="Additional Notes / Vibes..."
              onChange={handleChange}
              className="w-full bg-white/5 p-4 h-28 rounded border border-transparent focus:border-gold/30 outline-none text-sm placeholder:text-gray-600 resize-none text-white"
            ></textarea>
          </div>

          {/* TIMELINE */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-gold mb-6 flex items-center gap-2">
              <Calendar className="w-4 h-4" /> Timeline Preferences
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {/* Option 1 */}
              <div className="flex flex-col gap-1 bg-midnight/40 border border-gold/20 p-3 rounded">
                <span className="text-[10px] font-bold uppercase text-gold">
                  Option 1 (Preferred)
                </span>
                <input
                  type="date"
                  name="date1"
                  onChange={handleChange}
                  required
                  className="bg-transparent text-white outline-none w-full uppercase font-bold text-sm cursor-pointer"
                />
              </div>

              {/* Option 2 */}
              <div className="flex flex-col gap-1 bg-midnight/40 border border-gold/10 p-3 rounded opacity-75 hover:opacity-100 transition">
                <span className="text-[10px] font-bold uppercase text-gold">
                  Option 2
                </span>
                <input
                  type="date"
                  name="date2"
                  onChange={handleChange}
                  className="bg-transparent text-white outline-none w-full uppercase font-bold text-sm cursor-pointer"
                />
              </div>

              {/* 🟢 Option 3 */}
              <div className="flex flex-col gap-1 bg-midnight/40 border border-gold/10 p-3 rounded opacity-75 hover:opacity-100 transition">
                <span className="text-[10px] font-bold uppercase text-gold">
                  Option 3
                </span>
                <input
                  type="date"
                  name="date3"
                  onChange={handleChange}
                  className="bg-transparent text-white outline-none w-full uppercase font-bold text-sm cursor-pointer"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="group w-full bg-gradient-to-r from-gold via-[#e5c558] to-gold text-midnight font-bold py-5 rounded shadow-glow hover:shadow-lg hover:scale-[1.01] transition-all duration-300 uppercase tracking-[0.2em] relative overflow-hidden"
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
