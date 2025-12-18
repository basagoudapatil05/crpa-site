export default function ProjectCard({ project }) {
  // SAFETY: normalize images
  const images = Array.isArray(project?.images)
    ? project.images.filter(
        (url) =>
          typeof url === "string" &&
          url.startsWith("http") &&
          url.length > 10
      )
    : [];

  const imageUrl = images.length > 0 ? images[0] : null;

  return (
    <div className="project-card">
      {imageUrl ? (
        <img
          src={imageUrl}
          alt={project.title}
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ) : (
        <div className="image-placeholder">No Image</div>
      )}

      <h3>{project.title}</h3>
      <p>{project.location}</p>
      <p>{project.scope}</p>
    </div>
  );
}
