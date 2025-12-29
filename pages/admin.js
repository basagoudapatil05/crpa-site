import { useEffect, useState } from "react";
import { uploadImages } from "../lib/uploadImages";

export default function Admin() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({
    title: "",
    location: "",
    scope: "",
    status: "ongoing",
  });
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/projects/list")
      .then((r) => r.json())
      .then(setProjects)
      .catch(console.error);
  }, []);

  async function addProject() {
    try {
      setLoading(true);

      const imageUrls = await uploadImages(files);

      const res = await fetch("/api/projects/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          images: imageUrls,
        }),
      });

      if (!res.ok) throw new Error("Create failed");

      const created = await res.json();
      setProjects([created, ...projects]);

      setForm({ title: "", location: "", scope: "", status: "ongoing" });
      setFiles([]);
    } catch (err) {
      alert("Error adding project");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>CRPA Admin Dashboard</h1>

      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <input
        placeholder="Location"
        value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })}
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
        <option value="ongoing">Ongoing</option>
        <option value="completed">Completed</option>
        <option value="upcoming">Upcoming</option>
      </select>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles(Array.from(e.target.files))}
      />

      <button onClick={addProject} disabled={loading}>
        {loading ? "Uploading..." : "Add Project"}
      </button>

      <hr />

      <h2>All Projects</h2>
      {projects.map((p) => (
        <div key={p.id}>
          <strong>{p.title}</strong> — {p.status}
        </div>
      ))}
    </div>
  );
}

