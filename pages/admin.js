import { useEffect, useState } from "react";

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    scope: "",
    category: "Residence",
    status: "Ongoing",
  });

  // 🔹 LOAD PROJECTS (SERVER API ONLY)
  async function loadProjects() {
    try {
      const res = await fetch("/api/projects/list");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error("Load failed", e);
    }
  }

  useEffect(() => {
    loadProjects();
  }, []);

  // 🔹 ADD PROJECT (SERVER API ONLY)
  async function addProject(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Create failed");

      setForm({
        title: "",
        location: "",
        scope: "",
        category: "Residence",
        status: "Ongoing",
      });

      await loadProjects();
    } catch (err) {
      console.error(err);
      alert("Failed to add project");
    }

    setLoading(false);
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>CRPA Admin Dashboard</h1>

      <form onSubmit={addProject} style={{ display: "flex", gap: 10 }}>
        <input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <input
          placeholder="Location"
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          required
        />
        <input
          placeholder="Scope"
          value={form.scope}
          onChange={(e) => setForm({ ...form, scope: e.target.value })}
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option>Ongoing</option>
          <option>Completed</option>
          <option>Upcoming</option>
        </select>

        <button disabled={loading}>
          {loading ? "Adding..." : "Add Project"}
        </button>
      </form>

      <hr />

      <h2>All Projects</h2>

      {projects.map((p) => (
        <div key={p.id} style={{ marginBottom: 10 }}>
          <b>{p.title}</b> — {p.location} ({p.status})
        </div>
      ))}
    </div>
  );
}
