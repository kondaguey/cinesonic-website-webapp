"use client";
import React, { useState } from "react";
import axios from "axios";
import { Film, Key, Loader2, LayoutDashboard } from "lucide-react";

const API_URL = "YOUR_GOOGLE_SCRIPT_URL_HERE";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.get(`${API_URL}?op=login&key=${key}`);
      if (res.data.success) {
        setUser(res.data);
      } else {
        setError("Invalid Key");
      }
    } catch (err) {
      setError("Connection Error");
    }
    setLoading(false);
  };

  if (user) {
    return (
      <div className="min-h-screen bg-deep-space text-white flex items-center justify-center">
        <div className="text-center">
          <LayoutDashboard className="w-16 h-16 text-gold mx-auto mb-4" />
          <h1 className="text-3xl font-serif text-white">
            Welcome, {user.name}
          </h1>
          <p className="text-gray-400 mt-2">
            The full dashboard components will go here.
          </p>
          <button
            onClick={() => setUser(null)}
            className="mt-8 text-red-400 text-sm underline"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight flex flex-col items-center justify-center p-4">
      <div className="bg-black/40 border border-gold/30 p-8 rounded-xl w-full max-w-md backdrop-blur-md">
        <div className="text-center mb-8">
          <Film className="w-10 h-10 text-gold mx-auto mb-2" />
          <h1 className="text-2xl font-serif font-bold text-white">
            Studio Admin
          </h1>
        </div>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="w-full bg-white/5 border border-gold/20 p-3 rounded text-white focus:border-gold outline-none"
            placeholder="Enter Studio Key..."
          />
          {error && (
            <div className="text-red-400 text-xs text-center">{error}</div>
          )}
          <button
            disabled={loading}
            className="w-full bg-gold hover:bg-gold-light text-midnight font-bold py-3 rounded uppercase tracking-wider flex justify-center items-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              "Authenticate"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
