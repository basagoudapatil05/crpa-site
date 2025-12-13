import React from "react";

export default function ProjectCard({ project }) {
  if (!project) return null;

  const images = Array.isArray(project.images)
    ? project.images.filter(Boolean)
    : [];

  return (
    <div
      style={{
        background: "#111",
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        border: "1px solid #222",
      }}
    >
      <h3 style={{ marginBottom: 6 }}>{project.title}</h3>

      <p style={{ opacity: 0.8 }}>
        {project.location} • {project.status}
      </p>

      {/* IMAGES (SAFE) */}
      {images.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 12,
            flexWrap: "wrap",
          }}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt=""
              style={{
                width: 140,
                height: 100,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #333",
              }}
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          ))}
        </div>
      )}

      {images.length === 0 && (
        <p style={{ opacity: 0.5, marginTop: 10 }}>
          No images available
        </p>
      )}
    </div>
  );
}


