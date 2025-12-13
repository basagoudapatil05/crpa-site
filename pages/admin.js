import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import dynamic from "next/dynamic";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

function Admin() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [scope, setScope] = useState("");
  const [category, setCategory] = useState("Residence");
  const [status, setStatus] = useState("ongoing");
  const [files, setFiles] = useState([]);

  // -------------------------
  // FETCH PROJECTS
  // -------------------------
  async function fetchProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    setProjects(data || []);
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  // -------------------------
  // IMAGE UPLOAD FUNCTION (FIXED)
  // -------------------------
  async function uploadImage(file) {
    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("project-images")
      .upload(fileName, file);

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    const { data } = supabase.storage
      .from("project-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  // -------------------------
  // ADD PROJECT
  // -------------------------
  async function addProject() {
    try {
      setLoading(true);

      let imageUrls = [];

      for (const file of files) {
        const url = await uploadImage(file);
        imageUrls.push(url);
      }

      await supabase.from("projects").insert([
        {
          title,
          location,
          scope,
          category,
          status,
          images: imageUrls, // ✅ ALWAYS ARRAY
        },
      ]);

      // reset form
      setTitle("");
      setLocation("");
      setScope("");
      setFiles([]);
      setLoading(false);

      fetchProjects();
    } catch (err) {
      console.error(err);
      alert("Error adding project");
      setLoading(false);
    }
  }

  // -------------------------
  // DELETE PROJECT
  // -------------------------
  async function deleteProject(id) {
    await supabase.from("projects").delete().eq("id", id);
    fetchProjects();
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>CRPA Admin Dashboard</h1>

      <h3>Add Project</h3>

      <input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
      <input placeholder="Location" value={location} onChange={e => setLocation(e.target.value)} />
      <input placeholder="Scope" value={scope} onChange={e => setScope(e.target.value)} />

      <select value={category} onChange={e => setCategory(e.target.value)}>
        <option>Residence</option>
        <option>Commercial</option>
        <option>Temple</option>
      </select>

      <select value={status} onChange={e => setStatus(e.target.value)}>
        <option value="ongoing">Ongoing</option>
        <option value="upcoming">Upcoming</option>
        <option value="completed">Completed</option>
      </select>

      <input type="file" multiple onChange={e => setFiles([...e.target.files])} />

      <button onClick={addProject} disabled={loading}>
        {loading ? "Uploading..." : "Add Project"}
      </button>

      <hr />

      <h2>All Projects</h2>

      {projects.map(p => (
        <div key={p.id} style={{ marginBottom: 20 }}>
          <b>{p.title}</b> – {p.status}
          <br />
          <button onClick={() => deleteProject(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default dynamic(() => Promise.resolve(Admin), { ssr: false });
