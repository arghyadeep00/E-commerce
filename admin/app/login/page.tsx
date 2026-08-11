"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import api from "@/lib/api";
import Cookies from "js-cookie";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data } = await api.post("/admin-auth/login", { email, password });
      
      localStorage.setItem("adminInfo", JSON.stringify(data));
      
      if (data.token) {
        Cookies.set("adminToken", data.token, { expires: 1 });
      }

      router.push("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center font-sans relative p-4">
      {/* Top Left Logo */}
      <div className="absolute top-8 left-8 flex items-center gap-2">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="#3b82f6" />
          <path d="M2 17L12 22L22 17" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2 12L12 17L22 12" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-xl font-bold text-white">AdminPro</span>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-[480px] bg-[#1e293b] rounded-lg border border-[#334155] shadow-lg p-10">
        <div className="mb-8">
          <p className="text-[#94a3b8] text-sm mb-1">Please enter your details</p>
          <h1 className="text-3xl font-bold text-white">Welcome back</h1>
        </div>

        {error && (
          <div className="bg-red-500/10 text-red-400 px-4 py-3 rounded-lg text-sm mb-6 border border-red-500/20">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-[#0f172a] border border-[#334155] rounded-md px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
              placeholder="Email address"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-[#0f172a] border border-[#334155] rounded-md px-4 py-3 text-white placeholder-[#64748b] focus:outline-none focus:ring-2 focus:ring-[#3b82f6] focus:border-transparent transition-all"
              placeholder="Password"
            />
          </div>

          <div className="flex items-center justify-between text-sm mt-2 mb-6">
            <label className="flex items-center gap-2 cursor-pointer text-[#cbd5e1]">
              <input type="checkbox" className="w-4 h-4 rounded border-[#334155] bg-[#0f172a] text-[#3b82f6] focus:ring-[#3b82f6]" />
              Remember for 30 days
            </label>
            <a href="#" className="text-[#3b82f6] hover:underline font-medium">Forgot password</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#3b82f6] hover:bg-[#2563eb] text-white py-3 rounded-md font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
