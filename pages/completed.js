import Head from "next/head";
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import { useEffect, useState } from "react";

export default function CompletedProjects() {
  const [projects, setProjects] = useState([]);
  const [lightbox, setLightbox] = useState(null);
  const [filter, setFilter] = useState("All");

  // Replace with your Supabase ID
  const SUPABASE_ID = "asxnupuwsoxxnecihhcb";

  // Load all completed projects
  useEffect(() => {
    fetch("/api/projects/list?status=completed")
      .then((r) => r.json())
      .then((data) => setProjects(data));
  }, []);

  // Filter by type
  const filtered =
    filter === "All"
      ? projects
      : projects.filter((p) => p.scope?.toLowerCase().includes(filter.toLowerCase()));

  return (
    <>
      <Head>
        <title>Completed Projects • C. R. Patil & Associates</title>
      </Head>

      <Header />

      <main className="container" style={{ paddingTop: 20 }}>
        <h2>Completed Projects</h2>
        <p style={{ opacity: 0.7 }}>
          Over <b>1200+ Residential</b> and <b>200+ Commercial</b> structures delivered across Karnataka.
        </p>

        {/* FILTER BUTTONS */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {["All", "Residential", "Commercial", "Institutional"].map((btn) => (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              style={{
                padding: "6px 14px",
                borderRadius: 6,
                border: "1px solid #333",
                background: filter === btn ? "#1e4fbf" : "#161a1f",
                color: filter === btn ? "#fff" : "#ccc",
              }}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* PROJECT GRID */}
        <div className="grid">
          {filtered.map((p) => {
            const firstImage = p.images?.length
              ? `https://${SUPABASE_ID}.supabase.co/storage/v1/object/public/project-images/${p.images[0]}`
              : "/images/placeholder.jpg";

            return (
              <ProjectCard
                key={p.id}
                p={{ ...p, images: [firstImage] }}
                onOpen={() => setLightbox(firstImage)}
              />
            );
          })}
        </div>
      </main>

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          className="lightbox-backdrop"
          onClick={() => setLightbox(null)}
        >
          <img className="lightbox-img" src={lightbox} />
        </div>
      )}
    </>
  );
}

