export default function ProjectCard({ project }) {
  const images = Array.isArray(project.images) ? project.images : [];

  return (
    <div className="project-card">
      <h3>{project.title}</h3>
      <p>
        {project.location} • {project.status}
      </p>

      <div style={{ display: "flex", gap: 10 }}>
        {images.length === 0 && (
          <div className="img-placeholder">No Image</div>
        )}

        {images.map((url, i) => (
          <img
            key={i}
            src={url}
            alt=""
            style={{ width: 120, height: 120, objectFit: "cover" }}
            onError={(e) => (e.target.style.display = "none")}
          />
        ))}
      </div>
    </div>
  );
}

