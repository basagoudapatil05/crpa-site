"use client";

import React from "react";
import ProjectCard from "../components/ProjectCard";

export default function CompletedProjects() {
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/projects/list")
      .then((r) => r.json())
      .then((data) => {
        // Show only completed projects
        setProjects(data.filter((p) => p.status === "completed"));
      });
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Completed Projects</h1>

      {projects.length === 0 && <p>No projects found</p>}

      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}

