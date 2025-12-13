"use client";

import React from "react";
import ProjectCard from "../components/ProjectCard";

export default function HotelProjects() {
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/projects/list")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data.filter((p) => p.category === "hotel"));
      });
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Hotel Projects</h1>

      {projects.length === 0 && <p>No hotel projects found.</p>}

      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}
