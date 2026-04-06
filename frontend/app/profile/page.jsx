"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ full_name: "", career_goal: "", bio: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    fetch("http://localhost:8000/api/profile/", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setForm({ full_name: data.full_name || "", career_goal: data.career_goal || "", bio: data.bio || "" });
      })
      .catch(() => router.push("/login"));
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8000/api/profile/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data);
        setEditing(false);
        setMessage("✅ Profile Updated!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch { setMessage("❌ Update Failed!"); }
    finally { setLoading(false); }
  };

  if (!user) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <div className="text-white text-xl animate-pulse">⏳ Loading...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8 pt-6">
          <h1 className="text-3xl font-bold text-white">👤 My Profile </h1>
          <div className="flex gap-2">
            <button onClick={() => router.push("/dashboard")}
              className="bg-blue-600/30 hover:bg-blue-600/50 border border-blue-500/40 text-blue-300 px-4 py-2 rounded-lg text-sm transition">
              ← Dashboard
            </button>
            <button onClick={() => { localStorage.removeItem("token"); localStorage.removeItem("user"); router.push("/login"); }}
              className="bg-red-600/30 hover:bg-red-600/50 border border-red-500/40 text-red-300 px-4 py-2 rounded-lg text-sm transition">
              logout
            </button>
          </div>
        </div>

        {message && (
          <div className="bg-green-500/20 border border-green-400 text-green-300 px-4 py-3 rounded-lg mb-4">
            {message}
          </div>
        )}

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-lg">
              {user.full_name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">{user.full_name}</h2>
              <p className="text-blue-300">{user.email}</p>
              {user.career_goal && (
                <span className="inline-block bg-blue-600/30 border border-blue-500/40 text-blue-200 text-xs px-3 py-1 rounded-full mt-1">
                  🎯 {user.career_goal}
                </span>
              )}
            </div>
          </div>

          {!editing ? (
            <div className="space-y-4">
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-blue-300 text-xs mb-1">Bio</p>
                <p className="text-white">{user.bio || "Bio not aded yet"}</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4">
                <p className="text-blue-300 text-xs mb-1">Account Creation date</p>
                <p className="text-white">{new Date(user.created_at).toLocaleDateString("bn-BD")}</p>
              </div>
              <button onClick={() => setEditing(true)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition">
                ✏️ Edit Profile
              </button>
            </div>
          ) : (
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-blue-200 text-sm mb-1">Full Name</label>
                <input type="text" value={form.full_name}
                  onChange={(e) => setForm({...form, full_name: e.target.value})}
                  className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                />
              </div>
              <div>
                <label className="block text-blue-200 text-sm mb-1">Career Goal</label>
                <input type="text" value={form.career_goal}
                  onChange={(e) => setForm({...form, career_goal: e.target.value})}
                  placeholder="যেমন: Backend Developer"
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition"
                />
              </div>
              <div>
                <label className="block text-blue-200 text-sm mb-1">Bio</label>
                <textarea value={form.bio}
                  onChange={(e) => setForm({...form, bio: e.target.value})}
                  rows={3} placeholder="Write something about yourself ..."
                  className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-400 transition resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button type="submit" disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition">
                  {loading ? "⏳ Saving..." : "💾 Save"}
                </button>
                <button type="button" onClick={() => setEditing(false)}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white font-semibold py-3 rounded-lg transition">
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}