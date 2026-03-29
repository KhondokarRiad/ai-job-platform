"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.detail || "লগইন ব্যর্থ!"); return; }
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard");
    } catch { setError("সার্ভারের সাথে সংযোগ নেই!"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex" style={{fontFamily: "'Segoe UI', sans-serif"}}>

      {/* Left Side — Illustration */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 relative overflow-hidden" style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%)"
      }}>
        {/* Animated blobs */}
        <div className="absolute top-20 left-20 w-72 h-72 rounded-full blur-3xl opacity-20" style={{background: "radial-gradient(circle, #e94560, transparent)"}}></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl opacity-15" style={{background: "radial-gradient(circle, #0f3460, #533483)"}}></div>
        <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full blur-2xl opacity-20" style={{background: "radial-gradient(circle, #533483, transparent)"}}></div>

        {/* Grid */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}></div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{background: "linear-gradient(135deg, #e94560, #533483)"}}>
            🎯
          </div>
          <span className="text-white font-bold text-xl">SkillBridge</span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center">
          {/* Floating Job Cards */}
          <div className="relative mb-8">
            {/* Card 1 */}
            <div className="absolute -top-4 -left-2 w-56 rounded-2xl p-4 border border-white/10 shadow-2xl" style={{background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)"}}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-blue-500/30 flex items-center justify-center text-sm">💻</div>
                <div>
                  <p className="text-white text-xs font-semibold">Software Engineer</p>
                  <p className="text-white/40 text-xs">Google • Remote</p>
                </div>
              </div>
              <div className="flex gap-1">
                <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-300">React</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300">Python</span>
              </div>
            </div>

            {/* Card 2 */}
            <div className="ml-32 mt-16 w-56 rounded-2xl p-4 border border-white/10 shadow-2xl" style={{background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)"}}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-purple-500/30 flex items-center justify-center text-sm">📊</div>
                <div>
                  <p className="text-white text-xs font-semibold">Data Scientist</p>
                  <p className="text-white/40 text-xs">Meta • Hybrid</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-green-400 text-xs font-semibold">92% match</span>
                <div className="w-16 h-1.5 rounded-full bg-white/10">
                  <div className="w-11/12 h-1.5 rounded-full bg-green-400"></div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="absolute bottom-0 left-0 w-48 rounded-2xl p-4 border border-white/10 shadow-2xl" style={{background: "rgba(255,255,255,0.08)", backdropFilter: "blur(10px)"}}>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-orange-500/30 flex items-center justify-center text-sm">🎨</div>
                <div>
                  <p className="text-white text-xs font-semibold">UI/UX Designer</p>
                  <p className="text-white/40 text-xs">Apple • On-site</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <div className="flex -space-x-1">
                  {["🔵","🟣","🟠"].map((c,i) => (
                    <div key={i} className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-xs"
                      style={{background: "rgba(255,255,255,0.1)"}}>
                    </div>
                  ))}
                </div>
                <span className="text-white/40 text-xs">+12 applied</span>
              </div>
            </div>
          </div>

          {/* Text */}
          <div className="mt-32">
            <h2 className="text-4xl font-bold text-white leading-tight mb-4">
              আপনার স্বপ্নের<br/>
              <span style={{background: "linear-gradient(90deg, #e94560, #533483)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"}}>
                Career খুঁজুন
              </span>
            </h2>
            <p className="text-white/50 text-sm leading-relaxed">
              AI দিয়ে আপনার skills analyze করুন,<br/>
              perfect job match খুঁজুন এবং<br/>
              career এ এগিয়ে যান।
            </p>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-8">
            {[
              { value: "10K+", label: "Job Listings" },
              { value: "95%", label: "Match Rate" },
              { value: "500+", label: "Companies" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-white font-bold text-xl">{stat.value}</p>
                <p className="text-white/40 text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-white/20 text-xs">
          © 2026 SkillBridge — SE331 Group 5
        </div>
      </div>

      {/* Right Side — Login Form */}
      <div className="flex-1 flex items-center justify-center p-8" style={{
        background: "linear-gradient(135deg, #0f0c29 0%, #1a1a2e 100%)"
      }}>
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <span className="text-2xl">🎯</span>
            <span className="text-white font-bold text-xl">SkillBridge</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Again Welcome 👋</h1>
            <p className="text-white/40 text-sm">আপনার অ্যাকাউন্টে লগইন করুন</p>
          </div>

          {error && (
            <div className="px-4 py-3 rounded-xl mb-6 text-sm border border-red-500/30 text-red-300 flex items-center gap-2"
              style={{background: "rgba(239,68,68,0.1)"}}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-white/60 text-sm mb-2 font-medium">ইমেইল</label>
              <input type="email" required
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                placeholder="example@email.com"
                className="w-full rounded-xl px-4 py-3.5 text-white placeholder-white/20 border border-white/10 focus:outline-none focus:border-purple-500/60 transition text-sm"
                style={{background: "rgba(255,255,255,0.05)"}}
              />
            </div>
            <div>
              <label className="block text-white/60 text-sm mb-2 font-medium">পাসওয়ার্ড</label>
              <input type="password" required
                value={form.password}
                onChange={(e) => setForm({...form, password: e.target.value})}
                placeholder="আপনার পাসওয়ার্ড"
                className="w-full rounded-xl px-4 py-3.5 text-white placeholder-white/20 border border-white/10 focus:outline-none focus:border-purple-500/60 transition text-sm"
                style={{background: "rgba(255,255,255,0.05)"}}
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl text-white font-semibold text-sm transition hover:opacity-90 disabled:opacity-50"
              style={{background: "linear-gradient(135deg, #e94560, #533483)"}}>
              {loading ? "⏳ লগইন হচ্ছে..." : "🔐 লগইন করুন"}
            </button>
          </form>

          <p className="text-center text-white/40 text-sm mt-6">
            অ্যাকাউন্ট নেই?{" "}
            <Link href="/register" className="font-semibold" style={{color: "#e94560"}}>
              রেজিস্ট্রেশন করুন
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}