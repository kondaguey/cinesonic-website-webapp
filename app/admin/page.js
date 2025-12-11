"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import {
  Loader2,
  Shield,
  AlertTriangle,
  ArrowLeft,
  LayoutDashboard,
  Clapperboard,
  CheckCircle,
  X,
} from "lucide-react";

// 🔴 REPLACE WITH YOUR V15 URL
const API_URL =
  "https://script.google.com/macros/s/AKfycbxjKTIkZgMvjuCv49KK00885LI5r2Ir6qMY7UGb29iqojgnhTck0stR__yejTODfLVO/exec";

export default function AdminPortal() {
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [crewUser, setCrewUser] = useState(null);

  // INTAKE DATA
  const [intakes, setIntakes] = useState([]);
  const [selectedIntake, setSelectedIntake] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  // --- LOGIN ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.get(`${API_URL}?op=crew_login&key=${accessKey}`);
      if (res.data.success) {
        setCrewUser(res.data.user);
        setView("dashboard");
        fetchIntakes(); // Load data on login
      } else {
        setError("Access Denied: Invalid Key");
      }
    } catch (err) {
      setError("Connection Error");
    }
    setLoading(false);
  };

  // --- FETCH INTAKES ---
  const fetchIntakes = async () => {
    try {
      const res = await axios.get(`${API_URL}?op=get_intakes`);
      if (res.data.success) {
        setIntakes(res.data.intakes);
      }
    } catch (e) {
      console.error("Fetch error", e);
    }
  };

  // --- APPROVE HANDLER ---
  const handleApprove = async () => {
    if (!selectedIntake) return;
    setProcessingId(selectedIntake.id);

    try {
      const res = await axios.post(
        API_URL,
        JSON.stringify({
          op: "approve_intake",
          intakeId: selectedIntake.id,
        }),
        { headers: { "Content-Type": "text/plain;charset=utf-8" } }
      );

      if (res.data.success) {
        alert(`Project Approved! Created ID: ${res.data.projectId}`);
        // Remove from local list
        setIntakes((prev) => prev.filter((i) => i.id !== selectedIntake.id));
        setSelectedIntake(null);
      } else {
        alert("Error: " + res.data.error);
      }
    } catch (err) {
      alert("Connection Failed");
    }
    setProcessingId(null);
  };

  // --- VIEW: LOGIN ---
  if (view === "login")
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)]">
        <Link
          href="/"
          className="absolute top-6 left-6 md:top-8 md:left-8 text-gold/60 hover:text-gold flex items-center gap-2 text-xs md:text-sm uppercase tracking-widest transition-colors z-10"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>
        <div className="w-full max-w-[400px] rounded-2xl border border-gold/30 backdrop-blur-2xl bg-black/40 p-10 shadow-2xl animate-fade-in-up">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-gold/30">
              <Shield className="w-8 h-8 text-gold" />
            </div>
            <h2 className="text-2xl font-serif text-gold mb-2">Crew Portal</h2>
            <p className="text-xs text-gray-400 uppercase tracking-[0.2em]">
              Authorized Personnel Only
            </p>
          </div>
          <form onSubmit={handleLogin} className="space-y-6">
            <input
              type="password"
              value={accessKey}
              onChange={(e) => setAccessKey(e.target.value)}
              className="w-full bg-white/5 border border-gold/20 text-white py-4 pl-4 pr-4 rounded-xl text-center text-lg tracking-[0.2em] outline-none focus:border-gold focus:shadow-[0_0_20px_rgba(212,175,55,0.2)] transition-all placeholder:text-gray-600 placeholder:text-sm placeholder:tracking-normal"
              placeholder="ACCESS KEY"
            />
            {error && (
              <div className="p-3 bg-red-900/20 border border-red-500/30 rounded-lg text-red-400 text-xs text-center flex items-center justify-center gap-2 animate-fade-in">
                <AlertTriangle size={14} /> {error}
              </div>
            )}
            <button
              disabled={loading}
              className="w-full bg-gold hover:bg-gold-light text-midnight font-bold py-4 rounded-xl uppercase tracking-widest flex justify-center gap-2 transition-all transform hover:-translate-y-0.5 shadow-lg shadow-gold/20"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Verify Credentials"
              )}
            </button>
          </form>
        </div>
      </div>
    );

  // --- VIEW: DASHBOARD ---
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_50%_0%,_#1a0f5e_0%,_#020014_70%)] text-white font-sans">
      {/* NAVBAR */}
      <div className="border-b border-gold/20 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img
              src="https://www.danielnotdaylewis.com/img/cinesonic_logo_banner_gold_16x9.png"
              className="h-8 object-contain"
            />
            <div className="h-6 w-px bg-gold/30"></div>
            <span className="font-serif text-gold text-lg tracking-widest">
              Casting Hub
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs uppercase tracking-widest text-gray-400">
            <span>
              {crewUser?.name} ({crewUser?.role})
            </span>
            <button
              onClick={() => setView("login")}
              className="text-red-400 hover:text-red-300 ml-4 border border-red-900/50 px-3 py-1 rounded bg-red-900/10"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-end">
          <h1 className="text-3xl font-serif text-white flex items-center gap-3">
            <LayoutDashboard className="text-gold" /> Crew Overview
          </h1>
          <button
            onClick={fetchIntakes}
            className="text-xs text-gold border border-gold/30 px-3 py-1 rounded hover:bg-gold/10"
          >
            Refresh Data
          </button>
        </div>

        {/* INTAKE LIST */}
        <div className="grid grid-cols-1 gap-6 mb-12">
          <h3 className="text-gold font-bold uppercase tracking-widest border-b border-white/10 pb-2 mb-4">
            New Project Requests ({intakes.length})
          </h3>

          {intakes.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white/5 rounded-xl border border-white/5">
              No new requests pending.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {intakes.map((intake) => (
                <div
                  key={intake.id}
                  onClick={() => setSelectedIntake(intake)}
                  className="bg-white/5 border border-white/10 p-5 rounded-xl hover:border-gold/50 cursor-pointer transition-all hover:bg-white/10 group"
                >
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] bg-gold/20 text-gold px-2 py-1 rounded border border-gold/10">
                      {intake.clientType}
                    </span>
                    <span className="text-[10px] text-gray-500">
                      {new Date(intake.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                  <h4 className="font-serif text-xl text-white group-hover:text-gold mb-1 truncate">
                    {intake.title}
                  </h4>
                  <p className="text-xs text-gray-400">{intake.clientName}</p>
                  <div className="mt-4 flex gap-2 text-[10px] text-gray-500 uppercase tracking-wider">
                    <span className="bg-black/30 px-2 py-1 rounded">
                      {intake.style}
                    </span>
                    <span className="bg-black/30 px-2 py-1 rounded">
                      {intake.wordCount} words
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* MODAL: INTAKE DETAIL */}
      {selectedIntake && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4">
          <div className="bg-midnight border border-gold/30 w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-black/40 p-6 border-b border-gold/20 flex justify-between items-center shrink-0">
              <div>
                <h2 className="text-2xl font-serif text-gold">
                  {selectedIntake.title}
                </h2>
                <p className="text-xs text-gray-400 uppercase tracking-widest">
                  {selectedIntake.id} • {selectedIntake.clientName}
                </p>
              </div>
              <button
                onClick={() => setSelectedIntake(null)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-8 overflow-y-auto custom-scrollbar space-y-6">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gold block text-xs uppercase mb-1">
                    Email
                  </span>
                  {selectedIntake.email}
                </div>
                <div>
                  <span className="text-gold block text-xs uppercase mb-1">
                    Word Count
                  </span>
                  {selectedIntake.wordCount}
                </div>
                <div>
                  <span className="text-gold block text-xs uppercase mb-1">
                    Style
                  </span>
                  {selectedIntake.style}
                </div>
                <div>
                  <span className="text-gold block text-xs uppercase mb-1">
                    Genres
                  </span>
                  {selectedIntake.genres}
                </div>
              </div>

              <div className="bg-white/5 p-4 rounded border border-white/10">
                <span className="text-gold block text-xs uppercase mb-2">
                  Character Breakdown
                </span>
                <pre className="text-xs text-gray-300 whitespace-pre-wrap font-sans">
                  {selectedIntake.characters}
                </pre>
              </div>

              <div className="bg-white/5 p-4 rounded border border-white/10">
                <span className="text-gold block text-xs uppercase mb-2">
                  Notes
                </span>
                <p className="text-sm text-gray-300">
                  {selectedIntake.notes || "None"}
                </p>
              </div>
            </div>

            <div className="p-6 bg-black/40 border-t border-gold/20 flex justify-end gap-4 shrink-0">
              <button
                onClick={() => setSelectedIntake(null)}
                className="px-4 py-2 text-gray-400 hover:text-white text-sm uppercase"
              >
                Close
              </button>
              <button
                onClick={handleApprove}
                disabled={processingId === selectedIntake.id}
                className="bg-gold hover:bg-gold-light text-midnight font-bold px-6 py-2 rounded uppercase tracking-widest text-sm flex items-center gap-2 disabled:opacity-50"
              >
                {processingId === selectedIntake.id ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <CheckCircle size={16} />
                )}
                Approve & Explode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
