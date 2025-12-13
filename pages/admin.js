import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import styles from "../styles/Admin.module.css";

function Admin() {
  // ---------------- AUTH ----------------
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);

  // ---------------- FORM ----------------
  const [form, setForm] = useState({
    title: "",
    location: "",
    scope: "",
    status: "ongoing",
    category: "residence",
  });

  const [images, setImages] = useState([]);
  const [projects, setProjects] = useState([]);
  const [uploading, setUploading] = useState(false);

  // ---------------- LOGIN ----------------
  function handleLogin(e) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthenticated(true);
    } else {
      alert("Incorrect password");
    }
  }

  function logout() {
    setAuthenticated(false);
    setPassword("");
  }

  // ---------------- LOAD PROJECTS ----------------
  async function loadProjects() {
    const res = await fetch("/api/projects/list");
    const data = await res.json();
    setProjects(data || []);
  }

  useEffect(() => {
    if (authenticated) loadProjects();
  }, [authenticated]);

  // ---------------- IMAGE UPLOAD ----------------
  async function uploadImage(file) {
    setUploading(true);

    const res = await fetch("/api/upload-url", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ filename: file.name }),
    }).then((r) => r.json());

    await fetch(res.uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    setUploading(false);

    return `https://${process.env.NEXT_PUBLIC_SUPABASE_ID}.supabase.co/storage/v1/object/public/project-images/${res.path}`;
  }

  // ---------------- ADD PROJECT ----------------
  async function addProject(e) {
    e.preventDefault();

    let uploadedImages = [];

    for (let file of images) {
      const url = await uploadImage(file);
      uploadedImages.push(url);
    }

    await fetch("/api/projects/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        images: uploadedImages,
        featured_image: uploadedImages[0] || null,
      }),
    });

    setForm({
      title: "",
      location: "",
      scope: "",
      status: "ongoing",
      category: "residence",
    });
    setImages([]);
    loadProjects();
  }

  // DELETE PROJECT
async function deleteProject(id) {
  await fetch("/api/projects/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  });

  loadProjects();
}


  // ---------------- LOGIN SCREEN ----------------
  if (!authenticated) {
    return (
      <div className={styles.loginWrapper}>
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Admin Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  // ---------------- DASHBOARD ----------------
  return (
    <div className={styles.container}>
      <h1>CRPA Admin Dashboard</h1>
      <button onClick={logout} className={styles.logoutBtn}>Logout</button>

      <h2>Add Project</h2>

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
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="residence">Residence</option>
          <option value="hotel">Hotel</option>
          <option value="school">School</option>
          <option value="temple">Temple</option>
          <option value="commercial">Commercial</option>
          <option value="farmhouse">Farmhouse</option>
          <option value="office">Office</option>
        </select>

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
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files))}
        />

        <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
          {images.map((img, i) => (
            <img
              key={i}
              src={URL.createObjectURL(img)}
              style={{ width: 80, height: 80, objectFit: "cover" }}
            />
          ))}
        </div>

        <button type="submit">
          {uploading ? "Uploading..." : "Add Project"}
        </button>
      </form>

    <h2>All Projects</h2>

{projects.map((p) => {
  const images = Array.isArray(p.images)
    ? p.images
    : JSON.parse(p.images || "[]");

  return (
    <div key={p.id} className={styles.projectCard}>
      <b>{p.title}</b>
      <p>
        {p.location} • {p.status}
      </p>

      {images.length > 0 && (
        <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              style={{
                width: 80,
                height: 80,
                objectFit: "cover",
                borderRadius: 6,
                border: "1px solid #333",
              }}
            />
          ))}
        </div>
      )}

      <button
        onClick={() => deleteProject(p.id)}
        style={{
          marginTop: 10,
          background: "red",
          color: "#fff",
          border: "none",
          padding: "6px 12px",
          borderRadius: 4,
          cursor: "pointer",
        }}
      >
        Delete
      </button>
    </div>
  );
})}


// ✅ IMPORTANT: disable SSR for admin
export default dynamic(() => Promise.resolve(Admin), { ssr: false });
