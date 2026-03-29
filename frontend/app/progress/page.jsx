"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProgressPage() {
  const router = useRouter();
  const [skills, setSkills] = useState([]);
  const [gaps, setGaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [readiness, setReadiness] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }

    fetch("http://localhost:8000/api/resume/skills", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setSkills(data.skills || []);
        const skillCount = (data.skills || []).length;
        setReadiness(Math.min(Math.round((skillCount / 10) * 100), 100));
      })
      .catch(() => {});

    fetch("http://localhost:8000/api/jobs/skill-gap", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setGaps(data.skill_gaps || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const completed = typeof window !== "undefined"
    ? JSON.parse(localStorage.getItem("completed_courses") || "[]")
    : [];

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
    }}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{background: "radial-gradient(circle, #6366f1, transparent)"}}></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{background: "radial-gradient(circle, #8b5cf6, transparent)"}}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-6">
          <div>
            <h1 className="text-3xl font-bold text-white">📈 Progress Dashboard</h1>
            <p className="text-purple-300 text-sm mt-1">আপনার career readiness track করুন</p>
          </div>
          <button onClick={() => router.push("/dashboard")}
            className="px-4 py-2 rounded-lg text-sm border border-white/10 text-white/60 hover:border-white/30 transition"
            style={{background: "rgba(255,255,255,0.05)"}}>
            ← ড্যাশবোর্ড
          </button>
        </div>

        {/* Readiness Card */}
        <div className="rounded-2xl p-8 mb-6 border border-white/10 text-center" style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
          backdropFilter: "blur(20px)"
        }}>
          <p className="text-white/40 text-sm uppercase tracking-widest mb-4">Job Readiness Score</p>
          <div className="relative w-40 h-40 mx-auto mb-4">
            <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r="70" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12"/>
              <circle cx="80" cy="80" r="70" fill="none"
                stroke="url(#gradient)" strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={`${2 * Math.PI * 70}`}
                strokeDashoffset={`${2 * Math.PI * 70 * (1 - readiness / 100)}`}
              />
              <defs>
                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-4xl font-bold text-white">{readiness}%</p>
            </div>
          </div>
          <p className="text-white/60 text-sm">
            {readiness >= 80 ? "🎉 দারুণ! আপনি job ready!" :
             readiness >= 50 ? "💪 ভালো progress! আরো কিছু skills দরকার" :
             "📚 Resume upload করুন এবং skills যোগ করুন"}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total Skills", value: skills.length, icon: "🔧" },
            { label: "Skill Gaps", value: gaps.length, icon: "⚠️" },
            { label: "Courses Done", value: completed.length, icon: "✅" },
          ].map((stat, i) => (
            <div key={i} className="rounded-xl p-4 text-center border border-white/10"
              style={{background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)"}}>
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-white/40 text-xs mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Skills */}
        {skills.length > 0 && (
          <div className="rounded-2xl p-6 mb-4 border border-white/10" style={{
            background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)"
          }}>
            <h2 className="text-white font-semibold mb-4">🔧 আপনার Skills ({skills.length})</h2>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-full text-xs font-medium border border-indigo-500/30 text-indigo-200"
                  style={{background: "rgba(99,102,241,0.2)"}}>
                  ✅ {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Skill Gaps */}
        {gaps.length > 0 && (
          <div className="rounded-2xl p-6 border border-white/10" style={{
            background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)"
          }}>
            <h2 className="text-white font-semibold mb-4">⚠️ Skill Gaps ({gaps.length})</h2>
            <div className="space-y-3">
              {gaps.map((gap, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl border border-white/5"
                  style={{background: "rgba(255,255,255,0.03)"}}>
                  <div>
                    <p className="text-white text-sm font-medium">{gap.missing_skill}</p>
                    <p className="text-white/40 text-xs">{gap.job_title}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                    gap.priority === "high" ? "bg-red-500/20 text-red-300 border-red-500/30" :
                    gap.priority === "medium" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" :
                    "bg-green-500/20 text-green-300 border-green-500/30"}`}>
                    {gap.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {!loading && skills.length === 0 && gaps.length === 0 && (
          <div className="rounded-2xl p-8 border border-white/10 text-center" style={{
            background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)"
          }}>
            <p className="text-4xl mb-4">📄</p>
            <p className="text-white font-semibold mb-2">এখনো কোনো data নেই</p>
            <p className="text-white/40 text-sm mb-4">Resume upload করুন এবং Job analyze করুন</p>
            <button onClick={() => router.push("/resume")}
              className="px-6 py-2 rounded-xl text-white text-sm font-medium"
              style={{background: "linear-gradient(135deg, #6366f1, #8b5cf6)"}}>
              Resume Upload করুন
            </button>
          </div>
        )}
      </div>
    </div>
  );
}