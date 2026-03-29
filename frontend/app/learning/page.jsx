"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LearningPage() {
  const router = useRouter();
  const [completed, setCompleted] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); }
    // LocalStorage থেকে completed courses নাও
    const saved = localStorage.getItem("completed_courses");
    if (saved) setCompleted(JSON.parse(saved));
  }, []);

  const courses = [
    { id: 1, title: "React.js Complete Course", platform: "Udemy", duration: "40 hours", level: "Beginner", icon: "⚛️", skill: "React" },
    { id: 2, title: "Python for Data Science", platform: "Coursera", duration: "30 hours", level: "Intermediate", icon: "🐍", skill: "Python" },
    { id: 3, title: "Machine Learning A-Z", platform: "Udemy", duration: "44 hours", level: "Intermediate", icon: "🤖", skill: "ML" },
    { id: 4, title: "Node.js & Express", platform: "YouTube", duration: "20 hours", level: "Beginner", icon: "🟢", skill: "Node.js" },
    { id: 5, title: "SQL & Database Design", platform: "Khan Academy", duration: "15 hours", level: "Beginner", icon: "🗄️", skill: "SQL" },
    { id: 6, title: "AWS Cloud Practitioner", platform: "AWS", duration: "25 hours", level: "Beginner", icon: "☁️", skill: "AWS" },
    { id: 7, title: "Docker & Kubernetes", platform: "Udemy", duration: "22 hours", level: "Advanced", icon: "🐳", skill: "DevOps" },
    { id: 8, title: "TypeScript Masterclass", platform: "Udemy", duration: "18 hours", level: "Intermediate", icon: "📘", skill: "TypeScript" },
  ];

  const toggleComplete = (id) => {
    let updated;
    if (completed.includes(id)) {
      updated = completed.filter(c => c !== id);
      setMessage("❌ Course uncompleted!");
    } else {
      updated = [...completed, id];
      setMessage("✅ Course completed! স্কিল প্রোফাইল আপডেট হয়েছে!");
    }
    setCompleted(updated);
    localStorage.setItem("completed_courses", JSON.stringify(updated));
    setTimeout(() => setMessage(""), 3000);
  };

  const completedCount = completed.length;
  const progressPercent = Math.round((completedCount / courses.length) * 100);

  return (
    <div className="min-h-screen relative overflow-hidden" style={{
      background: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)"
    }}>
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl" style={{background: "radial-gradient(circle, #6366f1, transparent)"}}></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 rounded-full opacity-15 blur-3xl" style={{background: "radial-gradient(circle, #8b5cf6, transparent)"}}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8 pt-6">
          <div>
            <h1 className="text-3xl font-bold text-white">📚 Learning Path</h1>
            <p className="text-purple-300 text-sm mt-1">Skill gap পূরণ করুন — কোর্স complete করুন</p>
          </div>
          <button onClick={() => router.push("/dashboard")}
            className="px-4 py-2 rounded-lg text-sm border border-white/10 text-white/60 hover:border-white/30 transition"
            style={{background: "rgba(255,255,255,0.05)"}}>
            ← ড্যাশবোর্ড
          </button>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-xl mb-4 text-sm border ${
            message.includes("✅") ? "border-green-500/30 text-green-300" : "border-red-500/30 text-red-300"}`}
            style={{background: message.includes("✅") ? "rgba(34,197,94,0.1)" : "rgba(239,68,68,0.1)"}}>
            {message}
          </div>
        )}

        {/* Progress Card */}
        <div className="rounded-2xl p-6 mb-6 border border-white/10" style={{
          background: "linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))",
          backdropFilter: "blur(20px)"
        }}>
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-white font-bold text-xl">Learning Progress</h2>
              <p className="text-white/40 text-sm">{completedCount}/{courses.length} courses completed</p>
            </div>
            <div className="text-right">
              <p className="text-4xl font-bold text-white">{progressPercent}%</p>
              <p className="text-white/40 text-xs">Complete</p>
            </div>
          </div>
          <div className="w-full h-3 rounded-full" style={{background: "rgba(255,255,255,0.1)"}}>
            <div className="h-3 rounded-full transition-all duration-500"
              style={{width: `${progressPercent}%`, background: "linear-gradient(90deg, #6366f1, #8b5cf6)"}}>
            </div>
          </div>
        </div>

        {/* Course List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {courses.map((course) => (
            <div key={course.id}
              className="rounded-2xl p-5 border transition"
              style={{
                background: completed.includes(course.id) ? "rgba(99,102,241,0.15)" : "rgba(255,255,255,0.05)",
                borderColor: completed.includes(course.id) ? "rgba(99,102,241,0.4)" : "rgba(255,255,255,0.1)",
                backdropFilter: "blur(10px)"
              }}>
              <div className="flex justify-between items-start mb-3">
                <span className="text-3xl">{course.icon}</span>
                <span className={`text-xs px-2 py-1 rounded-full border font-medium ${
                  course.level === "Beginner" ? "bg-green-500/20 text-green-300 border-green-500/30" :
                  course.level === "Intermediate" ? "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" :
                  "bg-red-500/20 text-red-300 border-red-500/30"}`}>
                  {course.level}
                </span>
              </div>
              <h3 className="text-white font-semibold mb-1">{course.title}</h3>
              <p className="text-white/40 text-xs mb-1">🎓 {course.platform}</p>
              <p className="text-white/40 text-xs mb-4">⏱️ {course.duration}</p>

              <div className="flex justify-between items-center">
                <span className="text-xs px-2 py-1 rounded-full border border-purple-500/30 text-purple-300"
                  style={{background: "rgba(139,92,246,0.2)"}}>
                  #{course.skill}
                </span>
                <button onClick={() => toggleComplete(course.id)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold transition"
                  style={{
                    background: completed.includes(course.id)
                      ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                      : "rgba(255,255,255,0.1)",
                    color: "white",
                    border: completed.includes(course.id) ? "none" : "1px solid rgba(255,255,255,0.2)"
                  }}>
                  {completed.includes(course.id) ? "✅ Completed" : "Mark Complete"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}