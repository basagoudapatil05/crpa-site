export default function ProjectCard({ project }) {
  // ✅ SAFE IMAGE HANDLING
  let imageUrl = "/placeholder.jpg";

  if (
    Array.isArray(project.images) &&
    project.images.length > 0 &&
    typeof project.images[0] === "string"
  ) {
    imageUrl = project.images[0];
  }

  return (
    <div className="project-card">
      <img
        src={imageUrl}
        alt={project.title || "Project"}
        onError={(e) => (e.target.src = "/placeholder.jpg")}
      />

      <h3>{project.title}</h3>
      <p>{project.location}</p>
      <p>{project.status}</p>
    </div>
  );
}
