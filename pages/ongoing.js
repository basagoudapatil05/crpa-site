import Head from "next/head";
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import { useEffect, useState } from "react";

export default function OngoingProjects() {
  const [projects, setProjects] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  // Load from API
  useEffect(() => {
    fetch("/api/projects/list?status=ongoing")
      .then((r) => r.json())
      .then((data) => setProjects(data));
  }, []);

  return (
    <>
      <Head>
        <title>Ongoing Projects • C. R. Patil & Associates</title>
      </Head>

      <Header />

      <main className="container" style={{ paddingTop: 20 }}>
        <h2>Ongoing Projects</h2>

        <div className="grid">
          {projects.map((p) => {
            const firstImage =
              p.images?.length > 0
                ? `https://YOUR_PROJECT_ID.supabase.co/storage/v1/object/public/project-images/${p.images[0]}`
                : "/images/placeholder.jpg";

            return (
              <ProjectCard
                key={p.id}
                p={{ ...p, images: [firstImage] }}
                onOpen={(img) => setLightbox(img)}
              />
            );
          })}
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
