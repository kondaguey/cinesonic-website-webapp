"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  LogOut,
  LayoutDashboard,
  Search,
  ChevronRight,
  ChevronLeft,
  Mic,
  Users,
  Flame,
  Rocket,
  Loader2,
  Menu,
} from "lucide-react";
import Button from "@/components/ui/Button";

const COLORS = {
  GOLD: "#d4af37",
  SILVER: "#c0c0c0",
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const Sidebar = ({
  selectedProject,
  onSelectProject,
  onLogout,
  onDashboardClick,
  refreshTrigger,
}) => {
  const [projects, setProjects] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    fetchSidebarData();
  }, [refreshTrigger]);

  const fetchSidebarData = async () => {
    try {
      setLoading(true);

      // Get User
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, email")
          .eq("id", user.id)
          .single();
        setUserProfile({
          name: profile?.full_name || "Crew",
          email: user.email,
          initial: (profile?.full_name || user.email || "C")
            .charAt(0)
            .toUpperCase(),
        });
      }

      // Get Projects
      const { data: activeProds, error } = await supabase
        .from("active_productions")
        .select(
          "id, project_ref_id, title, production_status, is_priority, style"
        )
        .neq("production_status", "Archived")
        .order("greenlit_at", { ascending: false });

      if (error) throw error;
      setProjects(activeProds || []);
    } catch (err) {
      console.error("Sidebar Sync Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // STYLE LOGIC
  const getProjectStyle = (project) => {
    const styleCode = (project.style || "").toUpperCase();
    const titleRaw = (project.title || "").toLowerCase();

    let TypeIcon = Mic;
    if (styleCode.includes("MULTI") || titleRaw.includes("multi"))
      TypeIcon = Rocket;
    else if (styleCode.includes("DUET") || titleRaw.includes("duet"))
      TypeIcon = Flame;
    else if (styleCode.includes("DUAL") || titleRaw.includes("dual"))
      TypeIcon = Users;

    const isCinematic = styleCode.endsWith("AD");
    const themeColor = isCinematic ? COLORS.GOLD : COLORS.SILVER;

    return { themeColor, TypeIcon };
  };

  const displayProjects = projects.filter((p) => {
    if (!searchTerm) return true;
    const lower = searchTerm.toLowerCase();
    return (
      (p.title || "").toLowerCase().includes(lower) ||
      (p.project_ref_id || "").toLowerCase().includes(lower)
    );
  });

  return (
    <>
      <style jsx>{`
        .gold-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .gold-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .gold-scroll::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 10px;
        }
      `}</style>

      <div
        className={`h-full bg-[#0a0a0a] border-r border-white/10 flex flex-col shadow-2xl relative z-20 transition-all duration-300 ease-in-out ${
          isCollapsed ? "w-20" : "w-80"
        }`}
      >
        {/* HEADER */}
        <div
          className={`p-4 border-b border-white/10 bg-gradient-to-r from-[#0c0442] to-transparent flex items-center ${
            isCollapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!isCollapsed && (
            <div className="overflow-hidden whitespace-nowrap animate-in fade-in duration-300">
              <h1 className="text-xl font-serif font-bold text-[#d4af37] tracking-wider mb-1">
                CINESONIC
              </h1>
              <div className="flex items-center gap-3 mt-2">
                <div className="w-8 h-8 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] font-bold border border-[#d4af37]/30 shrink-0">
                  {userProfile?.initial || "C"}
                </div>
                <div className="text-xs font-bold text-white truncate">
                  {userProfile?.name?.split(" ")[0] || "Crew"}
                </div>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* CONTROLS */}
        <div className="p-3 space-y-3 bg-[#050510] sticky top-0 z-10 border-b border-white/5">
          {/* 🟢 UPDATED DASHBOARD BUTTON */}
          <button
            onClick={onDashboardClick}
            title="Dashboard"
            className={`w-full flex items-center gap-3 p-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-200 border ${
              !selectedProject
                ? "bg-[#d4af37] text-black border-[#d4af37] shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                : "bg-transparent text-gray-500 border-white/5 hover:bg-[#d4af37]/10 hover:text-[#d4af37] hover:border-[#d4af37]/30"
            } ${isCollapsed ? "justify-center px-0" : ""}`}
          >
            <LayoutDashboard size={18} className="shrink-0" />
            {!isCollapsed && <span className="truncate">Dashboard</span>}
          </button>

          {!isCollapsed && (
            <div className="relative group animate-in fade-in slide-in-from-top-2 duration-300">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 group-focus-within:text-[#d4af37] transition-colors" />
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/20 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-xs text-white focus:border-[#d4af37]/50 focus:bg-black/40 outline-none transition-all placeholder:text-gray-600"
              />
            </div>
          )}
        </div>

        {/* ACTIVE STATUS HEADER */}
        {!isCollapsed && (
          <div className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] flex items-center gap-2 border-b border-white/5 bg-[#0a0a0a]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
            Active Operations
          </div>
        )}

        {/* LIST */}
        <div className="flex-1 overflow-y-auto gold-scroll p-2 space-y-2 bg-[#020010]">
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2
                className="animate-spin text-[#d4af37]"
                size={isCollapsed ? 20 : 24}
              />
            </div>
          ) : displayProjects.length === 0 ? (
            !isCollapsed && (
              <div className="text-center py-10 text-gray-500 text-xs italic">
                No projects found.
              </div>
            )
          ) : (
            displayProjects.map((p) => {
              const isSelected = selectedProject && selectedProject.id === p.id;
              const { themeColor, TypeIcon } = getProjectStyle(p);

              return (
                <button
                  key={p.id}
                  onClick={() => onSelectProject(p)}
                  title={isCollapsed ? p.title : ""}
                  className={`w-full text-left rounded-xl transition-all duration-200 group relative overflow-hidden border ${
                    isSelected
                      ? "bg-white/10 shadow-lg"
                      : "bg-[#0a0a0a] hover:bg-white/5 border-transparent hover:border-white/10"
                  } ${isCollapsed ? "p-3 flex justify-center" : "p-3.5"}`}
                  style={{
                    borderColor: isSelected
                      ? themeColor
                      : "rgba(255,255,255,0.05)",
                    boxShadow: isSelected
                      ? `inset 3px 0 0 0 ${themeColor}`
                      : "none",
                  }}
                >
                  {isCollapsed ? (
                    <div className="relative">
                      <TypeIcon
                        size={20}
                        style={{ color: isSelected ? "white" : themeColor }}
                      />
                      {p.is_priority && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0a0a0a]" />
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-between items-start relative z-10 animate-in fade-in duration-200">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-[9px] font-mono text-gray-500 border border-white/10 px-1.5 py-0.5 rounded bg-black/30">
                            {p.project_ref_id || "NEW"}
                          </span>
                          {p.is_priority && (
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                          )}
                        </div>
                        <div
                          className={`font-serif font-bold text-sm truncate mb-2 ${
                            isSelected
                              ? "text-white"
                              : "text-gray-300 group-hover:text-white"
                          }`}
                        >
                          {p.title || "Untitled Project"}
                        </div>
                        <span
                          className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded flex items-center gap-1.5 border w-fit"
                          style={{
                            color: isSelected ? "white" : themeColor,
                            backgroundColor: isSelected
                              ? `${themeColor}20`
                              : "transparent",
                            borderColor: `${themeColor}30`,
                          }}
                        >
                          <TypeIcon size={10} />{" "}
                          {p.production_status || "Active"}
                        </span>
                      </div>
                      {isSelected && (
                        <ChevronRight
                          className="w-4 h-4 mt-1"
                          style={{ color: themeColor }}
                        />
                      )}
                    </div>
                  )}
                </button>
              );
            })
          )}
        </div>

        {/* FOOTER */}
        <div
          className={`p-4 border-t border-white/10 bg-black/40 ${
            isCollapsed ? "flex justify-center" : ""
          }`}
        >
          <Button
            onClick={onLogout}
            variant="ghost"
            color="#ef4444"
            className={`justify-center text-xs uppercase tracking-widest hover:bg-red-500/10 ${
              isCollapsed ? "w-10 h-10 p-0 rounded-full" : "w-full"
            }`}
          >
            <LogOut className={`w-3 h-3 ${!isCollapsed && "mr-2"}`} />{" "}
            {!isCollapsed && "Sign Out"}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
