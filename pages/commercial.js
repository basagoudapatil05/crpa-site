"use client";

import React from "react";
import ProjectCard from "../components/ProjectCard";

export default function CommercialProjects() {
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/projects/list")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data.filter((p) => p.category === "commercial"));
      });
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Commercial Projects</h1>

      {projects.length === 0 && <p>No commercial projects found.</p>}

      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
