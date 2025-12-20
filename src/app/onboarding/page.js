"use client";
import { useState } from "react";
import { supabase } from "@/src/lib/supabaseClient";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // New state for toggling password visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      setMessage("❌ Error: " + error.message);
    } else {
      setMessage(
        "✅ Success! Account created. Check Supabase 'profiles' table."
      );
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4">
      <div className="w-full max-w-md border border-white/20 rounded-2xl p-8 bg-white/5 backdrop-blur-sm">
        <h1 className="text-3xl font-bold text-center mb-2">
          CineSonic Access
        </h1>
        <p className="text-center text-gray-400 text-sm mb-8">
          Initialize Owner Account
        </p>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Full Name
            </label>
            <input
              type="text"
              required
              className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:border-cyan-500 outline-none transition-colors"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Email
            </label>
            <input
              type="email"
              required
              className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:border-cyan-500 outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full p-3 bg-black border border-gray-700 rounded-lg focus:border-cyan-500 outline-none transition-colors pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button" // Important: prevents form submission
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            disabled={loading}
            className="mt-4 bg-cyan-600 hover:bg-cyan-500 text-white p-4 rounded-lg font-bold uppercase tracking-widest transition-all disabled:opacity-50"
          >
            {loading ? "Connecting to Database..." : "Establish Link"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg text-sm text-center font-mono ${
              message.includes("Error")
                ? "bg-red-500/20 text-red-400"
                : "bg-emerald-500/20 text-emerald-400"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
