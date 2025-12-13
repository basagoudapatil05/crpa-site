import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@supabase/supabase-js";

/* -------------------------
   SUPABASE CLIENT
-------------------------- */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/* -------------------------
   ADMIN COMPONENT
-------------------------- */
function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    scope: "",
    category: "Residence",
    status: "Ongoing",
    images: [],
  });

  /* -------------------------
     LOGIN
  -------------------------- */
  const handleLogin = () => {
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      localStorage.setItem("admin", "true");
      setLoggedIn(true);
    } else {
      alert("Incorrect password");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin");
    setLoggedIn(false);
  };

  useEffect(() => {
    if (localStorage.getItem("admin") === "true") {
      setLoggedIn(true);
    }
    fetchProjects();
  }, []);

  /* -------------------------
     FETCH PROJECTS
  -------------------------- */
  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("id", { ascending: false });

    if (!error) setProjects(data || []);
  }

  /* -------------------------
     IMAGE UPLOAD
  -------------------------- */
  async function uploadImages(files) {
    const urls = [];

    for (const file of files) {
      const fileExt = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;

      const { error } = await supabase.storage
        .from("project-images")
        .upload(fileName, file, {
          upsert: false,
        });

      if (error) {
        console.error(error);
        alert("Image upload failed");
        return [];
      }

      const { data } = supabase.storage
        .from("project-images")
        .getPublicUrl(fileName);

      urls.push(data.publicUrl);
    }

    return urls;
  }

  /* -------------------------
     CREATE PROJECT
  -------------------------- */
  async function addProject() {
    if (!form.title) {
      alert("Title required");
      return;
    }

    setLoading(true);

    let imageUrls = [];
    if (form.images.length > 0) {
      imageUrls = await uploadImages(form.images);
    }

    const { error } = await supabase.from("projects").insert([
      {
        title: form.title,
        location: form.location,
        description: form.scope,
        category: form.category,
        status: form.status.toLowerCase(),
        images: imageUrls,
        featured_image: imageUrls[0] || null,
      },
    ]);

    setLoading(false);

    if (error) {
      console.error(error);
      alert("Failed to add project");
      return;
    }

    setForm({
      title: "",
      location: "",
      scope: "",
      category: "Residence",
      status: "Ongoing",
      images: [],
    });

    fetchProjects();
  }

  /* -------------------------
     DELETE PROJECT
  -------------------------- */
  async function deleteProject(id) {
    if (!confirm("Delete this project?")) return;

    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  }

  /* -------------------------
     LOGIN SCREEN
  -------------------------- */
  if (!loggedIn) {
    return (
      <div style={{ padding: 50 }}>
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  /* -------------------------
     DASHBOARD
  -------------------------- */
  return (
    <div style={{ padding: 30 }}>
      <h1>CRPA Admin Dashboard</h1>
      <button onClick={logout}>Logout</button>

      <h2>Add Project</h2>

      <input
        placeholder="Project Title"
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
        onChange={(e) =>
          setForm({ ...form, images: Array.from(e.target.files) })
        }
      />

      <button onClick={addProject} disabled={loading}>
        {loading ? "Adding..." : "Add Project"}
      </button>

      <h2>All Projects</h2>

      {projects.map((p) => (
        <div key={p.id} style={{ marginBottom: 30 }}>
          <h3>{p.title}</h3>
          <p>
            {p.location} • {p.status}
          </p>

          <div style={{ display: "flex", gap: 10 }}>
            {Array.isArray(p.images) &&
              p.images.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  width="120"
                  style={{ borderRadius: 6 }}
                />
              ))}
          </div>

          <button onClick={() => deleteProject(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

/* -------------------------
   DISABLE SSR (CRITICAL)
-------------------------- */
export default dynamic(() => Promise.resolve(Admin), {
  ssr: false,
});
