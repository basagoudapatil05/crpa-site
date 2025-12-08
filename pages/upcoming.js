import Head from "next/head";
import Header from "../components/Header";
import ProjectCard from "../components/ProjectCard";
import { useEffect, useState } from "react";

export default function UpcomingProjects() {
  const [projects, setProjects] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch("/api/projects/list?status=upcoming")
      .then((r) => r.json())
      .then((data) => setProjects(data));
  }, []);

  // Replace with your Supabase project ID
  const SUPABASE_ID = "asxnupuwsoxxnecihhcb";

  return (
    <>
      <Head>
        <title>Upcoming Projects • C. R. Patil & Associates</title>
      </Head>

      <Header />

      <main className="container" style={{ paddingTop: 20 }}>
        <h2>Upcoming Projects</h2>

        <div className="grid">
          {projects.map((p) => {
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
