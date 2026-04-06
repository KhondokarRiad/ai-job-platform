"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: "", email: "", password: "", career_goal: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "Registration Failed!"); return; }
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch { setError("No connection to the server!"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">🎯 SkillBridge</h1>
          <p className="text-blue-300 text-sm">AI-Powered Career Development Platform</p>
        </div>
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-2xl font-semibold text-white mb-6">Create new account</h2>
          {error && (
            <div className="bg-red-500/20 border border-red-400 text-red-300 px-4 py-3 rounded-lg mb-4 text-sm">
              ⚠️ {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-blue-200 text-sm mb-1">Full name</label>
              <input type="text" required placeholder="Khondokar Riad"
                value={form.full_name}
                onChange={(e) => setForm({...form, full_name: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
              />
            </div>
            <div>
              <label className="block text-blue-200 text-sm mb-1">Email</label>
              <input type="email" required placeholder="example@email.com"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
              />
            </div>
            <div>
              <label className="block text-blue-200 text-sm mb-1">Password</label>
              <input type="password" required placeholder="At least 6 characters"
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
              />
            </div>
            <div>
              <label className="block text-blue-200 text-sm mb-1">Career goal</label>
              <input type="text" placeholder="For example: Full Stack Developer"
                value={form.career_goal}
                onChange={(e) => setForm({...form, career_goal: e.target.value})}
                className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
              />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-200">
              {loading ? "⏳ Loading..." : "✅ Register"}
            </button>
          </form>
          <p className="text-center text-blue-300 text-sm mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-white font-semibold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}