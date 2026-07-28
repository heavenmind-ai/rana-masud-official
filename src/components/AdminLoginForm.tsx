"use client";

import React, { useState } from "react";
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Login failed. Please try again.");
      }

      // Refresh the page so the Server Component layout re-evaluates the authentication state
      window.location.reload();
    } catch (err: any) {
      setErrorMsg(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md relative group">
      {/* Outer Neon Accent Glow */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-gold-accent via-[#ca8a04] to-gold-accent rounded-2xl blur-lg opacity-30 group-hover:opacity-45 transition duration-1000 group-hover:duration-200 pointer-events-none"></div>

      {/* Main Form Container */}
      <div className="relative glass-card p-8 flex flex-col gap-6 border border-white/10 bg-[#0c0c0e]/85 backdrop-blur-xl rounded-2xl shadow-2xl">
        {/* Header Branding */}
        <div className="flex flex-col items-center gap-2 text-center">
          <div className="w-12 h-12 rounded-xl bg-gold-accent/15 border border-gold-accent/25 flex items-center justify-center text-gold-accent shadow-inner">
            <Shield className="h-6 w-6 text-gold-accent drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]" />
          </div>
          <h1 className="text-xl font-bold tracking-widest text-white mt-2 uppercase">
            Admin Authentication
          </h1>
          <p className="text-xs text-white/40 tracking-wider">
            Enter administrative credentials to access the workspace.
          </p>
        </div>

        {/* Error Alert Box */}
        {errorMsg && (
          <div className="p-3.5 bg-red-500/10 border border-red-500/25 text-red-400 rounded-lg text-xs flex items-center gap-2.5 animate-shake">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span className="font-medium">{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Email input field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] text-white/55 font-bold uppercase tracking-wider">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 h-4 w-4 text-white/30" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ranamasudbd.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/50 focus:bg-white/[0.07] transition-all"
                disabled={loading}
              />
            </div>
          </div>

          {/* Password input field */}
          <div className="flex flex-col gap-1.5 text-left">
            <label className="text-[10px] text-white/55 font-bold uppercase tracking-wider">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 h-4 w-4 text-white/30" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-white/10 bg-white/5 text-white text-xs outline-none focus:border-gold-accent/50 focus:bg-white/[0.07] transition-all"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 text-white/30 hover:text-white/60 p-1 rounded-md transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Action button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 rounded-lg bg-gold-accent hover:bg-gold-hover disabled:bg-white/10 disabled:text-white/40 text-black text-xs font-bold uppercase tracking-widest transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg hover:shadow-gold-accent/20"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-black animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <span>Access Workspace</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
