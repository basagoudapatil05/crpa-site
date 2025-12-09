import { useState, useEffect } from "react";

// --- API helper ---
async function api(path, body = null) {
  return fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : null,
  }).then((r) => r.json());
}

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const [projects, setProjects] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;
  const SUPABASE_ID = process.env.NEXT_PUBLIC_SUPABASE_ID;

  // -----------------------------------
  // LOGIN SCREEN
  // -----------------------------------
  if (!auth) {
    return (
      <div
        style={{
          background: "#0f1114",
          minHeight: "100vh",
          color: "#fff",
          padding: 40,
          textAlign: "center",
        }}
      >
        <h1>Admin Login</h1>

        <input
          type="password"
          placeholder="Enter admin password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          style={{
            padding: 10,
            width: 260,
            borderRadius: 6,
            border: "1px solid #333",
            background: "#161a1f",
            color: "#fff",
          }}
        />

        <br />
        <button
          onClick={() => {
            if (passwordInput === ADMIN_PASSWORD) {
              setAuth(true);
            } else {
              alert("Incorrect password");
            }
          }}
          style={{
            marginTop: 10,
            padding: "10px 20px",
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

  // -----------------------------------
  // LOAD PROJECTS
  // -----------------------------------
  async function loadProjects() {
    const res = await fetch("/api/projects/list").then((r) => r.json());
    setProjects(res);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  // -----------------------------------
  // IMAGE UPLOAD
  // -----------------------------------
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

    setUploading(false);

    return `https://${SUPABASE_ID}.supabase.co/storage/v1/object/public/project-images/${res.path}`;
  }

  // -----------------------------------
  // FORM STATE
  // -----------------------------------
  const [form, setForm] = useState({
    title: "",
    location: "",
    scope: "",
    status: "ongoing",
  });

  // -----------------------------------
  // ADD PROJECT
  // -----------------------------------
  async function addProject(e) {
    e.preventDefault();

    let imageUrls = [];

    for (let i = 0; i < images.length; i++) {
      const url = await uploadImage(images[i]);
      imageUrls.push(url);
    }

    const payload = {
      ...form,
      images: imageUrls,
      featured_image: imageUrls[0] || null,
    };

    await api("/api/projects/create", payload);
    await loadProjects();

    setForm({ title: "", location: "", scope: "", status: "ongoing" });
    setImages([]);
  }

  // -----------------------------------
  // DELETE PROJECT
  // -----------------------------------
  async function deleteProject(id) {
    await api("/api/projects/delete", { id });
    await loadProjects();
  }

  // -----------------------------------
  // UI FOR ADMIN DASHBOARD
  // -----------------------------------
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

      <hr style={{ opacity: 0.2, margin: "20px 0" }} />

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
            borderRadius: 6,
            color: "#fff",
            border: "none",
          }}
        >
          {uploading ? "Uploading..." : "Add Project"}
        </button>
      </form>

      <hr style={{ opacity: 0.2, margin: "20px 0" }} />

      <h2>All Projects</h2>

      {projects.length === 0 ? (
        <p>No projects yet.</p>
      ) : (
        projects.map((p) => (
          <div
            key={p.id}
            style={{
              padding: 12,
              marginBottom: 10,
              border: "1px solid #333",
              background: "#161a1f",
              borderRadius: 6,
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
                padding: "6px 12px",
                background: "red",
                border: "none",
                borderRadius: 4,
                color: "#fff",
              }}
            >
              Delete
            </button>
          </div>
        ))
      )}
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

