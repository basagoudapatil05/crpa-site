import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";
import ProjectCard from "../components/ProjectCard";

// ------------------------------------
// COMPLETED PROJECTS LIST (sample only)
// YOU WILL UPDATE LATER THROUGH ADMIN
// ------------------------------------
const completed = [
  {
    id: 201,
    name: "Premium Residence – Belagavi",
    location: "Belagavi",
    type: "Residential",
    images: ["/images/PHOTO-2025-08-05-12-55-50 (2).jpg"],
    scope: "Design + Build",
  },
  {
    id: 202,
    name: "Institutional Block – Hubli",
    location: "Hubli",
    type: "Institutional",
    images: ["/images/CBSC SCHOOL [6875]_2024-04-10.jpg"],
    scope: "Institutional",
  },
  {
    id: 203,
    name: "Commercial Outlet – Dharwad",
    location: "Dharwad",
    type: "Commercial",
    images: ["/images/1000.jpg"],
    scope: "Commercial Structure",
  },
  {
    id: 204,
    name: "Modern Villa – Belagavi",
    location: "Belagavi",
    type: "Residential",
    images: ["/images/IMG_4157.jpg"],
    scope: "Turnkey Residence",
  },
];

export default function CompletedProjects() {
  const [filter, setFilter] = useState("All");
  const [lightbox, setLightbox] = useState(null);

  // Filter logic
  const filtered =
    filter === "All"
      ? completed
      : completed.filter((p) => p.type === filter);

  return (
    <>
      <Head>
        <title>Completed Projects • C. R. Patil & Associates</title>
      </Head>

      <Header />

      <main className="container" style={{ paddingTop: 20 }}>
        <h2>Completed Projects</h2>
        <p style={{ color: "var(--muted)", marginBottom: 20 }}>
          Over <b>1200+ Residential</b> and <b>200+ Commercial</b> projects completed across Karnataka in 30+ years.
        </p>

        {/* Filter Buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 20 }}>
          {["All", "Residential", "Commercial", "Institutional"].map((btn) => (
            <button
              key={btn}
              onClick={() => setFilter(btn)}
              className="card"
              style={{
                background: filter === btn ? "var(--accent)" : "var(--card)",
                color: filter === btn ? "white" : "var(--text)",
              }}
            >
              {btn}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid">
          {filtered.map((p) => (
            <ProjectCard
              key={p.id}
              p={p}
              onOpen={(img) => setLightbox(img)}
            />
          ))}
        </div>
      </main>

      {/* Lightbox */}
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

