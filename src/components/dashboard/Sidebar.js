import React, { useState } from "react";
import {
  LogOut,
  LayoutDashboard,
  Search,
  ChevronRight,
  FolderOpen,
} from "lucide-react";

// --- ATOMS ---
import Button from "../ui/Button";

const Sidebar = ({
  user,
  projects,
  selectedProject,
  onSelectProject,
  onLogout,
  onDashboardClick,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const displayProjects = projects.filter((p) => {
    if (!searchTerm) return true;
    const lowerTerm = searchTerm.toLowerCase();
    const title = (p["Title"] || "").toLowerCase();
    const pid = (p["Project ID"] || "").toLowerCase();
    return title.includes(lowerTerm) || pid.includes(lowerTerm);
  });

  return (
    <>
      {/* 🟢 CSS FOR GOLD SCROLLBAR */}
      <style jsx>{`
        .gold-scroll::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        .gold-scroll::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
        }
        .gold-scroll::-webkit-scrollbar-thumb {
          background-color: #d4af37;
          border-radius: 10px;
        }
      `}</style>

      <div className="w-80 h-full bg-[#0a0a0a]/95 border-r border-[#d4af37]/20 flex flex-col shadow-2xl relative z-20 backdrop-blur-xl">
        {/* --- HEADER --- */}
        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-[#0c0442] to-transparent">
          <h1 className="text-2xl font-serif font-bold text-[#d4af37] tracking-wider mb-1">
            CINESONIC
          </h1>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-10 h-10 rounded-full bg-[#d4af37]/20 flex items-center justify-center text-[#d4af37] font-bold border border-[#d4af37]/30">
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

        {/* --- CONTROLS --- */}
        <div className="p-4 space-y-4 bg-[#0c0442]/95 backdrop-blur-sm sticky top-0 z-10 border-b border-white/5">
          {/* Dashboard Nav Item */}
          <Button
            onClick={onDashboardClick}
            variant={!selectedProject ? "solid" : "ghost"}
            color="#d4af37"
            className={`justify-start ${
              !selectedProject
                ? "shadow-lg shadow-[#d4af37]/20"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Button>

          {/* Search Input */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-[#d4af37] transition-colors" />
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#d4af37]/50 focus:bg-black/40 outline-none transition-all placeholder:text-gray-600"
            />
          </div>
        </div>

        {/* --- PROJECT LIST --- */}
        <div className="flex-1 overflow-y-auto gold-scroll p-3 pr-2 space-y-2">
          {displayProjects.length === 0 ? (
            <div className="text-center py-10 opacity-50">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 text-gray-600" />
              <div className="text-xs text-gray-500">No projects found</div>
            </div>
          ) : (
            displayProjects.map((p) => {
              const isSelected =
                selectedProject &&
                selectedProject["Project ID"] === p["Project ID"];
              return (
                <button
                  key={p["Project ID"]}
                  onClick={() => onSelectProject(p)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 group relative overflow-hidden ${
                    isSelected
                      ? "bg-gradient-to-r from-[#d4af37]/10 to-transparent border-l-2 border-[#d4af37]"
                      : "hover:bg-white/5 border-l-2 border-transparent hover:border-white/20"
                  }`}
                >
                  <div className="flex justify-between items-start relative z-10">
                    <div className="min-w-0 flex-1">
                      <div
                        className={`font-bold text-sm truncate mb-1 ${
                          isSelected
                            ? "text-white"
                            : "text-gray-300 group-hover:text-white"
                        }`}
                      >
                        {p["Title"] || "Untitled Project"}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider">
                        <span
                          className={`${
                            isSelected ? "text-[#d4af37]" : "text-gray-500"
                          }`}
                        >
                          {p["Project ID"]}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded-sm bg-white/5 ${
                            isSelected ? "text-gray-300" : "text-gray-600"
                          }`}
                        >
                          {p["Status"]}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <ChevronRight className="w-4 h-4 text-[#d4af37] animate-pulse" />
                    )}
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* --- FOOTER --- */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <Button
            onClick={onLogout}
            variant="ghost"
            color="#ef4444"
            className="w-full justify-center"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>
    </>
  );
};
export default Sidebar;
