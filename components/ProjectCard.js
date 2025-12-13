export default function ProjectCard({ project }) {
  return (
    <div style={{
      background: "#161a1f",
      padding: 15,
      borderRadius: 10,
      marginBottom: 20
    }}>
      
      {/* IMAGE PREVIEW */}
      {project.images && project.images.length > 0 && (
        <img
          src={project.images[0]}
          style={{
            width: "100%",
            height: 250,
            objectFit: "cover",
            borderRadius: 10,
            marginBottom: 10
          }}
        />
      )}

      <h3>{project.title}</h3>
      <p>{project.location}</p>
      <p>{project.status}</p>
      <p>Category: {project.category}</p>
    </div>
  );
}


