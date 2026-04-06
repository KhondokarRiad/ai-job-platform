"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function DashboardPage() {
  const router = useRouter();
  const [summary, setSummary] = useState(null);
  const [details, setDetails] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [summaryData, detailsData, profileData] = await Promise.all([
          apiFetch("/progress/summary"),
          apiFetch("/progress/details"),
          apiFetch("/profile/"),
        ]);

        setSummary(summaryData);
        setDetails(detailsData);
        setProfile(profileData);
      } catch (e) {
        console.error(e);
      }
    };

    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!summary || !details || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading...
      </div>
    );
  }

  const navItems = [
    { label: "Dashboard", icon: "🏠", path: "/dashboard", active: true },
    { label: "Profile", icon: "👤", path: "/profile", active: false },
    { label: "Resume", icon: "📄", path: "/resume", active: false },
    { label: "Jobs", icon: "💼", path: "/jobs", active: false },
    { label: "Learning", icon: "📚", path: "/learning", active: false },
    { label: "Progress", icon: "📈", path: "/progress", active: false },
  ];

  return (
    <div
      className="min-h-screen flex"
      style={{
        background:
          "linear-gradient(135deg, #0f172a 0%, #312e81 50%, #111827 100%)",
      }}
    >
      {/* Sidebar */}
      <aside
        className="w-72 p-5 border-r border-white/10"
        style={{
          background: "rgba(255,255,255,0.06)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">AI Job Platform</h1>
          <p className="text-white/50 text-sm mt-1">Career Growth Dashboard</p>
        </div>

        {/* Profile Section */}
        <div
          className="rounded-2xl p-4 mb-6 border border-white/10"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-xl"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
              }}
            >
              👤
            </div>
            <div>
              <h3 className="text-white font-semibold">
                {profile.full_name || profile.name || "User"}
              </h3>
              <p className="text-white/50 text-sm">{profile.email}</p>
            </div>
          </div>

          <button
            onClick={() => router.push("/profile")}
            className="w-full py-2 rounded-xl text-white text-sm"
            style={{ background: "rgba(255,255,255,0.1)" }}
          >
            View Profile
          </button>
        </div>

        {/* Navigation */}
        <div className="space-y-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => router.push(item.path)}
              className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition"
              style={{
                background: item.active
                  ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                  : "rgba(255,255,255,0.05)",
                color: "white",
                border: item.active
                  ? "1px solid rgba(255,255,255,0.18)"
                  : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <span className="flex items-center gap-3">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </span>

              {item.active && <span className="text-sm">●</span>}
            </button>
          ))}
        </div>

        {/* Logout */}
        <div className="mt-8">
          <button
            onClick={handleLogout}
            className="w-full py-3 rounded-xl text-white font-medium"
            style={{
              background: "linear-gradient(135deg, #ef4444, #dc2626)",
            }}
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">🚀 Dashboard</h1>
          <p className="text-white/50">Career progress overview</p>
        </div>

        {/* Summary Cards */}
        <div className="grid md:grid-cols-5 gap-4 mb-8">
          {[
            ["Total Skills", summary.total_skills],
            ["Resume Uploaded", summary.total_resumes],
            ["Recommended Jobs", summary.recommended_jobs],
            ["Completed Learning", summary.completed_learning],
            ["Readiness", `${summary.readiness_percentage}%`],
          ].map(([label, value]) => (
            <div
              key={label}
              className="rounded-2xl p-5 border border-white/10"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
              }}
            >
              <p className="text-white/50 text-sm">{label}</p>
              <h3 className="text-2xl font-bold text-white mt-2">{value}</h3>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <button
            onClick={() => router.push("/resume")}
            className="rounded-2xl p-5 text-white"
            style={{ background: "linear-gradient(135deg, #06b6d4, #3b82f6)" }}
          >
            📄 Upload Resume
          </button>

          <button
            onClick={() => router.push("/jobs")}
            className="rounded-2xl p-5 text-white"
            style={{ background: "linear-gradient(135deg, #8b5cf6, #ec4899)" }}
          >
            💼 Jobs
          </button>

          <button
            onClick={() => router.push("/learning")}
            className="rounded-2xl p-5 text-white"
            style={{ background: "linear-gradient(135deg, #10b981, #22c55e)" }}
          >
            📚 Learning
          </button>

          <button
            onClick={() => router.push("/progress")}
            className="rounded-2xl p-5 text-white"
            style={{ background: "linear-gradient(135deg, #f59e0b, #ef4444)" }}
          >
            📈 Progress
          </button>
        </div>

        {/* Details */}
        <div className="grid md:grid-cols-2 gap-6">
          <div
            className="rounded-2xl p-6 border border-white/10"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <h2 className="text-white font-semibold mb-4">Top Skills</h2>
            <div className="flex flex-wrap gap-2">
              {details.skills.slice(0, 8).map((s, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-sm border border-green-500/30 text-green-300 bg-green-500/10"
                >
                  {s.skill_name}
                </span>
              ))}
            </div>
          </div>

          <div
            className="rounded-2xl p-6 border border-white/10"
            style={{ background: "rgba(255,255,255,0.06)" }}
          >
            <h2 className="text-white font-semibold mb-4">
              Pending Skill Gaps
            </h2>
            <div className="space-y-3">
              {details.skill_gaps.slice(0, 5).map((g, i) => (
                <div key={i} className="p-3 rounded-xl border border-white/10">
                  <p className="text-white">{g.missing_skill}</p>
                  <p className="text-white/40 text-sm">{g.job_title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}