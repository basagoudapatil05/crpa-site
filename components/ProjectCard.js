export default function ProjectCard({ project }) {
  const images = Array.isArray(project.images) ? project.images : [];

  return (
    <div style={{ border: "1px solid #333", padding: 10 }}>
      <h3>{project.title}</h3>
      <p>{project.location}</p>

      <div style={{ display: "flex", gap: 10 }}>
        {images.length === 0 && <p>No images</p>}

        {images.map((img, i) => (
          img?.startsWith("http") && (
            <img
              key={i}
              src={img}
              alt=""
              style={{ width: 150, height: 100, objectFit: "cover" }}
              onError={(e) => (e.target.style.display = "none")}
            />
          )
        ))}
      </div>
    </div>
  );
}

