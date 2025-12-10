import { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetch("/api/projects/list")
      .then((res) => res.json())
      .then(setProjects);
  }, []);

  const categories = [
    { key: "residence", label: "Residential Projects" },
    { key: "hotel", label: "Hotel Projects" },
    { key: "school", label: "School Projects" },
    { key: "temple", label: "Temple Projects" },
    { key: "commercial", label: "Commercial Projects" },
    { key: "farmhouse", label: "Farmhouse Projects" },
    { key: "office", label: "Office Projects" },
  ];

  const statuses = [
    { key: "ongoing", label: "Ongoing Projects" },
    { key: "completed", label: "Completed Projects" },
    { key: "upcoming", label: "Upcoming Projects" },
  ];

  return (
    <div style={{ padding: 40 }}>
      <h1>Our Projects</h1>

      {categories.map((cat) => (
        <section key={cat.key} style={{ marginBottom: 50 }}>
          <h2>{cat.label}</h2>

          {statuses.map((stat) => {
            const filtered = projects.filter(
              (p) => p.category === cat.key && p.status === stat.key
            );

            if (filtered.length === 0) return null;

            return (
              <div key={stat.key} style={{ marginTop: 20 }}>
                <h3>{stat.label}</h3>

                <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
                  {filtered.map((p) => (
                    <ProjectCard key={p.id} p={p} />
                  ))}
                </div>
              </div>
            );
          })}
        </section>
      ))}
    </div>
  );
}
