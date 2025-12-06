import Head from 'next/head'
import Header from '../components/Header'
import { useState } from 'react'

const allCompleted = [
  // A few seed examples; later you will upload all your completed projects into /public/images and add entries here or via admin.
  {id:1,name:'Premium Residence 1',location:'Belagavi',images:['/images/PHOTO-2025-08-05-12-55-50 (2).jpg'],type:'Residential'},
  {id:2,name:'CBSE School',location:'Dharwad',images:['/images/CBSC SCHOOL [6875]_2024-04-10.jpg'],type:'Institutional'}
]

export default function Completed(){
  const [filter, setFilter] = useState('All')
  const list = filter==='All' ? allCompleted : allCompleted.filter(p=>p.type===filter)
  return (
    <div>
      <Head><title>Completed Projects • C R Patil & Associates</title></Head>
      <link rel="stylesheet" href="/styles/globals.css" />
      <Header/>
      <main className="container" style={{paddingTop:20}}>
        <h2>Completed Projects • 1200+ Residential • 200+ Commercial</h2>
        <div style={{display:'flex',gap:8,marginTop:12}}>
          {['All','Residential','Commercial','Institutional'].map(f=>(
            <button key={f} onClick={()=>setFilter(f)} className="card" style={{background: filter===f ? 'var(--accent)':undefined}}>{f}</button>
          ))}
        </div>

        <div className="grid" style={{marginTop:16}}>
          {list.map(p=>(
            <div className="project-card" key={p.id}>
              <img src={p.images[0]} alt={p.name}/>
              <div className="project-meta">
                <div style={{fontWeight:700}}>{p.name}</div>
                <div style={{fontSize:13,color:'var(--muted)',marginTop:6}}>{p.location} • {p.type}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
