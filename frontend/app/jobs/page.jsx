"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function JobsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("preferences");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Job Preference
  const [preference, setPreference] = useState({
    job_role: "",
    industry: "",
    experience_level: "entry"
  });

  // Job Recommendations
  const [recommendations, setRecommendations] = useState([]);

  // Job Description Analysis
  const [jobDesc, setJobDesc] = useState({ job_title: "", job_description: "" });
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); }
  }, []);

  const getToken = () => localStorage.getItem("token");

  // Job Preference Save
  const handleSavePreference = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/api/jobs/preferences", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(preference)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Job preference সেভ হয়েছে!");
        setActiveTab("recommendations");
      } else {
        setMessage(`❌ ${data.detail}`);
      }
    } catch { setMessage("❌ সার্ভারের সাথে সংযোগ নেই!"); }
    finally { setLoading(false); }
  };

  // Get Recommendations
  const handleGetRecommendations = async () => {
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/api/jobs/recommendations", {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      const data = await res.json();
      if (res.ok) {
        setRecommendations(data.recommendations || []);
        if (data.recommendations?.length === 0) {
          setMessage("⚠️ কোনো recommendation পাওয়া যায়নি!");
        }
      } else {
        setMessage(`❌ ${data.detail}`);
      }
    } catch { setMessage("❌ সার্ভারের সাথে সংযোগ নেই!"); }
    finally { setLoading(false); }
  };

  // Analyze Job Description
  const handleAnalyzeJob = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://localhost:8000/api/jobs/analyze-description", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`
        },
        body: JSON.stringify(jobDesc)
      });
      const data = await res.json();
      if (res.ok) {
        setAnalysisResult(data);
        setMessage("✅ Job Description বিশ্লেষণ হয়েছে!");
      } else {
        setMessage(`❌ ${data.detail}`);
      }
    } catch { setMessage("❌ সার্ভারের সাথে সংযোগ নেই!"); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-6">
          <h1 className="text-3xl font-bold text-white">💼 Job Recommendation</h1>
          <button onClick={() => router.push("/dashboard")}
            className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 px-4 py-2 rounded-lg text-sm transition">
            ← ড্যাশবোর্ড
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {["preferences", "recommendations", "analyze"].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                activeTab === tab
                  ? "bg-blue-600 text-white"
                  : "bg-white/10 text-blue-300 hover:bg-white/20"
              }`}>
              {tab === "preferences" ? "🎯 Preferences" :
               tab === "recommendations" ? "💡 Recommendations" : "🔍 Job Analyzer"}
            </button>
          ))}
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-lg mb-4 text-sm ${
            message.includes("❌") ? "bg-red-500/20 border border-red-400 text-red-300" :
            message.includes("✅") ? "bg-green-500/20 border border-green-400 text-green-300" :
            "bg-yellow-500/20 border border-yellow-400 text-yellow-300"}`}>
            {message}
          </div>
        )}

        {/* Tab 1: Preferences */}
        {activeTab === "preferences" && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
            <h2 className="text-xl font-semibold text-white mb-6">🎯 আপনার Job Preference দিন</h2>
            <form onSubmit={handleSavePreference} className="space-y-4">
              <div>
                <label className="block text-blue-200 text-sm mb-1">পছন্দের Job Role</label>
                <input type="text" required
                  value={preference.job_role}
                  onChange={(e) => setPreference({...preference, job_role: e.target.value})}
                  placeholder="যেমন: Backend Developer, Data Scientist"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                />
              </div>
              <div>
                <label className="block text-blue-200 text-sm mb-1">Industry</label>
                <input type="text"
                  value={preference.industry}
                  onChange={(e) => setPreference({...preference, industry: e.target.value})}
                  placeholder="যেমন: Technology, Finance, Healthcare"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                />
              </div>
              <div>
                <label className="block text-blue-200 text-sm mb-1">Experience Level</label>
                <select
                  value={preference.experience_level}
                  onChange={(e) => setPreference({...preference, experience_level: e.target.value})}
                  className="w-full bg-slate-800 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition">
                  <option value="entry">Entry Level (০-২ বছর)</option>
                  <option value="mid">Mid Level (২-৫ বছর)</option>
                  <option value="senior">Senior Level (৫+ বছর)</option>
                </select>
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg transition">
                {loading ? "⏳ সেভ হচ্ছে..." : "💾 Preference সেভ করুন"}
              </button>
            </form>
          </div>
        )}

        {/* Tab 2: Recommendations */}
        {activeTab === "recommendations" && (
          <div className="space-y-4">
            <button onClick={handleGetRecommendations} disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg transition">
              {loading ? "⏳ AI বিশ্লেষণ করছে..." : "🤖 AI Job Recommendations নিন"}
            </button>

            {recommendations.length > 0 && recommendations.map((job, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-white font-bold text-lg">{job.title}</h3>
                  <span className="bg-green-600/30 border border-green-500/40 text-green-300 px-3 py-1 rounded-full text-sm">
                    {job.match_percentage}% match
                  </span>
                </div>
                <p className="text-blue-300 text-sm mb-3">🏢 {job.company_type}</p>
                <p className="text-white/70 text-sm mb-3">{job.description}</p>
                <div className="flex flex-wrap gap-2">
                  {job.required_skills?.map((skill, j) => (
                    <span key={j} className="bg-blue-600/30 border border-blue-500/40 text-blue-200 px-2 py-1 rounded-full text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Job Analyzer */}
        {activeTab === "analyze" && (
          <div className="space-y-4">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-white mb-6">🔍 Job Description Analyzer</h2>
              <form onSubmit={handleAnalyzeJob} className="space-y-4">
                <div>
                  <label className="block text-blue-200 text-sm mb-1">Job Title</label>
                  <input type="text" required
                    value={jobDesc.job_title}
                    onChange={(e) => setJobDesc({...jobDesc, job_title: e.target.value})}
                    placeholder="যেমন: Senior React Developer"
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-blue-200 text-sm mb-1">Job Description paste করুন</label>
                  <textarea required
                    value={jobDesc.job_description}
                    onChange={(e) => setJobDesc({...jobDesc, job_description: e.target.value})}
                    rows={6}
                    placeholder="Job description এখানে paste করুন..."
                    className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition resize-none"
                  />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg transition">
                  {loading ? "⏳ AI বিশ্লেষণ করছে..." : "🔍 Analyze করুন"}
                </button>
              </form>
            </div>

            {/* Analysis Result */}
            {analysisResult && (
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8">
                <h2 className="text-xl font-semibold text-white mb-6">📊 বিশ্লেষণের ফলাফল</h2>

                {/* Readiness */}
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-blue-300 text-sm">Job Readiness</span>
                    <span className="text-white font-bold">{analysisResult.readiness_percentage}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-4">
                    <div className="bg-blue-600 h-4 rounded-full transition-all"
                      style={{width: `${analysisResult.readiness_percentage}%`}}>
                    </div>
                  </div>
                </div>

                {/* Matching Skills */}
                {analysisResult.matching_skills?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-green-300 text-sm font-semibold mb-2">✅ আপনার আছে:</p>
                    <div className="flex flex-wrap gap-2">
                      {analysisResult.matching_skills.map((skill, i) => (
                        <span key={i} className="bg-green-600/30 border border-green-500/40 text-green-200 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Missing Skills */}
                {analysisResult.missing_skills?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-red-300 text-sm font-semibold mb-2">❌ যা শিখতে হবে:</p>
                    <div className="space-y-2">
                      {analysisResult.missing_skills.map((item, i) => (
                        <div key={i} className="flex justify-between items-center bg-white/5 rounded-lg px-4 py-2">
                          <span className="text-white text-sm">{item.skill}</span>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            item.priority === "high" ? "bg-red-600/30 text-red-300" :
                            item.priority === "medium" ? "bg-yellow-600/30 text-yellow-300" :
                            "bg-green-600/30 text-green-300"}`}>
                            {item.priority}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                {analysisResult.summary && (
                  <div className="bg-white/5 rounded-xl p-4">
                    <p className="text-blue-300 text-xs mb-1">📝 সারসংক্ষেপ:</p>
                    <p className="text-white text-sm">{analysisResult.summary}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}