"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";

export default function LearningPage() {
  const router = useRouter();
  const [data, setData] = useState({ courses: [], certifications: [], projects: [] });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [message, setMessage] = useState("");

  const loadRecommendations = async () => {
    try {
      const res = await apiFetch("/learning/recommendations");
      setData(res);
    } catch (e) {
      setMessage(e.message);
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
    loadRecommendations();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    setMessage("");
    try {
      await apiFetch("/learning/recommendations", { method: "POST" });
      await loadRecommendations();
      setMessage("✅ Learning recommendations created!");
    } catch (e) {
      setMessage(e.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleComplete = async (id) => {
    try {
      const res = await apiFetch(`/learning/complete/${id}`, { method: "POST" });
      setMessage(res.message);
      await loadRecommendations();
    } catch (e) {
      setMessage(e.message);
    }
  };

  const renderCard = (item) => (
    <div
      key={item.id}
      className="rounded-2xl p-5 border border-white/10"
      style={{ background: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)" }}
    >
      <h3 className="text-white font-semibold mb-2">{item.title}</h3>
      <p className="text-white/50 text-sm mb-1">{item.provider}</p>
      <p className="text-purple-300 text-sm mb-2">Skill: {item.skill}</p>
      <p className="text-white/40 text-sm mb-4">{item.description}</p>

      <div className="flex gap-3">
        {item.url && (
          <a
            href={item.url}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl text-white text-sm"
            style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)" }}
          >
            Open
          </a>
        )}

        <button
          onClick={() => handleComplete(item.id)}
          disabled={item.is_completed}
          className="px-4 py-2 rounded-xl text-white text-sm disabled:opacity-50"
          style={{ background: item.is_completed ? "#16a34a" : "rgba(255,255,255,0.12)" }}
        >
          {item.is_completed ? "Completed" : "Mark Complete"}
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="min-h-screen p-6"
      style={{ background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)" }}
    >
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">📚 Learning Recommendations</h1>
            <p className="text-white/50"> Course, certification, project to fill Missing skill</p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => router.push("/dashboard")}
              className="px-4 py-2 rounded-xl text-white border border-white/10"
              style={{ background: "rgba(255,255,255,0.05)" }}
            >
              Dashboard
            </button>

            <button
              onClick={handleGenerate}
              disabled={generating}
              className="px-4 py-2 rounded-xl text-white"
              style={{ background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}
            >
              {generating ? "Generating..." : "Generate"}
            </button>
          </div>
        </div>

        {message && (
          <div
            className="mb-6 p-4 rounded-xl text-sm text-white border border-white/10"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            {message}
          </div>
        )}

        {loading ? (
          <p className="text-white">Loading...</p>
        ) : (
          <div className="space-y-8">
            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Courses</h2>
              <div className="grid md:grid-cols-2 gap-4">{data.courses.map(renderCard)}</div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Certifications</h2>
              <div className="grid md:grid-cols-2 gap-4">{data.certifications.map(renderCard)}</div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-white mb-4">Projects</h2>
              <div className="grid md:grid-cols-2 gap-4">{data.projects.map(renderCard)}</div>
            </section>
          </div>
        )}
      </div>
    </div>
  );
}