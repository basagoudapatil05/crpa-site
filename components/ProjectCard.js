export default function ProjectCard({ project }) {
  // SAFE image handling
  const imageUrl =
    Array.isArray(project.images) && project.images.length > 0
      ? project.images[0]
      : null;

  return (
    <div
      style={{
        border: "1px solid #333",
        borderRadius: 8,
        overflow: "hidden",
        background: "#111",
      }}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={project.title}
          style={{ width: "100%", height: 200, objectFit: "cover" }}
          onError={(e) => (e.target.style.display = "none")}
        />
      )}

      <div style={{ padding: 15 }}>
        <h3>{project.title}</h3>
        <p>{project.location}</p>
        <p>{project.scope}</p>
      </div>
    </div>
  );
}

