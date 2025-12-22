import React from "react";
import {
  BookOpen,
  Globe,
  PenTool,
  DollarSign,
  FileText,
  Phone,
  MapPin,
  Mail,
  Library,
  Star,
  Lock,
  Users,
} from "lucide-react";

export default function AuthorEditor({ formData, setFormData, theme }) {
  // --- HELPERS (Standard Zipper Logic) ---
  const updateField = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateJson = (section, rootField, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [rootField]: {
          ...prev[section]?.[rootField],
          [key]: value,
        },
      },
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      {/* === 1. THE LIBRARY (Public Roster) === */}
      <div className={`p-4 rounded-xl border ${theme.border} bg-orange-500/5`}>
        <h3 className="text-xs font-bold text-orange-500 uppercase tracking-widest flex items-center gap-2 mb-4">
          <BookOpen size={12} /> The Library (Public)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Identity */}
          <div className="col-span-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Pen Name / Display Name
            </label>
            <input
              value={formData.public?.display_name || ""}
              onChange={(e) =>
                updateField("public", "display_name", e.target.value)
              }
              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-xs ${theme.text}`}
            />
          </div>

          <div className="col-span-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Author Bio
            </label>
            <textarea
              rows={3}
              value={formData.public?.bio || ""}
              onChange={(e) => updateField("public", "bio", e.target.value)}
              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-xs ${theme.text}`}
            />
          </div>

          {/* URLs */}
          <div className="col-span-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Website / Amazon Author Page
            </label>
            <div className="relative">
              <Globe
                size={12}
                className="absolute left-3 top-2.5 text-slate-500"
              />
              <input
                value={formData.public?.website_url || ""}
                onChange={(e) =>
                  updateField("public", "website_url", e.target.value)
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg pl-8 pr-3 py-2 text-xs ${theme.text}`}
              />
            </div>
          </div>

          {/* Published Works (Simplified JSON Editor) */}
          <div className="col-span-2 p-3 bg-white/5 rounded-lg border border-dashed border-white/10">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
              <Library size={10} /> Notable Works (Manual Entry)
            </div>
            {/* Note: In a real app we might want a full array builder, but for "God Mode" simple text edits are often safer */}
            <div className="space-y-2">
              <label className="text-[8px] text-slate-500 uppercase">
                JSON Data (Edit Carefully)
              </label>
              <textarea
                rows={3}
                placeholder='[{"title": "Book One", "year": "2024"}]'
                value={JSON.stringify(
                  formData.public?.published_works || [],
                  null,
                  2
                )}
                onChange={(e) => {
                  try {
                    updateField(
                      "public",
                      "published_works",
                      JSON.parse(e.target.value)
                    );
                  } catch (err) {
                    // Don't update state on invalid JSON to prevent crash,
                    // or handle with local state buffer.
                    // For now, we trust the Admin knows JSON.
                  }
                }}
                className={`w-full ${theme.inputBg} border ${theme.border} rounded px-2 py-1 text-[10px] font-mono ${theme.text}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* === 2. THE VAULT (Private Data) === */}
      <div className={`p-4 rounded-xl border ${theme.border} bg-indigo-500/5`}>
        <h3 className="text-xs font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-2 mb-4">
          <Lock size={12} /> The Vault (Private)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Legal Name */}
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Legal First
            </label>
            <input
              value={formData.private?.legal_first_name || ""}
              onChange={(e) =>
                updateField("private", "legal_first_name", e.target.value)
              }
              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-xs ${theme.text}`}
            />
          </div>
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Legal Last
            </label>
            <input
              value={formData.private?.legal_last_name || ""}
              onChange={(e) =>
                updateField("private", "legal_last_name", e.target.value)
              }
              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-xs ${theme.text}`}
            />
          </div>

          {/* Contact */}
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Direct Phone
            </label>
            <div className="relative">
              <Phone
                size={12}
                className="absolute left-3 top-2.5 text-slate-500"
              />
              <input
                value={formData.private?.phone_number || ""}
                onChange={(e) =>
                  updateField("private", "phone_number", e.target.value)
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg pl-8 pr-3 py-2 text-xs ${theme.text}`}
              />
            </div>
          </div>
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Direct Email
            </label>
            <div className="relative">
              <Mail
                size={12}
                className="absolute left-3 top-2.5 text-slate-500"
              />
              <input
                value={formData.private?.direct_email || ""}
                onChange={(e) =>
                  updateField("private", "direct_email", e.target.value)
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg pl-8 pr-3 py-2 text-xs ${theme.text}`}
              />
            </div>
          </div>

          <div className="col-span-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Mailing Address (Royalty Checks)
            </label>
            <div className="relative">
              <MapPin
                size={12}
                className="absolute left-3 top-2.5 text-slate-500"
              />
              <input
                value={formData.private?.mailing_address || ""}
                onChange={(e) =>
                  updateField("private", "mailing_address", e.target.value)
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg pl-8 pr-3 py-2 text-xs ${theme.text}`}
              />
            </div>
          </div>

          {/* Agent Info */}
          <div className="col-span-2 p-3 bg-white/5 rounded-lg border border-dashed border-white/10">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
              <Users size={10} /> Literary Agent
            </div>
            <div className="grid grid-cols-2 gap-2">
              <input
                placeholder="Agency Name"
                value={formData.private?.agent_contact_info?.agency || ""}
                onChange={(e) =>
                  updateJson(
                    "private",
                    "agent_contact_info",
                    "agency",
                    e.target.value
                  )
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded px-2 py-1 text-xs ${theme.text}`}
              />
              <input
                placeholder="Agent Name"
                value={formData.private?.agent_contact_info?.name || ""}
                onChange={(e) =>
                  updateJson(
                    "private",
                    "agent_contact_info",
                    "name",
                    e.target.value
                  )
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded px-2 py-1 text-xs ${theme.text}`}
              />
              <div className="col-span-2">
                <input
                  placeholder="Agent Email"
                  value={formData.private?.agent_contact_info?.email || ""}
                  onChange={(e) =>
                    updateJson(
                      "private",
                      "agent_contact_info",
                      "email",
                      e.target.value
                    )
                  }
                  className={`w-full ${theme.inputBg} border ${theme.border} rounded px-2 py-1 text-xs ${theme.text}`}
                />
              </div>
            </div>
          </div>

          {/* Contracts */}
          <div className="col-span-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Master Agreement URL
            </label>
            <div className="relative">
              <FileText
                size={12}
                className="absolute left-3 top-2.5 text-slate-500"
              />
              <input
                value={formData.private?.royalty_agreement_url || ""}
                onChange={(e) =>
                  updateField(
                    "private",
                    "royalty_agreement_url",
                    e.target.value
                  )
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg pl-8 pr-3 py-2 text-xs ${theme.text}`}
              />
            </div>
          </div>

          {/* Featured Toggle (Private Table per your Schema) */}
          <div className="col-span-2 flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
            <Star
              size={16}
              className={
                formData.private?.is_featured
                  ? "text-yellow-400"
                  : "text-slate-600"
              }
            />
            <div className="flex-1">
              <div className="text-xs font-bold uppercase">Featured Author</div>
              <div className="text-[10px] text-slate-500">
                Promote to main library showcase
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.private?.is_featured || false}
              onChange={(e) =>
                updateField("private", "is_featured", e.target.checked)
              }
              className="w-4 h-4 accent-orange-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
