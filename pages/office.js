"use client";

import React from "react";
import ProjectCard from "../components/ProjectCard";

export default function OfficeProjects() {
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/projects/list")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data.filter((p) => p.category === "office"));
      });
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Office Projects</h1>

      {projects.length === 0 && <p>No office projects found.</p>}

      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
