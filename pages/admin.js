// pages/admin.js
import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

export function Admin() {
  const [password, setPassword] = useState("");
  const [auth, setAuth] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    scope: "",
    category: "residence",
    status: "ongoing",
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [projects, setProjects] = useState([]);

  // -------------------------
  // LOGIN FUNCTION
  // -------------------------
  function handleLogin(e) {
    e.preventDefault();

    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuth(true);
    } else {
      alert("Incorrect password");
    }
  }

  // -------------------------
  // LOAD PROJECT LIST
  // -------------------------
  async function loadProjects() {
    try {
      const res = await fetch("/api/projects/list");
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Load projects error:", err);
    }
  }

  useEffect(() => {
    if (auth) loadProjects();
  }, [auth]);

  // -------------------------
  // UPLOAD IMAGE → GET PUBLIC URL
  // -------------------------
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

    const publicURL = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-images/${res.path}`;

    setUploading(false);
    
    return publicURL;
  }

  // -------------------------
  // ADD PROJECT
  // -------------------------
  async function addProject(e) {
    e.preventDefault();

    let uploadedURLs = [];

    for (let img of images) {
      let url = await uploadImage(img);
      uploadedURLs.push(url);
    }

    const payload = {
      ...form,
      images: uploadedURLs,
      featured_image: uploadedURLs[0] || null,
    };

   await fetch("/api/projects/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    title: form.title,
    location: form.location,
    scope: form.scope,
    category: form.category,
    status: form.status,          // "ongoing" | "completed" | "upcoming"
    images: imageUrls,            // ARRAY, not string
  }),
});

  // -------------------------
  // DELETE PROJECT
  // -------------------------
  async function deleteProject(id) {
    await fetch("/api/projects/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });

    loadProjects();
  }

  // -------------------------
  // LOGIN SCREEN
  // -------------------------
  if (!auth) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10, width: 250 }}
          />
          <button type="submit" style={{ marginLeft: 10 }}>
            Login
          </button>
        </form>
      </div>
    );
  }

  // -------------------------
  // ADMIN DASHBOARD
  // -------------------------
  return (
    <div style={{ padding: 30, color: "#fff", background: "#0f1114", minHeight: "100vh" }}>
      
      <button
        onClick={() => setAuth(false)}
        style={{
          background: "#1e4fbf",
          padding: "8px 14px",
          borderRadius: 6,
          border: "none",
          color: "#fff",
          marginBottom: 20,
        }}
      >
        Logout
      </button>

      <h1>CRPA Admin Dashboard</h1>

      <h2>Add Project</h2>
      <form onSubmit={addProject} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
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

        {/* CATEGORY */}
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

        {/* STATUS */}
        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
        >
          <option value="ongoing">Ongoing</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>

        {/* IMAGE UPLOAD WITH PREVIEW */}
        <input
          type="file"
          multiple
          onChange={(e) => setImages([...e.target.files])}
        />

        {/* PREVIEW */}
        {images.length > 0 && (
          <div style={{ display: "flex", gap: 10 }}>
            {images.map((img, i) => (
              <img
                key={i}
                src={URL.createObjectURL(img)}
                style={{ width: 80, height: 80, objectFit: "cover", borderRadius: 6 }}
              />
            ))}
          </div>
        )}

        <button type="submit">
          {uploading ? "Uploading..." : "Add Project"}
        </button>
      </form>

      <h2 style={{ marginTop: 40 }}>All Projects</h2>

      {projects.map((p) => (
        <div
          key={p.id}
          style={{
            padding: 15,
            background: "#161a1f",
            marginBottom: 12,
            borderRadius: 8,
          }}
        >
          <b>{p.title}</b>
          <p>{p.location} • {p.status}</p>

          <button
            onClick={() => deleteProject(p.id)}
            style={{
              marginTop: 8,
              background: "red",
              color: "#fff",
              border: "none",
              padding: "6px 10px",
              borderRadius: 6,
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

// -------------------------
// DISABLE SSR (IMPORTANT FOR ADMIN PAGE)
// -------------------------
export default dynamic(() => Promise.resolve(Admin), { ssr: false });
