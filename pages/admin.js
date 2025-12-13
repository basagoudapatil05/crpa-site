import React, { useEffect, useState } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const [projects, setProjects] = useState([]);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    location: "",
    scope: "",
    category: "residence",
    status: "ongoing",
  });

  // LOGIN
  function login(e) {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD) {
      setLoggedIn(true);
      loadProjects();
    } else {
      alert("Incorrect password");
    }
  }

  function logout() {
    setLoggedIn(false);
    setPassword("");
  }

  // LOAD PROJECTS
  async function loadProjects() {
    const res = await fetch("/api/projects/list");
    const data = await res.json();
    setProjects(Array.isArray(data) ? data : []);
  }

  // UPLOAD SINGLE IMAGE
  async function handleAddProject(e) {
  e.preventDefault();
  setUploading(true);

  try {
    const uploadedImages = [];

    for (const file of images) {
      const res = await fetch("/api/upload-image-url", {
        method: "POST",
        body: JSON.stringify({ filename: file.name }),
      });

      if (!res.ok) throw new Error("Failed to get upload URL");

      const { uploadUrl, publicUrl } = await res.json();

      const uploadRes = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
      });

      if (!uploadRes.ok) throw new Error("Image upload failed");

      uploadedImages.push(publicUrl);
    }

    const saveRes = await fetch("/api/projects/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        location,
        scope,
        category,
        status,
        images: uploadedImages,
      }),
    });

    if (!saveRes.ok) throw new Error("Project save failed");

    alert("✅ Project added successfully");

    setUploading(false);
    window.location.reload();

  } catch (err) {
    console.error(err);
    alert("❌ Upload failed. Please try again.");
    setUploading(false);
  }
}


  // ADD PROJECT
  async function addProject(e) {
    e.preventDefault();
    setUploading(true);

    let uploadedImages = [];

    for (let file of images) {
      const url = await uploadImage(file);
      uploadedImages.push(url);
    }

    await fetch("/api/projects/create", {
      method: "POST",
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
      category: "residence",
      status: "ongoing",
    });

    setImages([]);
    setUploading(false);
    loadProjects();
  }

  // DELETE
  async function deleteProject(id) {
    await fetch("/api/projects/delete", {
      method: "POST",
      body: JSON.stringify({ id }),
    });
    loadProjects();
  }

  // LOGIN SCREEN
  if (!loggedIn) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Admin Login</h1>
        <form onSubmit={login}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <button onClick={logout}>Logout</button>

      <h1>CRPA Admin Dashboard</h1>

      {/* ADD PROJECT */}
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
          <option value="upcoming">Upcoming</option>
          <option value="completed">Completed</option>
        </select>

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setImages(Array.from(e.target.files))}
        />

        <button type="submit">
          {uploading ? "Uploading..." : "Add Project"}
        </button>
      </form>

      {/* PROJECT LIST */}
      <h2>All Projects</h2>

      {projects.map((p) => (
        <div key={p.id} style={{ marginBottom: 20 }}>
          <b>{p.title}</b>
          <p>
            {p.location} • {p.status}
          </p>

          {/* SAFE IMAGE PREVIEW */}
          {Array.isArray(p.images) &&
            p.images.filter(Boolean).map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                style={{
                  width: 80,
                  marginRight: 8,
                  borderRadius: 6,
                }}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ))}

          <br />
          <button onClick={() => deleteProject(p.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

