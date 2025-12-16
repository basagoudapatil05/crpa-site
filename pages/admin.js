import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { supabase } from "../lib/supabase";
import { uploadImage } from "../lib/uploadImage";

function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [scope, setScope] = useState("");
  const [category, setCategory] = useState("Residence");
  const [status, setStatus] = useState("Ongoing");
  const [files, setFiles] = useState([]);

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- LOGIN ---------------- */
  useEffect(() => {
    if (localStorage.getItem("crpa_admin") === "true") {
      setLoggedIn(true);
      fetchProjects();
    }
  }, []);

  const login = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem("crpa_admin", "true");
      setLoggedIn(true);
      fetchProjects();
    } else {
      alert("Wrong password");
    }
  };

  const logout = () => {
    localStorage.removeItem("crpa_admin");
    setLoggedIn(false);
  };

  /* ---------------- FETCH PROJECTS ---------------- */
  const fetchProjects = async () => {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    setProjects(data || []);
  };

  /* ---------------- ADD PROJECT ---------------- */
  const addProject = async () => {
    if (!title || !location || !scope) {
      alert("Fill all fields");
      return;
    }

    setLoading(true);

    try {
      let imageUrls = [];

      for (const file of files) {
        const url = await uploadImage(file);
        if (url) imageUrls.push(url);
      }

      const { error } = await supabase.from("projects").insert([
        {
          title,
          location,
          scope,
          category,
          status,
          images: imageUrls,
        },
      ]);

      if (error) throw error;

      // reset form
      setTitle("");
      setLocation("");
      setScope("");
      setFiles([]);
      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Upload failed. Check console.");
    }

    setLoading(false);
  };

  /* ---------------- DELETE PROJECT ---------------- */
  const deleteProject = async (id) => {
    if (!confirm("Delete this project?")) return;
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  };

  /* ---------------- UI ---------------- */
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
      <h1>CRPA Admin Dashboard</h1>
      <button onClick={logout}>Logout</button>

      <h2>Add Project</h2>

      <input
        placeholder="Project Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        placeholder="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        placeholder="Scope"
        value={scope}
        onChange={(e) => setScope(e.target.value)}
      />

      <select value={category} onChange={(e) => setCategory(e.target.value)}>
        <option>Residence</option>
        <option>Commercial</option>
        <option>Temple</option>
      </select>

      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option>Ongoing</option>
        <option>Upcoming</option>
        <option>Completed</option>
      </select>

      <input
        type="file"
        multiple
        onChange={(e) => setFiles([...e.target.files])}
      />

      <button onClick={addProject} disabled={loading}>
        {loading ? "Uploading..." : "Add Project"}
      </button>

      <h2>All Projects</h2>

      {projects.map((p) => (
        <div key={p.id} style={{ border: "1px solid #444", margin: 10, padding: 10 }}>
          <b>{p.title}</b>
          <p>
            {p.location} • {p.status}
          </p>
          <button onClick={() => deleteProject(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

/* 🔒 DISABLE SSR (IMPORTANT) */
export default dynamic(() => Promise.resolve(Admin), { ssr: false });
