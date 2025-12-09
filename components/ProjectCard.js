// components/ProjectCard.js
import { useState } from "react";

export default function ProjectCard({ p }) {
  const [lightbox, setLightbox] = useState(null);

  return (
    <div
      style={{
        padding: 16,
        borderRadius: 8,
        background: "#161a1f",
        border: "1px solid #2d3239",
        marginBottom: 20,
        color: "#fff",
      }}
    >
      {/* IMAGE (if exists) */}
      {p.images && p.images.length > 0 && (
        <img
          src={p.images[0]}
          alt={p.title}
          style={{
            width: "100%",
            height: 220,
            objectFit: "cover",
            borderRadius: 6,
            cursor: "pointer",
            marginBottom: 12,
          }}
          onClick={() => setLightbox(p.images[0])}
        />
      )}

      {/* TITLE */}
      <h3 style={{ margin: 0, fontSize: 20 }}>{p.title}</h3>

      {/* LOCATION + STATUS */}
      <p style={{ opacity: 0.7, margin: "6px 0" }}>
        {p.location} • {p.status}
      </p>

      {/* SCOPE */}
      {p.scope && (
        <p style={{ margin: "6px 0", opacity: 0.8 }}>
          Scope: {p.scope}
        </p>
      )}

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.85)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
        >
          <img
            src={lightbox}
            style={{
              maxWidth: "90%",
              maxHeight: "90%",
              borderRadius: 8,
            }}
          />
        </div>
      )}
    </div>
  );
}

