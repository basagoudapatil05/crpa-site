import { useState, useEffect } from "react";
import styles from "../styles/Admin.module.css";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    scope: "",
    status: "ongoing",
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [projects, setProjects] = useState([]);

  // CHECK PASSWORD
  function handleLogin(e) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  }

  // FETCH ALL PROJECTS
  async function loadProjects() {
    const data = await fetch("/api/projects/list").then((r) => r.json());
    setProjects(data);
  }

  useEffect(() => {
    if (authenticated) loadProjects();
  }, [authenticated]);

  // UPLOAD IMAGE
  async function uploadImage(file) {
    setUploading(true);

    const res = await fetch("/api/upload-url", {
      method: "POST",
      body: JSON.stringify({ filename: file.name }),
    }).then((r) => r.json());

    await fetch(res.uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });

    const publicURL = `https://${process.env.NEXT_PUBLIC_SUPABASE_ID}.supabase.co/storage/v1/object/public/project-images/${res.path}`;

    setUploading(false);
    return publicURL;
  }

  // ADD PROJECT
  async function addProject(e) {
    e.preventDefault();

    let uploaded = [];

    for (let img of images) {
      const url = await uploadImage(img);
      uploaded.push(url);
    }

    const payload = {
      ...form,
      images: uploaded,
      featured_image: uploaded[0] || null,
    };

    await fetch("/api/projects/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    setForm({ title: "", location: "", scope: "", status: "ongoing" });
    setImages([]);
    loadProjects();
  }

  // DELETE PROJECT
  async function deleteProject(id) {
    await fetch("/api/projects/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    loadProjects();
  }

  // LOGIN SCREEN
  if (!authenticated) {<p style={{ color:'#bbb' }}>DEBUG PUBLIC PW (length): { (process.env.NEXT_PUBLIC_ADMIN_PASSWORD || '').length }</p>
    return (
      <div className={styles.loginWrapper}>
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  // DASHBOARD
  return (
    <div className={styles.container}>
      <h1>CRPA Admin Dashboard</h1>

      <h2>Add New Project</h2>
      <form onSubmit={addProject}>
        <input
          placeholder="Project Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
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
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>

        {/* IMAGE UPLOAD WITH PREVIEW */}
<div style={{ marginTop: 12 }}>
  <input
    type="file"
    multiple
    accept="image/*"
    onChange={(e) => {
      const files = Array.from(e.target.files);
      setImages(files);
    }}
    style={{ color: "#fff" }}
  />

  {/* Preview thumbnails */}
  {images.length > 0 && (
    <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
      {images.map((file, i) => (
        <div key={i} style={{ position: "relative" }}>
          <img
            src={URL.createObjectURL(file)}
            style={{
              width: 90,
              height: 90,
              objectFit: "cover",
              borderRadius: 6,
              border: "1px solid #333",
            }}
          />

          {/* Remove button */}
          <button
            onClick={() =>
              setImages(images.filter((_, idx) => idx !== i))
            }
            style={{
              position: "absolute",
              top: -8,
              right: -8,
              background: "red",
              color: "#fff",
              border: "none",
              borderRadius: "50%",
              width: 22,
              height: 22,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  )}
</div>


        <button type="submit">
          {uploading ? "Uploading..." : "Add Project"}
        </button>
      </form>

      <h2>All Projects</h2>
      {projects.map((p) => (
        <div key={p.id} className={styles.projectCard}>
          <b>{p.title}</b>
          <p>{p.location} • {p.status}</p>
          <button onClick={() => deleteProject(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

