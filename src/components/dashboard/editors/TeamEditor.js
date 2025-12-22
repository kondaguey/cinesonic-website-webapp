import React from "react";
import {
  Briefcase,
  Globe,
  User,
  Shield,
  FileText,
  Phone,
  MapPin,
  BadgeCheck,
  Lock,
  Building,
} from "lucide-react";

export default function TeamEditor({ formData, setFormData, theme }) {
  // --- HELPERS ---
  const updateField = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      {/* === 1. STAFF BIOS (Public - About Us Page) === */}
      <div className={`p-4 rounded-xl border ${theme.border} bg-blue-500/5`}>
        <h3 className="text-xs font-bold text-blue-500 uppercase tracking-widest flex items-center gap-2 mb-4">
          <Building size={12} /> Staff Bios (Public / About Us)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Identity */}
          <div className="col-span-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Public Display Name
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
              Public Job Title
            </label>
            <input
              placeholder="e.g. Head of Production, Senior Editor"
              value={formData.public?.job_title || ""}
              onChange={(e) =>
                updateField("public", "job_title", e.target.value)
              }
              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-xs ${theme.text}`}
            />
          </div>

          <div className="col-span-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Public Bio
            </label>
            <textarea
              rows={3}
              value={formData.public?.public_bio || ""}
              onChange={(e) =>
                updateField("public", "public_bio", e.target.value)
              }
              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-xs ${theme.text}`}
            />
          </div>

          {/* Headshot */}
          <div className="col-span-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Headshot URL
            </label>
            <div className="relative">
              <User
                size={12}
                className="absolute left-3 top-2.5 text-slate-500"
              />
              <input
                value={formData.public?.headshot_url || ""}
                onChange={(e) =>
                  updateField("public", "headshot_url", e.target.value)
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg pl-8 pr-3 py-2 text-xs ${theme.text}`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* === 2. HR VAULT (Private Data) === */}
      <div className={`p-4 rounded-xl border ${theme.border} bg-slate-500/5`}>
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2 mb-4">
          <Lock size={12} /> HR Vault (Private)
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
          <div className="col-span-2">
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

          {/* Internal Ops */}
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Internal Role ID
            </label>
            <input
              placeholder="L2-ENG-001"
              value={formData.private?.internal_role || ""}
              onChange={(e) =>
                updateField("private", "internal_role", e.target.value)
              }
              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-xs ${theme.text} font-mono`}
            />
          </div>
          <div>
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Payroll / Vendor ID
            </label>
            <input
              placeholder="Gusto/Wrapbook ID"
              // Assuming we might have added this column back, if not, it stays in notes.
              // But for UI completeness, let's assume notes or specific field.
              // We'll stick to 'internal_notes' for broad usage if column missing.
              value={formData.private?.internal_notes || ""}
              onChange={(e) =>
                updateField("private", "internal_notes", e.target.value)
              }
              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-xs ${theme.text}`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
