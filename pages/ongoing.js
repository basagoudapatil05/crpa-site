import ProjectCard from "../components/ProjectCard";

export default function OngoingProjects() {
  const [projects, setProjects] = React.useState([]);

  React.useEffect(() => {
    fetch("/api/projects/list")
      .then((r) => r.json())
      .then((data) => {
        setProjects(data.filter((p) => p.status === "ongoing"));
      });
  }, []);

  return (
    <div style={{ padding: 30 }}>
      <h1>Ongoing Projects</h1>

      {projects.length === 0 && <p>No projects found</p>}

      {projects.map((p) => (
        <ProjectCard key={p.id} project={p} />
      ))}
    </div>
  );
}

