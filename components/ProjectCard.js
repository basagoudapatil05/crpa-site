export default function ProjectCard({ project }) {
  return (
    <div style={{
      background: "#161a1f",
      padding: 15,
      borderRadius: 10,
      marginBottom: 20
    }}>
      
      {/* IMAGE PREVIEW */}
      {Array.isArray(project.images) &&
  project.images
    .filter(Boolean)
    .map((img, i) => (
      <img
        key={i}
        src={img}
        alt=""
        style={{ width: "100%", borderRadius: 8 }}
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
))}
    alt="Preview"
    style={{ width: "100%", borderRadius: 6 }}
  />
)}

      <h3>{project.title}</h3>
      <p>{project.location}</p>
      <p>{project.status}</p>
      <p>Category: {project.category}</p>
    </div>
  );
}


