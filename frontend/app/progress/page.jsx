"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function ProgressPage() {
  const router = useRouter();
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [summaryData, detailsData] = await Promise.all([
        apiFetch("/progress/summary"),
        apiFetch("/progress/details")
      ]);
      setSummary(summaryData);
      setDetails(detailsData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    loadData();
  }, []);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "linear-gradient(135deg, #0f0c29 0%, #1f1b4d 50%, #111827 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">📈 Progress</h1>
            <p className="text-white/50">Track Skill growth and readiness</p>
          </div>

          <button
            onClick={() => router.push("/dashboard")}
            className="px-4 py-2 rounded-xl text-white border border-white/10"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            Dashboard
          </button>
        </div>

        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {[
            ["Skills", summary.total_skills],
            ["Resumes", summary.total_resumes],
            ["Jobs", summary.recommended_jobs],
            ["Completed", summary.completed_learning],
            ["Readiness", `${summary.readiness_percentage}%`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl p-5 border border-white/10"
              style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(10px)" }}
            >
              <p className="text-white/50 text-sm">{label}</p>
              <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl p-6 border border-white/10 mb-8"
          style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(10px)" }}
        >
          <div className="flex justify-between mb-3">
            <span className="text-white">Overall Readiness</span>
            <span className="text-white font-semibold">{summary.readiness_percentage}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-white/10">
            <div
              className="h-3 rounded-full"
              style={{
                width: `${summary.readiness_percentage}%`,
                background: "linear-gradient(90deg, #22c55e, #6366f1)"
              }}
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>
            <h2 className="text-white font-semibold mb-4">✅ Current Skills</h2>
            <div className="flex flex-wrap gap-2">
              {details.skills.map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm text-green-300 border border-green-500/30 bg-green-500/10"
                >
                  {s.skill_name}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>
            <h2 className="text-white font-semibold mb-4">⚠️ Skill Gaps</h2>
            <div className="space-y-3">
              {details.skill_gaps.map((g, i) => (
                <div key={i} className="p-3 rounded-xl border border-white/10">
                  <p className="text-white">{g.missing_skill}</p>
                  <p className="text-white/40 text-sm">{g.job_title}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>
            <h2 className="text-white font-semibold mb-4">🎓 Completed Learning</h2>
            <div className="space-y-3">
              {details.completed_learning.map((c, i) => (
                <div key={i} className="p-3 rounded-xl border border-white/10">
                  <p className="text-white">{c.title}</p>
                  <p className="text-green-300 text-sm">{c.skill} • {c.type}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.06)" }}>
            <h2 className="text-white font-semibold mb-4">📚 Pending Learning</h2>
            <div className="space-y-3">
              {details.pending_learning.map((p, i) => (
                <div key={i} className="p-3 rounded-xl border border-white/10">
                  <p className="text-white">{p.title}</p>
                  <p className="text-yellow-300 text-sm">{p.skill} • {p.type}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}