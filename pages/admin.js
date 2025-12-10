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

  // LOGIN
  function handleLogin(e) {
    e.preventDefault();

    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  }

  // LOAD PROJECTS
  async function loadProjects() {
    const res = await fetch("/api/projects/list");
    const data = await res.json();
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name }),
    }).then(r => r.json());

    await fetch(res.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    const publicURL =
      `https://${process.env.NEXT_PUBLIC_SUPABASE_ID}.supabase.co/storage/v1/object/public/project-images/${res.path}`;

    setUploading(false);

    return publicURL;
  }

  // ADD PROJECT
  async function addProject(e) {
    e.preventDefault();

    let uploadedImages = [];

    if (images.length > 0) {
      for (let file of images) {
        const url = await uploadImage(file);
        uploadedImages.push(url);
      }
    }

    const payload = {
      ...form,
      images: uploadedImages,
      featured_image: uploadedImages[0] || null,
    };

    await fetch("/api/projects/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
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
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    loadProjects();
  }

  // LOGOUT
  function logout() {
    setAuthenticated(false);
    setPassword("");
  }

  // LOGIN SCREEN
  if (!authenticated) {
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

  // ADMIN DASHBOARD
  return (
    <div className={styles.container}>
      <h1>CRPA Admin Dashboard</h1>

      <button onClick={logout} className={styles.logoutBtn}>
        Logout
      </button>

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

        {/* IMAGE PREVIEW */}
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages([...e.target.files])}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {images.map((file, i) => (
            <img
              key={i}
              src={URL.createObjectURL(file)}
              style={{ width: 80, height: 80, objectFit: "cover" }}
            />
          ))}
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

