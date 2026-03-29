"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ResumePage() {
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); }
  }, []);

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const ext = selected.name.split(".").pop().toLowerCase();
      if (ext !== "pdf" && ext !== "doc" && ext !== "docx") {
        setMessage("❌ শুধু PDF বা DOC ফাইল আপলোড করা যাবে!");
        setFile(null);
        return;
      }
      setFile(selected);
      setMessage("");
      setResult(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) { setMessage("❌ আগে একটা ফাইল select করো!"); return; }

    setLoading(true);
    setMessage("⏳ রিজিউমি আপলোড হচ্ছে...");

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/api/resume/upload", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`❌ ${data.detail || "আপলোড ব্যর্থ!"}`);
        return;
      }

      setResult(data.extracted_data);
      setMessage("✅ রিজিউমি সফলভাবে বিশ্লেষণ হয়েছে!");

    } catch {
      setMessage("❌ সার্ভারের সাথে সংযোগ নেই!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-8 pt-6">
          <h1 className="text-3xl font-bold text-white">📄 রিজিউমি আপলোড</h1>
          <button onClick={() => router.push("/dashboard")}
            className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 px-4 py-2 rounded-lg text-sm transition">
            ← ড্যাশবোর্ড
          </button>
        </div>

        {/* Upload Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl mb-6">
          <h2 className="text-xl font-semibold text-white mb-2">আপনার রিজিউমি আপলোড করুন</h2>
          <p className="text-blue-300 text-sm mb-6">PDF বা DOC ফরম্যাটে আপলোড করুন — AI স্বয়ংক্রিয়ভাবে স্কিল বিশ্লেষণ করবে</p>

          {message && (
            <div className={`px-4 py-3 rounded-lg mb-4 text-sm ${
              message.includes("❌") ? "bg-red-500/20 border border-red-400 text-red-300" :
              message.includes("✅") ? "bg-green-500/20 border border-green-400 text-green-300" :
              "bg-blue-500/20 border border-blue-400 text-blue-300"}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-6">
            <div className="border-2 border-dashed border-white/30 hover:border-blue-400 rounded-xl p-8 text-center transition cursor-pointer"
              onClick={() => document.getElementById("fileInput").click()}>
              <div className="text-5xl mb-3">📎</div>
              {file ? (
                <div>
                  <p className="text-white font-semibold">{file.name}</p>
                  <p className="text-blue-300 text-sm mt-1">{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              ) : (
                <div>
                  <p className="text-white font-semibold">ফাইল select করতে ক্লিক করুন</p>
                  <p className="text-blue-300 text-sm mt-1">PDF, DOC, DOCX সাপোর্টেড</p>
                </div>
              )}
              <input id="fileInput" type="file" accept=".pdf,.doc,.docx"
                onChange={handleFileChange} className="hidden" />
            </div>

            <button type="submit" disabled={loading || !file}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition">
              {loading ? "⏳ AI বিশ্লেষণ করছে..." : "🚀 রিজিউমি আপলোড করুন"}
            </button>
          </form>
        </div>

        {/* AI Result Card */}
        {result && (
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-semibold text-white mb-6">🤖 AI বিশ্লেষণের ফলাফল</h2>

            {/* Skills */}
            {result.skills && result.skills.length > 0 && (
              <div className="mb-6">
                <h3 className="text-blue-300 text-sm font-semibold mb-3">💡 আপনার Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {result.skills.map((skill, i) => (
                    <span key={i} className="bg-blue-600/30 border border-blue-500/40 text-blue-200 px-3 py-1 rounded-full text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Education */}
            {result.education && result.education.length > 0 && (
              <div className="mb-6">
                <h3 className="text-blue-300 text-sm font-semibold mb-3">🎓 শিক্ষাগত যোগ্যতা:</h3>
                {result.education.map((edu, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 mb-2">
                    <p className="text-white font-semibold">{edu.degree}</p>
                    <p className="text-blue-300 text-sm">{edu.institution} — {edu.year}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Experience */}
            {result.experience && result.experience.length > 0 && (
              <div className="mb-6">
                <h3 className="text-blue-300 text-sm font-semibold mb-3">💼 কাজের অভিজ্ঞতা:</h3>
                {result.experience.map((exp, i) => (
                  <div key={i} className="bg-white/5 rounded-xl p-4 mb-2">
                    <p className="text-white font-semibold">{exp.title}</p>
                    <p className="text-blue-300 text-sm">{exp.company} — {exp.duration}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Summary */}
            {result.summary && (
              <div>
                <h3 className="text-blue-300 text-sm font-semibold mb-3">📝 সারসংক্ষেপ:</h3>
                <div className="bg-white/5 rounded-xl p-4">
                  <p className="text-white text-sm">{result.summary}</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}