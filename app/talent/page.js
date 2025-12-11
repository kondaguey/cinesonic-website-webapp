"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  LogOut,
  Loader2,
  Plus,
  Trash2,
  CheckSquare,
  Square,
  Key,
  AlertTriangle,
  CheckCircle,
  Pencil,
  Upload,
  FileText,
  Image as ImageIcon,
  ArrowLeft,
} from "lucide-react";

// 🔴 YOUR V7 GOOGLE SCRIPT URL
const API_URL =
  "https://script.google.com/macros/s/AKfycbxjKTIkZgMvjuCv49KK00885LI5r2Ir6qMY7UGb29iqojgnhTck0stR__yejTODfLVO/exec";

const AGE_RANGES = ["Teen", "20s", "30s", "40s", "50s", "60s", "70s", "80+"];

export default function TalentPortal() {
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessKey, setAccessKey] = useState("");

  const [formData, setFormData] = useState(null);
  const [dynamicLists, setDynamicLists] = useState({ genres: [], voices: [] });
  const [bookoutRanges, setBookoutRanges] = useState([]);
  const [newBookout, setNewBookout] = useState({ start: "", end: "" });

  // UI States
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [checks, setChecks] = useState({
    truth: false,
    roster: false,
    data: false,
    token: false,
  });

  // --- LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_URL}?op=login_key&key=${accessKey}`);
      if (res.data.success) {
        const data = res.data.actor;
        setDynamicLists(res.data.lists || { genres: [], voices: [] });

        const parsedBookouts = [];
        if (data["Bookouts"]) {
          String(data["Bookouts"])
            .split(",")
            .forEach((range) => {
              const parts = range.trim().split(" to ");
              if (parts.length === 2)
                parsedBookouts.push({ start: parts[0], end: parts[1] });
            });
        }
        setBookoutRanges(parsedBookouts);

        setFormData({
          id: data["Actor ID"],
          name: data["Name"],
          email: data["Email"],
          pseudonym: data["Pseudonym"],
          gender: data["Gender"],
          ages: data["Age Range"] ? String(data["Age Range"]).split(", ") : [],
          voice: data["Voice Type"]
            ? String(data["Voice Type"]).split(", ")
            : [],
          genres: data["Genres"] ? String(data["Genres"]).split(", ") : [],
          status: data["Status"],
          nextAvailable: data["Next Available"],
          rate: data["PFH Rate"],
          sag: data["Union Status"],
          website: data["Website Link"],
          headshot: "",
          resume: "",
          offLimits: data["Triggers"],
          training: data["Notes"],
          audiobooks: data["Audiobooks"],
        });
        setView("profile");
      } else {
        setError("Invalid Access Key");
      }
    } catch (err) {
      setError("Connection Error");
    }
    setLoading(false);
  };

  // --- HANDLERS ---
  const handleCheckbox = (field, value, maxLimit) => {
    setFormData((prev) => {
      const current = prev[field] || [];
      if (current.includes(value))
        return { ...prev, [field]: current.filter((i) => i !== value) };
      if (current.length >= maxLimit) return prev;
      return { ...prev, [field]: [...current, value] };
    });
  };

  const addBookout = () => {
    if (!newBookout.start || !newBookout.end) return;
    setBookoutRanges((prev) =>
      [...prev, newBookout].sort((a, b) => (a.start > b.start ? 1 : -1))
    );
    setNewBookout({ start: "", end: "" });
  };

  const removeBookout = (index) => {
    setBookoutRanges((prev) => prev.filter((_, i) => i !== index));
  };

  const submitFinal = async () => {
    setLoading(true);
    try {
      const bookoutsString = bookoutRanges
        .map((b) => `${b.start} to ${b.end}`)
        .join(", ");
      const payload = {
        op: "talent_update",
        actorId: formData.id,
        name: formData.name,
        email: formData.email,
        pseudonym: formData.pseudonym,
        gender: formData.gender,
        ages: formData.ages,
        voiceType: formData.voice,
        genres: formData.genres,
        status: formData.status,
        nextAvailable: formData.nextAvailable,
        rate: formData.rate,
        sag: formData.sag,
        headshot: formData.website,
        training: formData.training,
        offLimits: formData.offLimits,
        bookouts: bookoutsString,
        audiobooks: formData.audiobooks,
      };

      await axios.post(API_URL, JSON.stringify(payload), {
        headers: { "Content-Type": "text/plain;charset=utf-8" },
      });
      setShowModal(false);
      setView("success");
    } catch (err) {
      alert("Save Failed");
    }
    setLoading(false);
  };

  // --- HELPER COMPONENT ---
  const CheckboxGroup = ({ label, items, field, max }) => (
    <div className="bg-white/5 border border-white/10 p-4 md:p-5 rounded-xl flex flex-col h-full shadow-inner hover:border-gold/30 transition-colors">
      <div className="flex justify-between items-center mb-4 border-b border-white/5 pb-2">
        <label className="text-gold font-serif font-bold text-sm md:text-base tracking-widest uppercase">
          {label}
        </label>
        <span className="text-[10px] md:text-xs text-gray-300 font-bold bg-black/40 px-2 py-1 rounded border border-white/10 shrink-0">
          Max {max}
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto custom-scrollbar pr-2 max-h-60 md:max-h-80">
        {(items || []).map((item) => {
          const isSelected = (formData[field] || []).includes(item);
          const isDisabled =
            !isSelected && (formData[field] || []).length >= max;
          return (
            <button
              key={item}
              type="button"
              onClick={() => handleCheckbox(field, item, max)}
              disabled={isDisabled}
              className={`text-left text-sm md:text-base p-3 rounded-lg flex items-center gap-3 transition-all border
                ${
                  isSelected
                    ? "bg-gold/20 border-gold text-white shadow-[0_0_15px_rgba(212,175,55,0.3)] font-bold"
                    : "border-transparent text-gray-300 hover:bg-white/10 hover:text-white"
                }
                ${isDisabled ? "opacity-30 cursor-not-allowed" : ""}
              `}
            >
              <div
                className={`w-5 h-5 border rounded flex items-center justify-center transition-colors shrink-0 ${
                  isSelected
                    ? "border-gold bg-gold text-midnight"
                    : "border-gray-500"
                }`}
              >
                {isSelected && <CheckSquare size={14} strokeWidth={4} />}
              </div>
              <span className="leading-tight pt-0.5">{item}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  // --- VIEW: LOGIN ---
  if (view === "login")
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)]">
        {/* BACK BUTTON */}
        <Link
          href="/"
          className="absolute top-6 left-6 md:top-8 md:left-8 text-gold/60 hover:text-gold flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest transition-colors z-10"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* 1. TOP BANNER (Full Fill) */}
        <div className="w-full max-w-[480px] rounded-t-2xl overflow-hidden border border-gold/30 border-b-0 shadow-2xl">
          <img
            src="https://www.danielnotdaylewis.com/img/cinesonic_logo_banner_gold_16x9.png"
            className="w-full h-48 object-cover object-center bg-midnight"
          />
        </div>

        {/* 2. BOTTOM CARD (Form) */}
        <div className="w-full max-w-[480px] rounded-b-2xl border border-gold/30 border-t-0 backdrop-blur-2xl bg-black/40 p-8 md:p-10 shadow-2xl animate-fade-in-up">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl text-gold font-serif mb-2">
              Talent Portal
            </h2>
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">
              Secure Access
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="group relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Key className="w-5 h-5 text-gold/50 group-focus-within:text-gold transition-colors" />
              </div>
              <input
                type="password"
                value={accessKey}
                onChange={(e) => setAccessKey(e.target.value)}
                className="w-full bg-white/5 border border-gold/20 text-white py-4 pl-12 pr-4 rounded-xl text-lg tracking-[0.15em] outline-none focus:border-gold focus:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all placeholder:text-gray-600 placeholder:text-sm placeholder:tracking-normal"
                placeholder="ENTER ACCESS KEY"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-xs text-center flex items-center justify-center gap-2 animate-fade-in">
                <AlertTriangle size={14} /> {error}
              </div>
            )}

            <button
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-light text-midnight font-bold py-4 rounded-xl uppercase tracking-widest flex justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-gold/20"
            >
              {loading ? <Loader2 className="animate-spin" /> : "Authenticate"}
            </button>
          </form>
        </div>
      </div>
    );

  // --- VIEW: SUCCESS ---
  if (view === "success")
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)]">
        <div className="text-center animate-zoom-in bg-black/40 p-12 rounded-2xl border border-gold/30 shadow-2xl backdrop-blur-xl">
          <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/50 shadow-[0_0_30px_rgba(74,222,128,0.2)]">
            <CheckCircle className="w-10 h-10 text-green-400" />
          </div>
          <h2 className="text-3xl text-gold font-serif mb-2">
            Profile Updated
          </h2>
          <p className="text-gray-400 mb-8 font-sans">
            Data synced with casting roster.
          </p>
          <button
            onClick={() => {
              setView("login");
              setAccessKey("");
            }}
            className="text-gold hover:text-white underline text-sm uppercase tracking-wider"
          >
            Back to Login
          </button>
        </div>
      </div>
    );

  // --- VIEW: PROFILE ---
  return (
    <div className="min-h-screen flex flex-col items-center py-8 md:py-12 px-4 bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)] text-white">
      {/* CONTAINER BANNER */}
      <div className="w-full max-w-4xl rounded-t-2xl overflow-hidden border border-gold/30 border-b-0 shadow-2xl">
        <img
          src="https://www.danielnotdaylewis.com/img/cinesonic_logo_banner_gold_16x9.png"
          className="w-full h-32 md:h-56 object-cover object-center bg-midnight"
        />
      </div>

      <div className="w-full max-w-4xl bg-black/40 border border-gold/30 rounded-b-2xl backdrop-blur-xl shadow-2xl p-6 md:p-12 animate-fade-in">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 border-b border-white/10 pb-6 gap-6 md:gap-4">
          <div className="w-full">
            {/* NAME */}
            <div className="flex items-center gap-3 mb-2">
              {isEditingName ? (
                <input
                  autoFocus
                  onBlur={() => setIsEditingName(false)}
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="bg-transparent border-b border-gold text-2xl md:text-3xl font-serif text-white outline-none w-full"
                />
              ) : (
                <h1
                  className="text-gold font-serif text-2xl md:text-3xl cursor-pointer hover:text-white transition-colors"
                  onClick={() => setIsEditingName(true)}
                >
                  {formData.name}
                </h1>
              )}
              <button
                onClick={() => setIsEditingName(!isEditingName)}
                className="text-gray-600 hover:text-gold transition-colors"
              >
                <Pencil size={16} />
              </button>
            </div>

            {/* EMAIL WITH PENCIL */}
            <div className="flex flex-wrap items-center gap-2">
              {isEditingEmail ? (
                <input
                  autoFocus
                  onBlur={() => setIsEditingEmail(false)}
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-transparent border-b border-gold text-sm text-gray-300 outline-none w-full md:w-64"
                />
              ) : (
                <span className="text-sm text-gray-300 tracking-wide font-sans break-all">
                  {formData.email}
                </span>
              )}
              <button
                onClick={() => setIsEditingEmail(!isEditingEmail)}
                className="text-gray-600 hover:text-gold transition-colors opacity-50 hover:opacity-100 shrink-0"
              >
                <Pencil size={12} />
              </button>
              <span className="text-gray-500 text-xs uppercase tracking-widest border-l border-gray-600 pl-2 ml-2 shrink-0">
                {formData.id}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setView("login");
              setAccessKey("");
            }}
            className="shrink-0 text-xs text-red-400 hover:text-red-300 flex items-center gap-2 border border-red-900/50 px-4 py-2 rounded bg-red-900/10 transition-colors hover:bg-red-900/20 uppercase tracking-widest"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        {/* IDENTITY */}
        <div className="mb-10 border-b border-white/10 pb-10">
          <h3 className="text-gold font-serif text-lg md:text-xl border-l-4 border-gold pl-4 mb-8 uppercase tracking-widest">
            Identity
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="text-gray-400 text-xs uppercase mb-2 block tracking-wider font-bold">
                Pseudonym
              </label>
              <input
                value={formData.pseudonym || ""}
                onChange={(e) =>
                  setFormData({ ...formData, pseudonym: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 focus:border-gold p-4 rounded-lg text-white outline-none transition-colors"
                placeholder="For spicy content..."
              />
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase mb-2 block tracking-wider font-bold">
                Gender Identity
              </label>
              <select
                value={formData.gender || ""}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className="w-full bg-white/5 border border-white/10 focus:border-gold p-4 rounded-lg text-white outline-none appearance-none [&>option]:bg-midnight"
              >
                <option value="" disabled>
                  Select...
                </option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>
        </div>

        {/* LISTS */}
        <div className="mb-10 border-b border-white/10 pb-10">
          <h3 className="text-gold font-serif text-lg md:text-xl border-l-4 border-gold pl-4 mb-8 uppercase tracking-widest">
            Casting Specs
          </h3>
          <div className="grid grid-cols-1 gap-6">
            <CheckboxGroup
              label="Age Ranges"
              items={AGE_RANGES}
              field="ages"
              max={2}
            />
            <CheckboxGroup
              label="Voice Types"
              items={dynamicLists.voices}
              field="voice"
              max={3}
            />
            <CheckboxGroup
              label="Genres"
              items={dynamicLists.genres}
              field="genres"
              max={5}
            />
          </div>
        </div>

        {/* PROFESSIONAL */}
        <div className="mb-10 border-b border-white/10 pb-10">
          <h3 className="text-gold font-serif text-lg md:text-xl border-l-4 border-gold pl-4 mb-8 uppercase tracking-widest">
            Professional
          </h3>

          {/* UPLOADS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/5 border border-white/10 border-dashed rounded-xl p-6 text-center group hover:border-gold/50 transition-colors">
              <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-gold/20 transition-colors">
                <ImageIcon className="text-gray-400 group-hover:text-gold" />
              </div>
              <label className="text-gold font-bold text-sm uppercase mb-1 block">
                Headshot / Website
              </label>
              <p className="text-[10px] text-gray-500 mb-3">
                Paste link or upload (Cloud coming soon)
              </p>
              <input
                value={formData.website || ""}
                onChange={(e) =>
                  setFormData({ ...formData, website: e.target.value })
                }
                className="w-full bg-black/50 border border-white/10 p-2 rounded text-xs text-center text-white focus:border-gold outline-none"
                placeholder="https://..."
              />
            </div>

            <div className="bg-white/5 border border-white/10 border-dashed rounded-xl p-6 text-center group hover:border-gold/50 transition-colors">
              <div className="w-12 h-12 bg-black/20 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-gold/20 transition-colors">
                <FileText className="text-gray-400 group-hover:text-gold" />
              </div>
              <label className="text-gold font-bold text-sm uppercase mb-1 block">
                Resume / CV
              </label>
              <p className="text-[10px] text-gray-500 mb-3">
                Paste link or upload (Cloud coming soon)
              </p>
              <input
                value={formData.resume || ""}
                onChange={(e) =>
                  setFormData({ ...formData, resume: e.target.value })
                }
                className="w-full bg-black/50 border border-white/10 p-2 rounded text-xs text-center text-white focus:border-gold outline-none"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="text-gold text-xs uppercase mb-2 block font-bold tracking-wider">
                Union Status
              </label>
              <select
                value={formData.sag || ""}
                onChange={(e) =>
                  setFormData({ ...formData, sag: e.target.value })
                }
                className="w-full bg-white/5 border border-gold/30 focus:border-gold p-4 rounded-lg text-white outline-none [&>option]:bg-midnight"
              >
                <option value="" disabled>
                  Select...
                </option>
                <option>Non-Union</option>
                <option>SAG-Eligible</option>
                <option>SAG-AFTRA</option>
                <option>Fi-Core</option>
              </select>
            </div>
            <div>
              <label className="text-gold text-xs uppercase mb-2 block font-bold tracking-wider">
                PFH Rate ($)
              </label>
              <input
                type="number"
                value={formData.rate || ""}
                onChange={(e) =>
                  setFormData({ ...formData, rate: e.target.value })
                }
                className="w-full bg-white/5 border border-gold/30 focus:border-gold p-4 rounded-lg text-white outline-none"
              />
            </div>
            <div>
              <label className="text-gold text-xs uppercase mb-2 block font-bold tracking-wider">
                Audiobooks Produced
              </label>
              <input
                type="number"
                value={formData.audiobooks || ""}
                onChange={(e) =>
                  setFormData({ ...formData, audiobooks: e.target.value })
                }
                className="w-full bg-white/5 border border-gold/30 focus:border-gold p-4 rounded-lg text-white outline-none"
              />
            </div>
          </div>
          <div>
            <label className="text-gold text-xs uppercase mb-2 block font-bold tracking-wider">
              Training / Notes
            </label>
            <textarea
              rows={2}
              value={formData.training || ""}
              onChange={(e) =>
                setFormData({ ...formData, training: e.target.value })
              }
              className="w-full bg-white/5 border border-gold/30 focus:border-gold p-4 rounded-lg text-white outline-none"
            />
          </div>
        </div>

        {/* AVAILABILITY */}
        <div className="mb-8">
          <h3 className="text-gold font-serif text-lg md:text-xl border-l-4 border-gold pl-4 mb-8 uppercase tracking-widest">
            Availability
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="text-gold text-xs uppercase mb-2 block font-bold tracking-wider">
                Current Status
              </label>
              <select
                value={formData.status || "New"}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="w-full bg-white/5 border border-gold/30 focus:border-gold p-4 rounded-lg text-white outline-none [&>option]:bg-midnight"
              >
                <option value="Active">🟢 Active</option>
                <option value="Limited">🟡 Limited</option>
                <option value="On Hiatus">🔴 On Hiatus</option>
              </select>
            </div>
            <div>
              <label className="text-gold text-xs uppercase mb-2 block font-bold tracking-wider">
                Next Open Date
              </label>
              <input
                type="date"
                value={
                  formData.nextAvailable
                    ? formData.nextAvailable.split("T")[0]
                    : ""
                }
                onChange={(e) =>
                  setFormData({ ...formData, nextAvailable: e.target.value })
                }
                className="w-full bg-white/5 border border-gold/30 focus:border-gold p-4 rounded-lg text-white outline-none uppercase text-sm"
              />
            </div>
          </div>

          {/* POLICY - NOW FONT-SANS */}
          <div className="bg-gold/10 border-l-2 border-gold p-4 mb-4 rounded-r-lg">
            <p className="text-gold/90 text-xs leading-relaxed font-sans">
              <strong>We welcome mature and complex subject matter</strong> that
              demonstrates genuine literary merit, authentically exploring the
              full spectrum of the human experience, including crime, violent
              acts, and sometimes deeply disturbing themes. That said, we
              prohibit material that promotes, instructs, or praises real-world
              illegal activity, as well as Age Gap themes involving minors.
            </p>
          </div>

          <div className="mb-8">
            <label className="text-red-400 text-xs uppercase mb-2 block font-bold tracking-wider">
              Triggers / Off Limits
            </label>
            <textarea
              rows={2}
              maxLength={150}
              value={formData.offLimits || ""}
              onChange={(e) =>
                setFormData({ ...formData, offLimits: e.target.value })
              }
              className="w-full bg-red-900/10 border border-red-500/30 focus:border-red-500 p-4 rounded-lg text-white outline-none"
              placeholder="Topics you cannot record..."
            />
          </div>

          <div className="bg-white/5 border border-gold/10 rounded-xl p-6">
            <label className="text-gold text-xs uppercase mb-4 block font-bold tracking-wider">
              Future Bookouts
            </label>
            <div className="space-y-2 mb-4">
              {bookoutRanges.length === 0 && (
                <p className="text-xs text-gray-500 italic">
                  No future bookouts listed.
                </p>
              )}
              {bookoutRanges.map((b, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-black/30 p-3 rounded border border-white/5"
                >
                  <span className="text-sm text-gray-300">
                    {b.start} <span className="text-gold px-2">to</span> {b.end}
                  </span>
                  <button
                    onClick={() => removeBookout(i)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
            <div className="flex gap-2 items-end">
              <div className="grow">
                <label className="text-[10px] text-gray-400 uppercase mb-1 block">
                  Start
                </label>
                <input
                  type="date"
                  value={newBookout.start}
                  onChange={(e) =>
                    setNewBookout({ ...newBookout, start: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 p-3 rounded text-xs text-white"
                />
              </div>
              <div className="grow">
                <label className="text-[10px] text-gray-400 uppercase mb-1 block">
                  End
                </label>
                <input
                  type="date"
                  value={newBookout.end}
                  onChange={(e) =>
                    setNewBookout({ ...newBookout, end: e.target.value })
                  }
                  className="w-full bg-black/50 border border-white/10 p-3 rounded text-xs text-white"
                />
              </div>
              <button
                onClick={addBookout}
                className="bg-gold hover:bg-gold-light text-midnight p-3 rounded-lg flex items-center justify-center transition-colors"
              >
                <Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="w-full bg-gold hover:bg-gold-light text-midnight font-bold py-5 rounded-xl text-lg uppercase tracking-widest shadow-lg shadow-gold/20 transition-all transform hover:-translate-y-1"
        >
          Save Profile
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="bg-deep-space border border-gold/30 w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="bg-black/40 p-5 border-b border-gold/10 flex justify-between items-center">
              <h3 className="text-gold font-serif text-lg">Confirm Update</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                &times;
              </button>
            </div>
            <div className="p-6 space-y-4">
              {[
                { k: "truth", label: "All information is accurate." },
                {
                  k: "roster",
                  label: "Roster status depends on engagement.",
                },
                {
                  k: "data",
                  label: "Consent to store data for casting.",
                },
                { k: "token", label: "I have saved my Access Key." },
              ].map((item) => (
                <label
                  key={item.k}
                  className="flex gap-3 items-start cursor-pointer group"
                >
                  <div
                    className={`mt-0.5 w-5 h-5 border rounded flex items-center justify-center transition-colors ${
                      checks[item.k]
                        ? "bg-gold border-gold text-midnight"
                        : "border-gray-500 group-hover:border-gold"
                    }`}
                  >
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={checks[item.k]}
                      onChange={() =>
                        setChecks({ ...checks, [item.k]: !checks[item.k] })
                      }
                    />
                    {checks[item.k] && <CheckSquare size={14} />}
                  </div>
                  <span className="text-xs text-gray-400 group-hover:text-white select-none pt-0.5">
                    {item.label}
                  </span>
                </label>
              ))}
            </div>
            <div className="p-5 bg-black/20 border-t border-gold/10 flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="text-xs text-gray-400 hover:text-white px-4 py-2 uppercase tracking-wider"
              >
                Cancel
              </button>
              <button
                onClick={submitFinal}
                disabled={!Object.values(checks).every(Boolean) || loading}
                className="bg-gold disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gold-light text-midnight text-xs font-bold px-6 py-3 rounded-lg uppercase tracking-wider transition-colors"
              >
                {loading ? "Saving..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
