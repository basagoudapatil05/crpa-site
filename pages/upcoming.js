import Head from "next/head";
import Header from "../components/Header";
import { useState } from "react";
import ProjectCard from "../components/ProjectCard";

// -------------------------------
// 6 UPCOMING PROJECTS
// Replace images later using admin panel
// -------------------------------

const upcoming = [
  {
    id: 101,
    name: "Greenline Corporate Park",
    location: "Dharwad",
    images: ["/images/1001.jpg"],
    scope: "Commercial Complex",
    status: "Upcoming",
  },
  {
    id: 102,
    name: "Luxury Villa – Phase 2",
    location: "Belagavi",
    images: ["/images/IMG_4157.jpg"],
    scope: "Premium Residence",
    status: "Upcoming",
  },
  {
    id: 103,
    name: "Temple Extension – Block C",
    location: "Dharwad",
    images: ["/images/CR PATIL DR TEKKALAKI FIRST FLOOR RENDER BATCH 1 V3.jpg"],
    scope: "Institutional",
    status: "Upcoming",
  },
  {
    id: 104,
    name: "Residential Layout Development",
    location: "Hubballi",
    images: ["/images/1000.jpg"],
    scope: "Planning + Execution",
    status: "Upcoming",
  },
  {
    id: 105,
    name: "Commercial Office Interiors",
    location: "Belagavi",
    images: ["/images/PHOTO-2025-08-05-12-55-50 (2).jpg"],
    scope: "Turnkey Interiors",
    status: "Upcoming",
  },
  {
    id: 106,
    name: "Institutional Block – Phase 2",
    location: "Dharwad",
    images: ["/images/CBSC SCHOOL [6875]_2024-04-10.jpg"],
    scope: "Institutional",
    status: "Upcoming",
  },
];

export default function UpcomingProjects() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <Head>
        <title>Upcoming Projects • C. R. Patil & Associates</title>
      </Head>

      <Header />

      <main className="container" style={{ paddingTop: 20 }}>
        <h2 style={{ marginBottom: 12 }}>Upcoming Projects (6 Listed)</h2>
        <div className="grid">
          {upcoming.map((p) => (
            <ProjectCard key={p.id} p={p} onOpen={(img) => setLightbox(img)} />
          ))}
        </div>
      </main>

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
