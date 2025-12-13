"use client";

import React from "react";
import ProjectCard from "../components/ProjectCard";

export default function ResidenceProjects() {
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/projects/list")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data.filter((p) => p.category === "residence"));
      });
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Residential Projects</h1>

      {projects.length === 0 && <p>No residential projects found.</p>}

      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
