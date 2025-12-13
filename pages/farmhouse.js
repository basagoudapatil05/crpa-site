"use client";

import React from "react";
import ProjectCard from "../components/ProjectCard";

export default function FarmhouseProjects() {
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/projects/list")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data.filter((p) => p.category === "farmhouse"));
      });
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Farmhouse Projects</h1>

      {projects.length === 0 && <p>No farmhouse projects found.</p>}

      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
