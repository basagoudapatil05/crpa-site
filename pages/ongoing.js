import { useState, useEffect } from "react";
import Header from "../components/Header";

export default function OngoingProjects() {
  const [projects, setProjects] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  async function loadProjects() {
    const res = await fetch("/api/projects/list").then((r) => r.json());
    const filtered = res.filter((p) => p.status === "ongoing");
    setProjects(filtered);
  }

  useEffect(() => {
    loadProjects();
  }, []);

  return (
    <>
      <Header />
      <main style={{ padding: 30, color: "#fff" }}>
        <h1>Ongoing Projects</h1>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 20,
            marginTop: 20,
          }}
        >
          {projects.map((p) => (
            <div
              key={p.id}
              style={{
                background: "#161a1f",
                padding: 15,
                borderRadius: 8,
                border: "1px solid #262b32",
              }}
            >
              {p.featured_image && (
                <img
                  src={p.featured_image}
                  style={{
                    width: "100%",
                    height: 180,
                    objectFit: "cover",
                    borderRadius: 8,
                    cursor: "pointer",
                  }}
                  onClick={() => setLightbox(p.featured_image)}
                />
              )}

              <h3 style={{ marginTop: 10 }}>{p.title}</h3>
              <p style={{ opacity: 0.7 }}>{p.location}</p>
              <p style={{ fontSize: 14, color: "#9ca3af" }}>{p.scope}</p>
            </div>
          ))}
        </div>
      </main>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
          }}
        >
          <img
            src={lightbox}
            style={{ maxWidth: "90%", maxHeight: "90%", borderRadius: 8 }}
          />
        </div>
      )}
    </>
  );
}

