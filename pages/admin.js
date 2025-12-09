import { useState, useEffect } from "react";

// API helper
async function api(path, body = null) {
  return fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null,
  }).then((r) => r.json());
}

export default function AdminPage() {
  // ----------------------------
  // LOGIN PROTECTION
  // ----------------------------
  const [authorized, setAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  function verifyPassword() {
    if (passwordInput === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setAuthorized(true);
    } else {
      alert("Incorrect password");
    }
  }

  // LOGIN SCREEN
  if (!authorized) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#0f1114",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <h2>Admin Login</h2>

        <input
          type="password"
          placeholder="Enter admin password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          style={{
            padding: 10,
            marginTop: 12,
            borderRadius: 6,
            background: "#161a1f",
            border: "1px solid #333",
            color: "#fff",
          }}
        />

        <button
          onClick={verifyPassword}
          style={{
            marginTop: 12,
            padding: "10px 14px",
            background: "#1e4fbf",
            border: "none",
            borderRadius: 6,
            color: "#fff",
          }}
        >
          Login
        </button>
      </div>
    );
  }

  // ----------------------------
  // ADMIN DASHBOARD STATE
  // ----------------------------
  const [projects, setProjects] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    scope: "",
    status: "ongoing",
  });

  // Load projects
  async function loadProjects() {
    const res = await fetch("/api/projects/list").then((r) => r.json());
    setProjects(res);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  // Upload image
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

  // Add project
  async function addProject(e) {
    e.preventDefault();

    let uploadedImages = [];

    for (let file of images) {
      const url = await uploadImage(file);
      uploadedImages.push(url);
    }

    const payload = {
      ...form,
      images: uploadedImages,
      featured_image: uploadedImages[0] || null,
    };

    await api("/api/projects/create", payload);
    await loadProjects();

    setForm({ title: "", location: "", scope: "", status: "ongoing" });
    setImages([]);
  }

  // Delete project
  async function deleteProject(id) {
    await api("/api/projects/delete", { id });
    await loadProjects();
  }

  // ----------------------------
  // DASHBOARD UI
  // ----------------------------
  return (
    <div
      style={{
        padding: 30,
        fontFamily: "Arial",
        color: "#fff",
        background: "#0f1114",
        minHeight: "100vh",
      }}
    >
      <h1>CRPA Admin Dashboard</h1>
      <p style={{ opacity: 0.7 }}>Manage all projects here.</p>

      <hr style={{ margin: "20px 0", opacity: 0.2 }} />

      <h2>Add New Project</h2>

      <form onSubmit={addProject} style={{ marginBottom: 40 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <input
            placeholder="Project Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
            style={inputStyle}
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            style={inputStyle}
          />
        </div>

        <input
          placeholder="Scope"
          value={form.scope}
          onChange={(e) => setForm({ ...form, scope: e.target.value })}
          style={{ ...inputStyle, marginTop: 10 }}
        />

        <select
          value={form.status}
          onChange={(e) => setForm({ ...form, status: e.target.value })}
          style={{ ...inputStyle, marginTop: 10 }}
        >
          <option value="ongoing">Ongoing</option>
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>

        <div style={{ marginTop: 12 }}>
          <input
            type="file"
            multiple
            onChange={(e) => setImages([...e.target.files])}
            style={{ color: "#fff" }}
          />
        </div>

        <button
          type="submit"
          style={{
            marginTop: 15,
            padding: "10px 14px",
            background: "#1e4fbf",
            color: "#fff",
            border: "none",
            borderRadius: 6,
          }}
        >
          {uploading ? "Uploading..." : "Add Project"}
        </button>
      </form>

      <hr style={{ margin: "20px 0", opacity: 0.2 }} />

      <h2>All Projects</h2>

      {projects.map((p) => (
        <div
          key={p.id}
          style={{
            padding: 12,
            marginBottom: 10,
            border: "1px solid #333",
            borderRadius: 6,
            background: "#161a1f",
          }}
        >
          <b>{p.title}</b>
          <br />
          <span style={{ opacity: 0.6 }}>
            {p.location} • {p.status}
          </span>
          <br />

          <button
            onClick={() => deleteProject(p.id)}
            style={{
              marginTop: 6,
              padding: "4px 10px",
              background: "red",
              border: "none",
              borderRadius: 4,
              color: "#fff",
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

const inputStyle = {
  padding: 8,
  borderRadius: 6,
  background: "#161a1f",
  border: "1px solid #2c3138",
  color: "#fff",
  width: "100%",
};

