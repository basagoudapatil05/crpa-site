export default function ProjectCard({ project }) {
  const images = Array.isArray(project.images) ? project.images : [];

  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>{project.location}</p>

      {images.length > 0 ? (
        <img
          src={images[0]}
          alt={project.title}
          onError={(e) => (e.target.style.display = "none")}
          style={{ width: "100%", maxWidth: 300 }}
        />
      ) : (
        <div style={{ opacity: 0.5 }}>No image</div>
      )}
    </div>
  );
}
