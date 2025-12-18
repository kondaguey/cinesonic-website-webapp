"use client";

import React, { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";

// --- CONFIG ---
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

const supabase =
  supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

// --- SUB-COMPONENTS ---
const AdminInput = ({
  label,
  value,
  onChange,
  placeholder,
  isMono = false,
}) => (
  <div className="group relative">
    <label className="block text-xs font-bold tracking-widest text-indigo-200/50 uppercase mb-2 group-focus-within:text-white transition-colors">
      {label}
    </label>
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full bg-white/5 border-b border-white/10 p-3 text-indigo-50 outline-none focus:border-indigo-400 focus:bg-white/10 transition-all rounded-t-md ${
        isMono ? "font-mono text-lg text-cyan-300" : "font-sans"
      }`}
    />
  </div>
);

export default function AdminDashboard() {
  // -- Auth & Config --
  const [keyRole, setKeyRole] = useState("prospective"); // Default Role
  const [isAuth, setIsAuth] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [configError, setConfigError] = useState("");

  // -- Blog Form --
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [author, setAuthor] = useState("CineSonic Team");
  const [tags, setTags] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false); // New loading state

  // -- Technical State --
  const editorRef = useRef(null);
  const [contentHtml, setContentHtml] = useState("");
  const [sqlOutput, setSqlOutput] = useState("");
  const [showModal, setShowModal] = useState(false);

  // -- Lock Logic --
  const [isSiteLocked, setIsSiteLocked] = useState(true);
  const [newKey, setNewKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 1. INIT CHECKS & PERSISTENCE
  useEffect(() => {
    // Check for Config
    if (!supabaseUrl || !supabaseKey) setConfigError("Missing Supabase Keys");
    if (!adminPassword) setConfigError("Missing Admin Password");

    // Check for "Logged In" flag in session storage
    const session = sessionStorage.getItem("cineSonicAdminSession");
    if (session === "true") {
      setIsAuth(true);
    }
  }, []);

  // 2. LOAD RESOURCES
  useEffect(() => {
    if (!isAuth) return;

    const link = document.createElement("link");
    link.href = "https://cdn.quilljs.com/1.3.6/quill.snow.css";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.quilljs.com/1.3.6/quill.min.js";
    script.onload = () => initQuill();
    document.body.appendChild(script);

    if (supabase) fetchLockStatus();

    return () => {
      if (document.head.contains(link)) document.head.removeChild(link);
      if (document.body.contains(script)) document.body.removeChild(script);
    };
  }, [isAuth]);

  // --- AUTH FUNCTIONS ---

  const handleLogin = () => {
    if (passwordInput === adminPassword) {
      setIsAuth(true);
      sessionStorage.setItem("cineSonicAdminSession", "true");
    } else {
      alert("Incorrect Password");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("cineSonicAdminSession");
    setIsAuth(false);
    setPasswordInput("");
  };

  const initQuill = () => {
    if (window.Quill && !editorRef.current) {
      editorRef.current = new window.Quill("#editor-container", {
        theme: "snow",
        modules: {
          toolbar: [
            [{ header: [2, 3, 4, false] }],
            ["bold", "italic", "underline", "blockquote"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image", "clean"],
          ],
        },
        placeholder: "Write something timeless...",
      });
      editorRef.current.on("text-change", () => {
        setContentHtml(editorRef.current.root.innerHTML);
      });
    }
  };

  // --- LOGIC ---
  const fetchLockStatus = async () => {
    if (!supabase) return;
    const { data } = await supabase
      .from("app_settings")
      .select("is_active")
      .eq("setting_name", "site_lock")
      .single();
    if (data) setIsSiteLocked(data.is_active);
  };

  const toggleLock = async () => {
    if (!supabase) return;
    setIsLoading(true);

    const { data, error } = await supabase.rpc("secure_toggle_lock", {
      secret_pass: adminPassword,
    });

    if (error) {
      alert("Security Block: " + error.message);
      setIsSiteLocked(isSiteLocked);
    } else {
      setIsSiteLocked(data);
    }
    setIsLoading(false);
  };

  const generateRandomKey = async () => {
    setIsLoading(true);
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    let result = "";
    for (let i = 0; i < 24; i++)
      result += chars.charAt(Math.floor(Math.random() * chars.length));

    const { error } = await supabase.rpc("secure_generate_key", {
      secret_pass: adminPassword,
      new_key: result,
      key_role: keyRole,
      key_notes: "Generated via Admin Console",
    });

    if (error) {
      alert("Error: " + error.message);
    } else {
      setNewKey(`${result} (${keyRole.toUpperCase()})`);
    }

    setIsLoading(false);
  };

  // 🟢 NEW: DIRECT PUBLISH (Uses Secure Tunnel)
  const handleDirectPublish = async () => {
    if (!slug || !title) return alert("Title and Slug are required.");
    setIsPublishing(true);

    let tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    // Auto-add locked_content tag if site is locked (optional logic)
    if (isSiteLocked && !tagsArray.includes("locked_content"))
      tagsArray.push("locked_content");

    try {
      const { error } = await supabase.rpc("secure_upsert_blog", {
        secret_pass: adminPassword,
        p_slug: slug,
        p_title: title,
        p_excerpt: excerpt,
        p_content: contentHtml,
        p_cover_image: coverImage,
        p_author: author,
        p_published: isPublished,
        p_tags: tagsArray,
      });

      if (error) throw error;
      alert("Success! Post published to live database.");
    } catch (err) {
      alert("Publish Error: " + err.message);
    }
    setIsPublishing(false);
  };

  const generateSQL = () => {
    // ... (Your existing SQL Gen Logic - kept as backup)
    if (!editorRef.current) return;
    let tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    if (isSiteLocked && !tagsArray.includes("locked_content"))
      tagsArray.push("locked_content");
    const esc = (str) => (str ? `'${str.replace(/'/g, "''")}'` : "NULL");
    const tagsSql =
      tagsArray.length > 0
        ? `ARRAY[${tagsArray.map((t) => `'${t}'`).join(", ")}]`
        : "NULL";

    const sql = `
INSERT INTO public.blog_db (
  slug, title, excerpt, content, cover_image, author, published, tags, created_at, updated_at
) VALUES (
  ${esc(slug)}, ${esc(title)}, ${esc(excerpt)}, ${esc(contentHtml)}, ${esc(
      coverImage
    )}, ${esc(author)}, ${
      isPublished ? "true" : "false"
    }, ${tagsSql}, NOW(), NOW()
) 
ON CONFLICT (slug) DO UPDATE SET
  title = EXCLUDED.title, excerpt = EXCLUDED.excerpt, content = EXCLUDED.content, cover_image = EXCLUDED.cover_image, author = EXCLUDED.author, published = EXCLUDED.published, tags = EXCLUDED.tags, updated_at = NOW();
    `.trim();
    setSqlOutput(sql);
    setShowModal(true);
  };

  const handleSlugGen = (val) => {
    setTitle(val);
    setSlug(
      val
        .toLowerCase()
        .replace(/[^\w ]+/g, "")
        .replace(/ +/g, "-")
    );
  };

  // --- RENDER ---
  if (configError)
    return (
      <div className="fixed inset-0 z-[9999] bg-[#020010] flex items-center justify-center text-red-400 font-mono">
        <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-red-900/50">
          <h2 className="text-xl font-bold mb-4 text-red-500">SYSTEM ERROR</h2>
          <p>{configError}</p>
        </div>
      </div>
    );

  if (!isAuth)
    return (
      <div className="fixed inset-0 z-[9999] bg-[#020010] flex items-center justify-center p-4">
        {/* ... Login UI (Kept same) ... */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0442] via-[#020010] to-black opacity-90"></div>
        <div className="relative bg-white/5 backdrop-blur-xl p-10 max-w-sm w-full border border-white/10 rounded-2xl shadow-2xl animate-fade-in-up">
          <h2 className="text-3xl font-serif text-center mb-1 text-white tracking-tight">
            CineSonic
          </h2>
          <p className="text-center text-indigo-200/40 text-xs mb-8 font-sans tracking-[0.2em] uppercase">
            Admin Console
          </p>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              autoFocus
              className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-center text-white tracking-[0.5em] focus:border-indigo-500 focus:outline-none transition-all"
              placeholder="PASSWORD"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <button
            onClick={handleLogin}
            className="w-full mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm uppercase tracking-widest py-3 rounded-lg shadow-lg shadow-indigo-500/20 transition-all"
          >
            Enter
          </button>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto font-sans bg-[#020010]">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-[#0c0442] via-[#020010] to-black"></div>

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-[#020010]/80 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex justify-between items-center shadow-lg">
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold tracking-tight text-white">
            CINE<span className="text-indigo-500">SONIC</span>{" "}
            <span className="text-white/30 font-normal">ADMIN</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-medium text-white/40 hover:text-white transition-colors border-l border-white/10 pl-4"
          >
            Exit
          </button>
        </div>

        <div className="flex items-center gap-6">
          {/* LOCK TOGGLE (Shimmy Fixed) */}
          <div className="flex items-center gap-4 bg-white/5 border border-white/10 rounded-full pl-4 pr-1 py-1">
            <div className="flex items-center gap-2">
              <div
                className={`w-2 h-2 rounded-full shadow-[0_0_8px] transition-all duration-300 ${
                  isSiteLocked
                    ? "bg-red-500 shadow-red-500"
                    : "bg-emerald-500 shadow-emerald-500"
                }`}
              ></div>
              {/* 🟢 STRAITJACKET APPLIED: w-24 text-right inline-block */}
              <span
                className={`text-[10px] font-bold tracking-widest uppercase w-24 text-right inline-block ${
                  isSiteLocked ? "text-red-400" : "text-emerald-400"
                }`}
              >
                {isSiteLocked ? "Site Locked" : "Public Access"}
              </span>
            </div>
            <button
              onClick={toggleLock}
              disabled={isLoading}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 focus:outline-none ${
                isSiteLocked
                  ? "bg-red-500/20 border border-red-500/30"
                  : "bg-emerald-500/20 border border-emerald-500/30"
              }`}
            >
              <span
                className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow transition-transform duration-300 ${
                  isSiteLocked
                    ? "translate-x-6 bg-red-400"
                    : "translate-x-0 bg-emerald-400"
                }`}
              ></span>
            </button>
          </div>

          {/* KEY GEN */}
          <div className="flex items-center gap-0 bg-white/5 rounded-full border border-white/10 overflow-hidden">
            <select
              value={keyRole}
              onChange={(e) => setKeyRole(e.target.value)}
              className="bg-transparent text-[10px] font-bold text-white/60 uppercase tracking-wider outline-none px-3 py-1.5 cursor-pointer hover:text-white hover:bg-white/5 transition-colors appearance-none text-center"
              style={{ textAlignLast: "center" }}
            >
              <option value="prospective" className="text-black">
                Prospective
              </option>
              <option value="actor" className="text-black">
                Actor
              </option>
              <option value="artist" className="text-black">
                Artist
              </option>
              <option value="crew" className="text-black">
                Crew
              </option>
              <option value="admin" className="text-black">
                Admin
              </option>
            </select>
            <button
              onClick={generateRandomKey}
              disabled={isLoading}
              className="text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 transition-all border-l border-white/10"
            >
              {isLoading ? "..." : "+ KEY"}
            </button>
          </div>
          {newKey && (
            <span
              onClick={() => {
                navigator.clipboard.writeText(newKey.split(" ")[0]);
                alert("Copied!");
              }}
              className="cursor-pointer text-xs font-mono bg-indigo-500/20 text-indigo-200 border border-indigo-500/50 px-3 py-1.5 rounded-full hover:bg-indigo-500 hover:text-white transition-all ml-2"
            >
              {newKey}
            </span>
          )}

          {/* 🟢 NEW PUBLISH BUTTON + SQL EXPORT */}
          <div className="flex gap-2 ml-2">
            <button
              onClick={generateSQL}
              className="bg-white/10 text-white px-4 py-1.5 rounded-full font-bold text-xs tracking-wide hover:bg-white/20 transition-colors"
            >
              SQL
            </button>
            <button
              onClick={handleDirectPublish}
              disabled={isPublishing}
              className="bg-emerald-500 hover:bg-emerald-400 text-black px-5 py-1.5 rounded-full font-bold text-xs tracking-wide transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)]"
            >
              {isPublishing ? "Publishing..." : "PUBLISH LIVE"}
            </button>
          </div>
        </div>
      </nav>

      {/* DASHBOARD GRID */}
      <main className="max-w-7xl mx-auto p-8 grid grid-cols-12 gap-8">
        {/* LEFT COL: Metadata */}
        <div className="col-span-4 space-y-6">
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-6 shadow-xl">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest border-b border-white/5 pb-2">
              Post Details
            </h3>
            <AdminInput
              label="Title"
              value={title}
              onChange={(e) => handleSlugGen(e.target.value)}
              placeholder="Enter blog title..."
            />
            <AdminInput
              label="Slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              isMono={true}
            />
            <div className="group relative">
              <label className="block text-xs font-bold tracking-widest text-indigo-200/50 uppercase mb-2">
                Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-white/5 border-b border-white/10 p-3 text-indigo-50 outline-none focus:border-indigo-400 focus:bg-white/10 transition-all rounded-t-md min-h-[120px]"
                placeholder="Short summary..."
              />
            </div>
          </div>
          <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10 space-y-6 shadow-xl">
            <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest border-b border-white/5 pb-2">
              Configuration
            </h3>
            <AdminInput
              label="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <AdminInput
              label="Tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="news, update"
            />
            <AdminInput
              label="Image URL"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              isMono={true}
            />
            <div className="flex items-center justify-between bg-white/5 p-4 rounded-lg border border-white/10">
              <span className="text-xs font-bold tracking-widest text-indigo-200">
                PUBLISHED?
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-black/40 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
              </label>
            </div>
          </div>
        </div>

        {/* RIGHT COL: Editor */}
        <div className="col-span-8">
          <div className="sticky top-24">
            <style jsx global>{`
              .ql-toolbar {
                background: #e7e5e4 !important;
                border: none !important;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                padding: 12px !important;
              }
              .ql-stroke {
                stroke: #57534e !important;
              }
              .ql-fill {
                fill: #57534e !important;
              }
              .ql-picker {
                color: #57534e !important;
              }
              .ql-active .ql-stroke {
                stroke: #000 !important;
              }
              .ql-container {
                border: none !important;
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
                background: #f7eeccff;
                font-family: "lato", sans-serif !important;
                font-size: 1.15rem !important;
                box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.8);
              }
              .ql-editor {
                color: #1c1917;
                min-height: 800px;
                padding: 60px 80px;
                line-height: 1.6;
                font-weight: 200;
              }
              .ql-editor.ql-blank::before {
                color: #a8a29e;
                font-style: normal;
                font-weight: 300;
              }
            `}</style>
            <div id="editor-container"></div>
          </div>
        </div>
      </main>

      {/* SQL MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[10000] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-[#1a1a1a] w-full max-w-4xl rounded-xl border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-[#222]">
              <h3 className="font-bold text-white text-sm tracking-wider">
                GENERATED SQL
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-white/40 hover:text-white transition-colors"
              >
                Close
              </button>
            </div>
            <div className="p-6 overflow-auto bg-[#0a0a0a] custom-scrollbar">
              <pre className="text-emerald-400 font-mono text-xs whitespace-pre-wrap leading-relaxed">
                {sqlOutput}
              </pre>
            </div>
            <div className="p-4 border-t border-white/10 bg-[#222] flex justify-end">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(sqlOutput);
                  alert("Copied!");
                }}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded font-bold transition-all shadow-lg"
              >
                Copy to Clipboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
