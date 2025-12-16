import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function Admin() {
  /* ---------------- AUTH ---------------- */
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  useEffect(() => {
    const ok = localStorage.getItem("admin_logged_in");
    if (ok === "true") setLoggedIn(true);
  }, []);

  function login() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem("admin_logged_in", "true");
      setLoggedIn(true);
    } else {
      alert("Wrong password");
    }
  }

  function logout() {
    localStorage.removeItem("admin_logged_in");
    setLoggedIn(false);
  }

  /* ---------------- FORM ---------------- */
  const [form, setForm] = useState({
    title: "",
    location: "",
    scope: "",
    category: "Residence",
    status: "Ongoing",
  });

  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [projects, setProjects] = useState([]);

  /* ---------------- LOAD PROJECTS ---------------- */
  async function loadProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setProjects(data || []);
  }

  useEffect(() => {
    if (loggedIn) loadProjects();
  }, [loggedIn]);

  /* ---------------- IMAGE UPLOAD ---------------- */
  async function uploadImages() {
    const uploaded = [];

    for (const file of files) {
      const filename = `${Date.now()}-${file.name}`;

      const { error } = await supabase.storage
        .from("project-images")
        .upload(filename, file, { upsert: false });

      if (error) {
        console.error(error);
        continue;
      }

      const { data } = supabase.storage
        .from("project-images")
        .getPublicUrl(filename);

      uploaded.push(data.publicUrl);
    }

    return uploaded;
  }

  /* ---------------- ADD PROJECT ---------------- */
  async function addProject() {
    if (!form.title) {
      alert("Title required");
      return;
    }

    setUploading(true);

    const imageUrls = files.length ? await uploadImages() : [];

    const { error } = await supabase.from("projects").insert([
      {
        title: form.title,
        location: form.location,
        scope: form.scope,
        category: form.category,
        status: form.status.toLowerCase(),
        images: imageUrls,
      },
    ]);

    setUploading(false);

    if (error) {
      alert("Insert failed – check console");
      console.error(error);
      return;
    }

    setForm({
      title: "",
      location: "",
      scope: "",
      category: "Residence",
      status: "Ongoing",
    });
    setFiles([]);
    loadProjects();
  }

  /* ---------------- DELETE ---------------- */
  async function deleteProject(id) {
    await supabase.from("projects").delete().eq("id", id);
    loadProjects();
  }

  /* ---------------- LOGIN SCREEN ---------------- */
  if (!loggedIn) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </div>
    );
  }

  /* ---------------- DASHBOARD ---------------- */
  return (
    <div style={{ padding: 30 }}>
      <button onClick={logout}>Logout</button>

      <h1>CRPA Admin Dashboard</h1>

      <h2>Add Project</h2>

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
        value={form.category}
        onChange={(e) => setForm({ ...form, category: e.target.value })}
      >
        <option>Residence</option>
        <option>Hotel</option>
        <option>School</option>
        <option>Temple</option>
        <option>Commercial</option>
        <option>Farmhouse</option>
        <option>Office</option>
      </select>

      <select
        value={form.status}
        onChange={(e) => setForm({ ...form, status: e.target.value })}
      >
        <option>Ongoing</option>
        <option>Upcoming</option>
        <option>Completed</option>
      </select>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />

      <button onClick={addProject} disabled={uploading}>
        {uploading ? "Uploading..." : "Add Project"}
      </button>

      <h2>All Projects</h2>

      {projects.map((p) => (
        <div key={p.id} style={{ border: "1px solid #444", padding: 10 }}>
          <b>{p.title}</b> – {p.location} • {p.status}
          <br />
          <button onClick={() => deleteProject(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

/* 🔒 IMPORTANT: disable SSR */
export default dynamic(() => Promise.resolve(Admin), { ssr: false });
