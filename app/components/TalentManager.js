import React, { useState } from "react";
import { Search, ArrowLeft, ExternalLink } from "lucide-react";

const TalentManager = ({ data, onBack }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const safeData = Array.isArray(data) ? data : [];

  const filteredData = safeData.filter((actor) => {
    const searchLower = searchTerm.toLowerCase();
    const name = (actor.name || "").toLowerCase();
    const voice = (actor.voice || "").toLowerCase();
    const genres = (actor.genres || "").toLowerCase();
    const pseudo = (actor.pseudonym || "").toLowerCase();
    return (
      name.includes(searchLower) ||
      voice.includes(searchLower) ||
      genres.includes(searchLower) ||
      pseudo.includes(searchLower)
    );
  });

  return (
    <div className="flex flex-col h-full animate-fade-in-down space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-2 shrink-0">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <button
            onClick={onBack}
            className="group flex items-center justify-center w-10 h-10 rounded-full bg-white/5 hover:bg-gold/20 text-white hover:text-gold border border-white/10 hover:border-gold/50 transition-all shadow-lg"
            title="Return to Dashboard"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          <div>
            <h2 className="text-2xl font-serif font-bold text-white">
              Talent Database
            </h2>
          </div>
        </div>
        <div className="relative w-full md:w-96 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-gold transition w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/20 border border-gold/20 text-white text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-gold/50 transition shadow-inner placeholder:text-gray-600"
          />
        </div>
      </div>
      <div className="flex-1 bg-midnight border border-gold/20 rounded-xl shadow-2xl overflow-hidden flex flex-col relative">
        <div className="overflow-x-auto overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gold/20 scrollbar-track-transparent">
          <table className="w-full text-left border-collapse min-w-[2000px]">
            <thead className="sticky top-0 z-10 bg-[#0a0a0a] border-b border-white/10">
              <tr className="text-[10px] uppercase tracking-widest text-gray-400">
                <th className="p-4 font-bold w-[200px]">Actor Name</th>
                <th className="p-4 font-bold w-[120px]">ID</th>
                <th className="p-4 font-bold w-[200px]">Email</th>
                <th className="p-4 font-bold w-[150px]">Pseudonym</th>
                <th className="p-4 font-bold w-[100px]">Gender</th>
                <th className="p-4 font-bold w-[100px]">Age Range</th>
                <th className="p-4 font-bold w-[200px]">Voice</th>
                <th className="p-4 font-bold w-[200px]">Genre(s)</th>
                <th className="p-4 font-bold w-[120px]">Status</th>
                <th className="p-4 font-bold w-[150px]">Next Avail</th>
                <th className="p-4 font-bold w-[100px]">Rate</th>
                <th className="p-4 font-bold w-[100px] text-center">Link</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm text-white">
              {filteredData.map((actor, idx) => (
                <tr
                  key={actor.id || idx}
                  className="hover:bg-white/[0.03] transition-colors"
                >
                  <td className="p-4 font-bold text-gold">{actor.name}</td>
                  <td className="p-4 font-mono text-xs opacity-70">
                    {actor.id}
                  </td>
                  <td className="p-4 text-gray-400 select-all">
                    {actor.email}
                  </td>
                  <td className="p-4 italic text-gray-500">
                    {actor.pseudonym || "-"}
                  </td>
                  <td className="p-4">{actor.gender}</td>
                  <td className="p-4">{actor.age_range}</td>
                  <td className="p-4">{actor.voice}</td>
                  <td className="p-4 text-xs">{actor.genres}</td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider border ${
                        (actor.status || "").toUpperCase().includes("ACTIVE")
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {actor.status}
                    </span>
                  </td>
                  <td className="p-4">{actor.next_avail}</td>
                  <td className="p-4 font-mono text-emerald-400">
                    {actor.rate}
                  </td>
                  <td className="p-4 text-center">
                    {actor.link ? (
                      <a
                        href={actor.link}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 bg-blue-500/10 text-blue-400 rounded hover:bg-blue-500 hover:text-white transition-all border border-blue-500/20"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    ) : (
                      <span className="opacity-10">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default TalentManager;
