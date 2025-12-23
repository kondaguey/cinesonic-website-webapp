"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Inbox,
  Search,
  ArrowUpDown,
  Clapperboard,
  Mic,
  FileText,
  DollarSign,
  Loader2,
  Layers,
  CheckCircle,
  Archive,
  PlayCircle,
  Activity,
  ArrowRight,
  X,
} from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import Badge from "@/components/ui/Badge";
import IntakeModal from "./IntakeModal";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// --- HELPERS ---

const getServiceTheme = (styleRaw) => {
  const style = (styleRaw || "").toUpperCase();

  if (style.endsWith("AD")) {
    return {
      hex: "#d4af37",
      label: "Audio Drama",
      icon: Clapperboard,
      bg: "rgba(212, 175, 55, 0.1)",
      border: "rgba(212, 175, 55, 0.4)",
      text: "text-[#d4af37]",
      highlight: "bg-[#d4af37]/20 text-[#d4af37]",
    };
  }

  return {
    hex: "#c0c0c0",
    label: "Audiobook",
    icon: Mic,
    bg: "rgba(255, 255, 255, 0.05)",
    border: "rgba(255, 255, 255, 0.2)",
    text: "text-gray-400",
    highlight: "bg-white/10 text-gray-300",
  };
};

const deriveBaseFormat = (styleCode) => {
  const s = (styleCode || "").toUpperCase();
  if (s.startsWith("SOLO")) return "Solo";
  if (s.startsWith("DUAL")) return "Dual";
  if (s.startsWith("DUET")) return "Duet";
  if (s.startsWith("MULTI")) return "Multi";
  return "Solo";
};

export default function IntakeRequests({ onGreenlightComplete }) {
  // STATE: LISTS
  const [intakes, setIntakes] = useState([]);
  const [activeProjects, setActiveProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [selectedIntake, setSelectedIntake] = useState(null);

  // STATE: SEARCH & FILTER
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOption, setSortOption] = useState("newest");
  const [isSaving, setIsSaving] = useState(false);

  // STATE: GLOBAL SEARCH DROPDOWN
  const [globalSuggestions, setGlobalSuggestions] = useState([]);
  const [isSearchingGlobal, setIsSearchingGlobal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  // VIEW STATE: 'pending' | 'active' | 'completed'
  const [mainTab, setMainTab] = useState("pending");

  // --- 1. DATA FETCHING ---

  const fetchIntakes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("project_intake")
        .select("*")
        .neq("status", "Greenlit")
        .order("created_at", { ascending: false });

      if (data) {
        const formatted = data.map((i) => ({
          ...i,
          id: i.intake_ref_id || i.id.substring(0, 8).toUpperCase(),
          db_id: i.id,
          timestamp: i.created_at,
          priceTier: i.price_tier || "$",
          clientType: i.client_type || "Client",
          theme: getServiceTheme(i.style),
          base_format: i.base_format || deriveBaseFormat(i.style),
        }));
        setIntakes(formatted);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchActiveProjects = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("active_productions")
        .select("*")
        .neq("production_status", "Complete")
        .neq("production_status", "Cancelled")
        .order("updated_at", { ascending: false });

      if (data) {
        const formatted = data.map((p) => ({
          ...p,
          id: p.project_ref_id,
          db_id: p.id,
          timestamp: p.greenlit_at || p.created_at,
          project_title: p.title,
          // Derive missing fields
          base_format: deriveBaseFormat(p.style),
          priceTier: p.production_status,
          theme: getServiceTheme(p.style),
        }));
        setActiveProjects(formatted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompletedProjects = async () => {
    // Placeholder for now
    setLoading(false);
  };

  useEffect(() => {
    if (mainTab === "pending") fetchIntakes();
    if (mainTab === "active") fetchActiveProjects();
    if (mainTab === "completed") fetchCompletedProjects();
  }, [mainTab]);

  // --- 2. GLOBAL SEARCH LOGIC ---

  // Handle outside click to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Run Search on Debounce
  useEffect(() => {
    const runGlobalSearch = async () => {
      if (searchTerm.length < 2) {
        setGlobalSuggestions([]);
        setShowDropdown(false);
        return;
      }

      setIsSearchingGlobal(true);
      setShowDropdown(true);

      const query = `%${searchTerm}%`;
      const suggestions = [];

      // A. Search Pending
      const { data: pendingData } = await supabase
        .from("project_intake")
        .select("project_title, intake_ref_id, client_name")
        .neq("status", "Greenlit")
        .ilike("project_title", query)
        .limit(3);

      if (pendingData)
        pendingData.forEach((p) =>
          suggestions.push({
            type: "pending",
            label: "Pending Request",
            title: p.project_title,
            id: p.intake_ref_id,
            client: p.client_name,
          })
        );

      // B. Search Active
      const { data: activeData } = await supabase
        .from("active_productions")
        .select("title, project_ref_id, client_name, production_status")
        .neq("production_status", "Complete")
        .ilike("title", query)
        .limit(3);

      if (activeData)
        activeData.forEach((p) =>
          suggestions.push({
            type: "active",
            label: "Active Floor",
            title: p.title,
            id: p.project_ref_id,
            client: p.client_name,
          })
        );

      setGlobalSuggestions(suggestions);
      setIsSearchingGlobal(false);
    };

    const timer = setTimeout(runGlobalSearch, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const handleSuggestionClick = (s) => {
    setMainTab(s.type); // Switch tab
    setSearchTerm(s.title); // Set filter
    setShowDropdown(false); // Close dropdown
  };

  // --- 3. FILTER & RENDER LOGIC ---

  const currentList = useMemo(() => {
    if (mainTab === "active") return activeProjects;
    if (mainTab === "completed") return completedProjects;
    return intakes;
  }, [mainTab, intakes, activeProjects, completedProjects]);

  const processedList = useMemo(() => {
    let result = [...currentList];

    // Local Search Filter (Runs in tandem with Global Search)
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      result = result.filter(
        (i) =>
          (i.project_title || "").toLowerCase().includes(lower) ||
          (i.client_name || "").toLowerCase().includes(lower) ||
          (i.id || "").toLowerCase().includes(lower)
      );
    }

    if (activeFilter !== "All") {
      result = result.filter((i) => {
        return (
          (i.base_format || "").toLowerCase() === activeFilter.toLowerCase()
        );
      });
    }

    result.sort((a, b) => {
      if (sortOption === "newest")
        return new Date(b.timestamp) - new Date(a.timestamp);
      if (sortOption === "oldest")
        return new Date(a.timestamp) - new Date(b.timestamp);
      if (sortOption === "title")
        return a.project_title.localeCompare(b.project_title);
      return 0;
    });

    return result;
  }, [currentList, searchTerm, activeFilter, sortOption]);

  const handleGreenLight = async () => {
    if (!selectedIntake) return;
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from("project_intake")
        .update({ status: "Greenlit" })
        .eq("id", selectedIntake.db_id);
      if (error) throw error;
      setSelectedIntake(null);
      await fetchIntakes();
      if (onGreenlightComplete) onGreenlightComplete();
    } catch (err) {
      alert("Error: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mt-12 animate-in fade-in duration-500 relative z-10">
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row justify-between items-end xl:items-center gap-6 mb-8">
        <div>
          <SectionHeader
            icon={
              mainTab === "active"
                ? Activity
                : mainTab === "completed"
                ? Archive
                : Inbox
            }
            title={
              mainTab === "active"
                ? "Active Productions"
                : mainTab === "completed"
                ? "Project Archives"
                : "The Tank"
            }
            subtitle={`${processedList.length} ${
              mainTab === "active"
                ? "Live Projects"
                : mainTab === "completed"
                ? "Completed Titles"
                : "Pending Requests"
            }`}
            color="text-[#d4af37]"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto relative z-50">
          {/* 🟢 SMART SEARCH BAR */}
          <div
            className="relative group flex-1 sm:w-72"
            ref={searchContainerRef}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#d4af37] transition-colors" />
            <input
              type="text"
              placeholder="Omni-Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                if (searchTerm.length >= 2) setShowDropdown(true);
              }}
              className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-sm focus:border-[#d4af37] outline-none transition-all placeholder:text-gray-500 text-gray-200"
            />
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setShowDropdown(false);
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
              >
                <X size={14} />
              </button>
            )}

            {/* 🟢 GLOBAL SEARCH DROPDOWN */}
            {showDropdown && (
              <div className="absolute top-full left-0 w-full mt-2 bg-[#0a0a0a] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1">
                {isSearchingGlobal ? (
                  <div className="p-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                    <Loader2 size={12} className="animate-spin" /> Scanning
                    Database...
                  </div>
                ) : globalSuggestions.length === 0 ? (
                  <div className="p-4 text-center text-xs text-gray-500 italic">
                    No global matches found.
                  </div>
                ) : (
                  <div className="max-h-64 overflow-y-auto custom-scrollbar">
                    <div className="px-3 py-2 text-[9px] font-bold uppercase tracking-widest text-gray-600 bg-white/5">
                      Suggested Results
                    </div>
                    {globalSuggestions.map((s, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(s)}
                        className="w-full text-left px-4 py-3 hover:bg-white/5 border-b border-white/5 last:border-0 transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-sm font-bold text-white group-hover:text-[#d4af37] transition-colors">
                            {s.title}
                          </div>
                          <div className="text-[10px] text-gray-500 flex items-center gap-2">
                            {s.client} •{" "}
                            <span className="font-mono opacity-50">{s.id}</span>
                          </div>
                        </div>
                        <Badge
                          label={s.label}
                          color={s.type === "active" ? "#3b82f6" : "#d4af37"}
                          bg={
                            s.type === "active"
                              ? "rgba(59,130,246,0.1)"
                              : "rgba(212,175,55,0.1)"
                          }
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SORT */}
          <div className="relative min-w-[140px]">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:border-[#d4af37] outline-none appearance-none cursor-pointer text-gray-300"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* MAIN VIEW TOGGLE */}
      <div className="flex gap-6 border-b border-white/10 mb-6">
        {[
          { id: "pending", label: "Intake (Pending)" },
          { id: "active", label: "Active Floor" },
          { id: "completed", label: "Archive" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setMainTab(tab.id);
              setActiveFilter("All");
              setSearchTerm("");
            }}
            className={`pb-3 px-2 text-sm font-bold uppercase tracking-wider transition-all relative ${
              mainTab === tab.id
                ? "text-[#d4af37]"
                : "text-gray-500 hover:text-white"
            }`}
          >
            {tab.label}
            {mainTab === tab.id && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#d4af37] shadow-[0_0_10px_#d4af37]" />
            )}
          </button>
        ))}
      </div>

      {/* UNIVERSAL FILTERS */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-4 custom-scrollbar">
        {["All", "Solo", "Dual", "Duet", "Multi"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap ${
              activeFilter === filter
                ? "bg-[#d4af37] text-black border-[#d4af37]"
                : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* VIEW: CONTENT */}
      {loading ? (
        <div className="py-20 flex justify-center border border-white/5 border-dashed rounded-2xl bg-white/[0.02]">
          <Loader2 className="animate-spin text-[#d4af37] w-8 h-8" />
        </div>
      ) : processedList.length === 0 ? (
        <div className="py-20 text-center border border-white/5 border-dashed rounded-2xl text-gray-500 bg-white/[0.02]">
          {mainTab === "active"
            ? "No active productions match your filters."
            : mainTab === "completed"
            ? "No archived projects match your filters."
            : "No pending requests match your filters."}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedList.map((item) => {
            const { hex, label, icon: Icon, bg, border, text } = item.theme;

            return (
              <div
                key={item.id}
                onClick={() =>
                  mainTab === "pending" ? setSelectedIntake(item) : null
                }
                className={`group relative bg-[#0a0a0a] border rounded-2xl p-6 transition-all hover:-translate-y-1 hover:shadow-2xl overflow-hidden ${
                  mainTab === "pending" ? "cursor-pointer" : "cursor-default"
                }`}
                style={{ borderColor: border }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4 relative z-10">
                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-mono text-gray-500 bg-white/5 px-1.5 py-0.5 rounded w-fit">
                      {item.id}
                    </span>
                    <Badge
                      label={label}
                      color={hex}
                      bg={bg}
                      border={border}
                      className="backdrop-blur-md"
                    />
                  </div>
                  <div className="text-[10px] text-gray-500 font-mono text-right">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </div>
                </div>

                {/* Content */}
                <div className="relative z-10 mt-4">
                  <h3
                    className={`text-xl font-serif font-bold mb-1 truncate transition-colors text-white group-hover:${text}`}
                  >
                    {item.project_title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-6 truncate">
                    {item.client_name}
                  </p>

                  {/* Metadata Footer */}
                  <div className="flex items-center gap-4 text-[11px] uppercase tracking-wider text-gray-500 border-t border-white/5 pt-4">
                    {mainTab === "pending" ? (
                      // PENDING FOOTER
                      <>
                        <span
                          className="flex items-center gap-1.5"
                          title="Word Count"
                        >
                          <FileText size={12} />{" "}
                          {Number(item.word_count).toLocaleString()}
                        </span>
                        <span
                          className="flex items-center gap-1.5 text-gray-300"
                          title="Format"
                        >
                          <Layers size={12} /> {item.base_format}
                        </span>
                        <span
                          className="flex items-center gap-1.5"
                          title="Price Tier"
                        >
                          <DollarSign size={12} /> {item.priceTier}
                        </span>
                      </>
                    ) : (
                      // ACTIVE / COMPLETED FOOTER
                      <div className="flex items-center justify-between w-full">
                        <span
                          className="flex items-center gap-1.5 text-blue-400 font-bold"
                          title="Status"
                        >
                          <Activity size={12} /> {item.priceTier}
                        </span>
                        <span
                          className="flex items-center gap-1.5 text-gray-500"
                          title="Format"
                        >
                          <Layers size={12} /> {item.base_format}
                        </span>
                      </div>
                    )}

                    <span className="ml-auto opacity-50 group-hover:opacity-100 transition-opacity">
                      <Icon size={16} style={{ color: hex }} />
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <IntakeModal
        intake={selectedIntake}
        onClose={() => setSelectedIntake(null)}
        onGreenlight={handleGreenLight}
        isSaving={isSaving}
      />
    </div>
  );
}
