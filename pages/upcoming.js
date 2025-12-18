import React, { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectCard";
import { supabase } from "../lib/supabase";

export default function Upcoming() {
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("status", "upcoming")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setProjects(data);
    }
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Upcoming Projects</h1>

      {projects.length === 0 && <p>No upcoming projects found.</p>}

      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
