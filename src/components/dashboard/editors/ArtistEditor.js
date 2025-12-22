import React from "react";
import {
  Palette,
  Globe,
  Image as ImageIcon,
  DollarSign,
  FileText,
  Phone,
  MapPin,
  Briefcase,
  Layers,
  Star,
  Lock,
  CreditCard,
} from "lucide-react";

export default function ArtistEditor({ formData, setFormData, theme }) {
  // --- HELPERS (Reused Logic) ---
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

  const updateArray = (section, field, stringValue) => {
    const arr = stringValue.split(",").map((s) => s.trim());
    updateField(section, field, arr);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
      {/* === 1. THE GALLERY (Public Roster) === */}
      <div className={`p-4 rounded-xl border ${theme.border} bg-pink-500/5`}>
        <h3 className="text-xs font-bold text-pink-500 uppercase tracking-widest flex items-center gap-2 mb-4">
          <Palette size={12} /> The Gallery (Public)
        </h3>

        <div className="grid grid-cols-2 gap-4">
          {/* Identity */}
          <div className="col-span-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Display Name / Alias
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
              Artist Bio
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
              Portfolio URL
            </label>
            <div className="relative">
              <Globe
                size={12}
                className="absolute left-3 top-2.5 text-slate-500"
              />
              <input
                value={formData.public?.portfolio_url || ""}
                onChange={(e) =>
                  updateField("public", "portfolio_url", e.target.value)
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg pl-8 pr-3 py-2 text-xs ${theme.text}`}
              />
            </div>
          </div>

          {/* Style Tags */}
          <div className="col-span-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Style Tags (CSV)
            </label>
            <input
              placeholder="Anime, Noir, Cyberpunk, Watercolor..."
              value={formData.public?.style_tags?.join(", ") || ""}
              onChange={(e) =>
                updateArray("public", "style_tags", e.target.value)
              }
              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-xs ${theme.text}`}
            />
          </div>

          {/* Featured Toggle */}
          <div className="col-span-2 flex items-center gap-3 p-3 rounded-lg border border-white/10 bg-white/5">
            <Star
              size={16}
              className={
                formData.public?.is_featured
                  ? "text-yellow-400"
                  : "text-slate-600"
              }
            />
            <div className="flex-1">
              <div className="text-xs font-bold uppercase">Featured Artist</div>
              <div className="text-[10px] text-slate-500">
                Showcase in main gallery carousel
              </div>
            </div>
            <input
              type="checkbox"
              checked={formData.public?.is_featured || false}
              onChange={(e) =>
                updateField("public", "is_featured", e.target.checked)
              }
              className="w-4 h-4 accent-pink-500"
            />
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
              Phone
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

          <div className="col-span-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Legal Address
            </label>
            <div className="relative">
              <MapPin
                size={12}
                className="absolute left-3 top-2.5 text-slate-500"
              />
              <input
                value={formData.private?.legal_address || ""}
                onChange={(e) =>
                  updateField("private", "legal_address", e.target.value)
                }
                className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg pl-8 pr-3 py-2 text-xs ${theme.text}`}
              />
            </div>
          </div>

          {/* Payment Info */}
          <div className="col-span-2 p-3 bg-white/5 rounded-lg border border-dashed border-white/10">
            <div className="text-[10px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-2">
              <CreditCard size={10} /> Payment Details
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
                  Preference
                </label>
                <select
                  value={
                    formData.private?.payment_method_preference || "PayPal"
                  }
                  onChange={(e) =>
                    updateField(
                      "private",
                      "payment_method_preference",
                      e.target.value
                    )
                  }
                  className={`w-full ${theme.inputBg} border ${theme.border} rounded px-2 py-1 text-xs ${theme.text}`}
                >
                  <option value="PayPal">PayPal</option>
                  <option value="Wise">Wise</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
                  Handle / Email
                </label>
                <input
                  placeholder="user@paypal.com"
                  value={formData.private?.payment_handle || ""}
                  onChange={(e) =>
                    updateField("private", "payment_handle", e.target.value)
                  }
                  className={`w-full ${theme.inputBg} border ${theme.border} rounded px-2 py-1 text-xs ${theme.text}`}
                />
              </div>
            </div>
          </div>

          {/* Commission Rates (JSONB) */}
          <div className="col-span-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Commission Rates
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <DollarSign
                  size={10}
                  className="absolute left-2 top-2 text-slate-500"
                />
                <input
                  placeholder="Cover Art ($)"
                  type="number"
                  value={formData.private?.commission_rates?.cover_art || ""}
                  onChange={(e) =>
                    updateJson(
                      "private",
                      "commission_rates",
                      "cover_art",
                      e.target.value
                    )
                  }
                  className={`w-full ${theme.inputBg} border ${theme.border} rounded pl-6 pr-2 py-1.5 text-xs ${theme.text}`}
                />
                <span className="text-[8px] text-slate-500 absolute right-2 top-2">
                  COVER
                </span>
              </div>
              <div className="relative">
                <DollarSign
                  size={10}
                  className="absolute left-2 top-2 text-slate-500"
                />
                <input
                  placeholder="Character ($)"
                  type="number"
                  value={
                    formData.private?.commission_rates?.character_design || ""
                  }
                  onChange={(e) =>
                    updateJson(
                      "private",
                      "commission_rates",
                      "character_design",
                      e.target.value
                    )
                  }
                  className={`w-full ${theme.inputBg} border ${theme.border} rounded pl-6 pr-2 py-1.5 text-xs ${theme.text}`}
                />
                <span className="text-[8px] text-slate-500 absolute right-2 top-2">
                  CHAR
                </span>
              </div>
            </div>
          </div>

          {/* Tax Status */}
          <div className="col-span-2">
            <label className="text-[9px] font-bold text-slate-500 uppercase mb-1 block">
              Tax Documents
            </label>
            <select
              value={formData.private?.tax_documents_status || "Pending"}
              onChange={(e) =>
                updateField("private", "tax_documents_status", e.target.value)
              }
              className={`w-full ${theme.inputBg} border ${theme.border} rounded-lg px-3 py-2 text-xs ${theme.text}`}
            >
              <option value="Pending">Pending (Needs W9)</option>
              <option value="Verified">Verified (Ready to Pay)</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
