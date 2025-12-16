import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    scope: "",
    category: "Residence",
    status: "ongoing",
    files: []
  });

  // ---------------- LOGIN ----------------
  function login() {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setLoggedIn(true);
      localStorage.setItem("admin", "true");
    } else {
      alert("Wrong password");
    }
  }

  function logout() {
    localStorage.removeItem("admin");
    setLoggedIn(false);
  }

  useEffect(() => {
    if (localStorage.getItem("admin") === "true") {
      setLoggedIn(true);
    }
    loadProjects();
  }, []);

  // ---------------- LOAD PROJECTS ----------------
  async function loadProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false });

    setProjects(data || []);
  }

  // ---------------- IMAGE UPLOAD ----------------
  async function uploadImage(file) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("project-images")
      .upload(fileName, file);

    if (error) {
      console.error(error);
      return null;
    }

    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/project-images/${fileName}`;
  }

  // ---------------- ADD PROJECT ----------------
  async function addProject() {
    setLoading(true);

    let imageUrls = [];

    for (let file of form.files) {
      const url = await uploadImage(file);
      if (url) imageUrls.push(url);
    }

    await supabase.from("projects").insert({
      title: form.title,
      location: form.location,
      scope: form.scope,
      category: form.category,
      status: form.status,
      images: imageUrls
    });

    setForm({
      title: "",
      location: "",
      scope: "",
      category: "Residence",
      status: "ongoing",
      files: []
    });

    setLoading(false);
    loadProjects();
  }

  // ---------------- UI ----------------
  if (!loggedIn) {
    return (
      <div style={{ padding: 40 }}>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={login}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 30 }}>
      <button onClick={logout}>Logout</button>
      <h1>CRPA Admin Dashboard</h1>

      <h3>Add Project</h3>

      <input placeholder="Title" value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })} />

      <input placeholder="Location" value={form.location}
        onChange={(e) => setForm({ ...form, location: e.target.value })} />

      <input placeholder="Scope" value={form.scope}
        onChange={(e) => setForm({ ...form, scope: e.target.value })} />

      <select onChange={(e) => setForm({ ...form, category: e.target.value })}>
        <option>Residence</option>
        <option>Commercial</option>
        <option>Temple</option>
      </select>

      <select onChange={(e) => setForm({ ...form, status: e.target.value })}>
        <option value="ongoing">Ongoing</option>
        <option value="upcoming">Upcoming</option>
        <option value="completed">Completed</option>
      </select>

      <input type="file" multiple
        onChange={(e) => setForm({ ...form, files: e.target.files })} />

      <button onClick={addProject}>
        {loading ? "Uploading..." : "Add Project"}
      </button>

      <h3>All Projects</h3>
      {projects.map((p) => (
        <div key={p.id}>{p.title}</div>
      ))}
    </div>
  );
}

