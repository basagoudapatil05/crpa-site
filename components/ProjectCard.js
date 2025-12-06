export default function ProjectCard({p, onOpen}) {
  return (
    <div className="project-card">
      <img src={p.images[0]} alt={p.name}/>
      <div className="project-meta">
        <div style={{fontWeight:700}}>{p.name}</div>
        <div style={{fontSize:12,letterSpacing:1,color:'var(--muted)',marginTop:6}}>{p.status?.toUpperCase()}</div>
        <div style={{fontSize:13,color:'var(--muted)',marginTop:8}}>{p.location} • {p.scope}</div>
        <div style={{display:'flex',gap:8,marginTop:10}}>
          {p.images.slice(0,4).map((img,i)=>(
            <button key={i} onClick={()=>onOpen(img)} style={{width:44,height:44,borderRadius:6,overflow:'hidden',border:'1px solid rgba(255,255,255,0.06)'}}>
              <img src={img} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
