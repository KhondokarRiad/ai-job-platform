"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [activeMenu, setActiveMenu] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");
    if (!token) { router.push("/login"); return; }
    setUser(JSON.parse(userData));

    // Skills fetch করো
    fetch("http://localhost:8000/api/resume/skills", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setSkills(data.skills || []))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">⏳ Loading...</div>
    </div>
  );

  const modules = [
    {
      icon: "👤",
      title: "Profile",
      desc: "প্রোফাইল দেখুন ও আপডেট করুন",
      path: "/profile",
      color: "from-blue-600 to-blue-800",
      badge: "Active"
    },
    {
      icon: "📄",
      title: "Resume Uplode",
      desc: "PDF/DOC আপলোড করুন — AI স্কিল বিশ্লেষণ",
      path: "/resume",
      color: "from-purple-600 to-purple-800",
      badge: skills.length > 0 ? `${skills.length} Skills` : "Upload"
    },
    {
      icon: "💼",
      title: "Job Recommendation",
      desc: "AI দিয়ে আপনার জন্য সেরা jobs খুঁজুন",
      path: "/jobs",
      color: "from-green-600 to-green-800",
      badge: "AI Powered"
    },
    {
      icon: "📊",
      title: "Skill Gap",
      desc: "কোন skills শিখতে হবে জানুন",
      path: "/jobs",
      color: "from-orange-600 to-orange-800",
      badge: "Coming Soon"
    },
    {
      icon: "📚",
      title: "Learning Path",
      desc: "কোর্স ও সার্টিফিকেশন recommendations",
      path: "/learning",
      color: "from-pink-600 to-pink-800",
      badge: "Module 3"
    },
    {
      icon: "📈",
      title: "Progress Track",
      desc: "আপনার career progress দেখুন",
      path: "/progress",
      color: "from-teal-600 to-teal-800",
      badge: "Module 3"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900">

      {/* Navbar */}
      <nav className="bg-white/5 backdrop-blur-md border-b border-white/10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <div>
              <h1 className="text-white font-bold text-xl">SkillBridge</h1>
              <p className="text-blue-300 text-xs">AI-Powered Career Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-full px-4 py-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-green-300 text-xs">Online</span>
            </div>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold cursor-pointer"
              onClick={() => router.push("/profile")}>
              {user.full_name?.charAt(0).toUpperCase()}
            </div>
            <button onClick={handleLogout}
              className="bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-300 px-4 py-2 rounded-lg text-sm transition">
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto p-6">

        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-md border border-white/20 rounded-2xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
                {user.full_name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="text-blue-300 text-sm mb-1">Welcome 👋</p>
                <h2 className="text-3xl font-bold text-white">{user.full_name}</h2>
                <p className="text-blue-300 mt-1">{user.email}</p>
                {user.career_goal && (
                  <span className="inline-block bg-blue-600/30 border border-blue-500/40 text-blue-200 text-xs px-3 py-1 rounded-full mt-2">
                    🎯 {user.career_goal}
                  </span>
                )}
              </div>
            </div>
            <div className="hidden md:block text-right">
              <p className="text-blue-300 text-sm">Your Skills</p>
              <p className="text-4xl font-bold text-white">{skills.length}</p>
              <p className="text-blue-300 text-xs">detected</p>
            </div>
          </div>

          {/* Skills Preview */}
          {skills.length > 0 && (
            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-blue-300 text-xs mb-3">🔧 Your Skills:</p>
              <div className="flex flex-wrap gap-2">
                {skills.slice(0, 8).map((skill, i) => (
                  <span key={i} className="bg-blue-600/30 border border-blue-500/40 text-blue-200 px-3 py-1 rounded-full text-xs">
                    {skill}
                  </span>
                ))}
                {skills.length > 8 && (
                  <span className="bg-white/10 text-white/60 px-3 py-1 rounded-full text-xs">
                    +{skills.length - 8} more
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Skills", value: skills.length, icon: "🔧", color: "blue" },
            { label: "Job Matches", value: "AI Ready", icon: "💼", color: "green" },
            { label: "Profile", value: "Complete", icon: "👤", color: "purple" },
            { label: "Progress", value: "Active", icon: "📈", color: "orange" },
          ].map((stat, i) => (
            <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 text-center">
              <div className="text-2xl mb-2">{stat.icon}</div>
              <p className="text-white font-bold text-lg">{stat.value}</p>
              <p className="text-blue-300 text-xs">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Module Cards */}
        <h3 className="text-white font-semibold text-lg mb-4">📋 All Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {modules.map((mod, i) => (
            <div key={i}
              onClick={() => router.push(mod.path)}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 cursor-pointer transition group">
              <div className="flex justify-between items-start mb-4">
                <span className="text-4xl">{mod.icon}</span>
                <span className="bg-white/10 text-white/60 text-xs px-2 py-1 rounded-full">
                  {mod.badge}
                </span>
              </div>
              <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-blue-300 transition">
                {mod.title}
              </h3>
              <p className="text-blue-300 text-sm">{mod.desc}</p>
              <div className="mt-4 flex items-center text-blue-400 text-xs group-hover:text-blue-300 transition">
                <span>যান</span>
                <span className="ml-1 group-hover:ml-2 transition-all">→</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}