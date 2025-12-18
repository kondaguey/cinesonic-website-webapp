import React, { useState } from "react";
import {
  LogOut,
  LayoutDashboard,
  Search,
  ChevronRight,
  FolderOpen,
  Clapperboard,
  Mic,
  Users,
  Flame,
  Rocket,
  BookOpen,
} from "lucide-react";
import Button from "../ui/Button";

const COLORS = {
  GOLD: "#d4af37",
  SILVER: "#c0c0c0",
};

const Sidebar = ({
  user,
  projects,
  selectedProject,
  onSelectProject,
  onLogout,
  onDashboardClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const getProjectStyle = (formatString) => {
    const raw = (formatString || "Solo Audiobook").toLowerCase();
    let TypeIcon = Mic;
    if (raw.includes("multi")) TypeIcon = Rocket;
    else if (raw.includes("duet")) TypeIcon = Flame;
    else if (raw.includes("dual")) TypeIcon = Users;

    const isCinematic = raw.includes("drama") || raw.includes("cinematic");
    const themeColor = isCinematic ? COLORS.GOLD : COLORS.SILVER;
    return { themeColor, TypeIcon, isCinematic };
  };

  const displayProjects = projects.filter((p) => {
    if (!searchTerm) return true;
    const lowerTerm = searchTerm.toLowerCase();
    const title = (p["Title"] || "").toLowerCase();
    const pid = (p["Project ID"] || "").toLowerCase();
    return title.includes(lowerTerm) || pid.includes(lowerTerm);
  });

  return (
    <>
      <style jsx>{`
        .gold-scroll::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .gold-scroll::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }
        .gold-scroll::-webkit-scrollbar-thumb {
          background-color: #333;
          border-radius: 10px;
        }
      `}</style>

      <div className="w-80 h-full bg-[#0a0a0a] border-r border-white/10 flex flex-col shadow-2xl relative z-20">
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#0c0442] to-transparent">
          <h1 className="text-2xl font-serif font-bold text-[#d4af37] tracking-wider mb-1">
            CINESONIC
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/10 flex items-center justify-center text-[#d4af37] font-bold border border-[#d4af37]/30">
              {(user?.name || "C").charAt(0)}
            </div>
            <div className="overflow-hidden">
              <div className="text-sm font-bold text-white truncate">
                {user?.name}
              </div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wider">
                Crew Access
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4 bg-[#050510] sticky top-0 z-10 border-b border-white/5">
          <button
            onClick={onDashboardClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold uppercase tracking-wider text-xs transition-all duration-200 border ${
              !selectedProject
                ? "bg-[#d4af37] text-black border-[#d4af37] scale-[1.02]"
                : "bg-white/5 text-gray-400 border-white/5 hover:bg-white/10 hover:text-white"
            }`}
          >
            <div
              className={`p-1.5 rounded-md ${
                !selectedProject ? "bg-black/10" : "bg-black/30"
              }`}
            >
              <LayoutDashboard size={18} />
            </div>
            Mission Control
          </button>
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#d4af37] transition-colors" />
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#d4af37]/50 focus:bg-black/40 outline-none transition-all placeholder:text-gray-600"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto gold-scroll p-3 space-y-2 bg-[#020010]">
          {displayProjects.map((p) => {
            const isSelected =
              selectedProject &&
              selectedProject["Project ID"] === p["Project ID"];
            const { themeColor, TypeIcon, isCinematic } = getProjectStyle(
              p["Format"]
            );
            return (
              <button
                key={p["Project ID"]}
                onClick={() => onSelectProject(p)}
                className={`w-full text-left p-3.5 rounded-xl transition-all duration-200 group relative overflow-hidden border ${
                  isSelected
                    ? "bg-white/10 shadow-lg"
                    : "bg-[#0a0a0a] hover:bg-white/5 border-transparent hover:border-white/10"
                }`}
                style={{
                  borderColor: isSelected
                    ? themeColor
                    : "rgba(255,255,255,0.05)",
                  boxShadow: isSelected
                    ? `inset 4px 0 0 0 ${themeColor}`
                    : "none",
                }}
              >
                <div className="flex justify-between items-start relative z-10">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[9px] font-mono text-gray-500 border border-white/10 px-1.5 py-0.5 rounded bg-black/30">
                        {p["Project ID"]}
                      </span>
                    </div>
                    <div
                      className={`font-serif font-bold text-sm truncate mb-2 ${
                        isSelected
                          ? "text-white"
                          : "text-gray-300 group-hover:text-white"
                      }`}
                    >
                      {p["Title"] || "Untitled Project"}
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
                      {p["Format"]?.split(" ")[0] || "Solo"}
                    </span>
                  </div>
                  {isSelected && (
                    <ChevronRight
                      className="w-4 h-4 mt-1"
                      style={{ color: themeColor }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/40">
          <Button
            onClick={onLogout}
            variant="ghost"
            color="#ef4444"
            className="w-full justify-center text-xs uppercase tracking-widest hover:bg-red-500/10"
          >
            <LogOut className="w-3 h-3 mr-2" /> Sign Out
          </Button>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
