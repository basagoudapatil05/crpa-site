import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../lib/supabase";
import { uploadImages } from "../lib/uploadImages";

function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [scope, setScope] = useState("");
  const [category, setCategory] = useState("Residence");
  const [status, setStatus] = useState("ongoing");
  const [files, setFiles] = useState([]);

  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);

  // -------------------------
  // LOGIN
  // -------------------------
  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem("admin_logged", "yes");
      setLoggedIn(true);
    } else {
      alert("Wrong password");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_logged");
    setLoggedIn(false);
  };

  useEffect(() => {
    if (localStorage.getItem("admin_logged") === "yes") {
      setLoggedIn(true);
    }
    loadProjects();
  }, []);

  // -------------------------
  // LOAD PROJECTS (TEXT ONLY)
  // -------------------------
  async function loadProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    setProjects(data || []);
  }

  // -------------------------
  // ADD PROJECT
  // -------------------------
  async function addProject() {
    if (!title) {
      alert("Title required");
      return;
    }

    try {
      setLoading(true);

      let imageUrls = [];

      if (files.length > 0) {
        imageUrls = await uploadImages(files);
      }

      // ✅ Always insert ARRAY (never null / string)
      const { error } = await supabase.from("projects").insert([
        {
          title,
          location,
          scope,
          category,
          status,
          images: imageUrls, // text[]
        },
      ]);

      if (error) throw error;

      setTitle("");
      setLocation("");
      setScope("");
      setFiles([]);

      await loadProjects();
      alert("Project added successfully");
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  }

  // -------------------------
  // UI
  // -------------------------
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
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>CRPA Admin Dashboard</h1>
      <button onClick={logout}>Logout</button>

      <h2>Add Project</h2>

      <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input placeholder="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
      <input placeholder="Scope" value={scope} onChange={(e) => setScope(e.target.value)} />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Residence</option>
        <option>Commercial</option>
        <option>Temple</option>
      </select>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="ongoing">Ongoing</option>
        <option value="upcoming">Upcoming</option>
        <option value="completed">Completed</option>
      </select>

      <input type="file" multiple onChange={(e) => setFiles([...e.target.files])} />

      <button onClick={addProject} disabled={loading}>
        {loading ? "Uploading..." : "Add Project"}
      </button>

      <h2>All Projects</h2>
      {projects.map((p) => (
        <div key={p.id}>
          {p.title} — {p.status}
        </div>
      ))}
    </div>
  );
}

// ✅ REQUIRED: disable SSR for admin
export default dynamic(() => Promise.resolve(Admin), { ssr: false });

