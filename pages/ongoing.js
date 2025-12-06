import Head from "next/head";
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import { useState } from "react";

const ongoing = [
  {
    id: 1,
    name: "Hillcrest Villas",
    location: "Belagavi",
    images: ["/images/PHOTO-2025-08-05-12-55-50 (2).jpg"],
    scope: "Structure + Finishes",
  },
  {
    id: 2,
    name: "KR Residency Tower",
    location: "Hubli",
    images: ["/images/1000.jpg"],
    scope: "Turnkey Project",
  },
  {
    id: 3,
    name: "Greenline Corporate Park",
    location: "Dharwad",
    images: ["/images/R.M.Bailappanaver [6916] FINAL_2024-05-28 (1).jpg"],
    scope: "Commercial Complex",
  },
  {
    id: 4,
    name: "Institutional Block Phase 1",
    location: "Dharwad",
    images: ["/images/CBSC SCHOOL [6875]_2024-04-10.jpg"],
    scope: "Institutional",
  },
];

export default function OngoingProjects() {
  const [lightbox, setLightbox] = useState(null);

  return (
    <>
      <Head>
        <title>Ongoing Projects • C. R. Patil & Associates</title>
      </Head>

      <Header />

      <main className="container" style={{ paddingTop: 20 }}>
        <h2>Ongoing Projects</h2>

        <div className="grid">
          {ongoing.map((p) => (
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
