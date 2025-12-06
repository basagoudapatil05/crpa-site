import Head from 'next/head'
import Header from '../components/Header'
import ProjectCard from '../components/ProjectCard'
import { useState } from 'react'

/*
  IMPORTANT: below is the demo data that uses your real image filenames.
  If any filename in public/images differs, change the string to match it exactly.
*/

const demo = {
  ongoing:[
    { id: 1, name: 'Temple Project', location: 'Dharwad', images: ['/images/CR PATIL DR TEKKALAKI FIRST FLOOR RENDER BATCH 1 V4.jpg'], scope: 'Institutional', status:'Ongoing' },
    { id: 2, name: 'Modern Bungalow A', location: 'Belagavi', images: ['/images/IMG_4157.jpg'], scope:'Turnkey', status:'Ongoing' },
    // add more up to 14 - duplicate pattern if needed
  ],
  upcoming:[
    { id: 101, name: 'Greenline Corporate Park', location: 'Dharwad', images: ['/images/1001.jpg'], scope: 'Commercial', status:'Upcoming' },
    // add up to 6
  ],
  completed:[
    { id: 201, name: 'Premium Residence #1', location: 'Belagavi', images: ['/images/PHOTO-2025-08-05-12-55-50 (2).jpg'], scope: 'Design + Build', status:'Completed' },
    // only a few seed examples — full gallery page will show counts & filters
  ]
}

export default function Home(){
  const [section, setSection] = useState(null)
  const [lightbox, setLightbox] = useState(null)

  return (
    <div>
      <Head>
        <title>C. R. Patil & Associates — Consulting Civil Engineers & Contractors</title>
        <meta name="description" content="Trusted civil engineering & construction firm in Belagavi. Turnkey homes, premium interiors, and institutional projects since 1989."/>
        <meta property="og:title" content="C. R. Patil & Associates — Structure. Craft. Assurance."/>
      </Head>

      <link rel="stylesheet" href="/styles/globals.css" />
      <Header/>

      <main className="container">
        <section className="hero">
          <div className="hero-left">
            <h1 className="h1">Bespoke Construction, Engineered to Endure.</h1>
            <p style={{color:'var(--muted)'}}>Crafting homes, creating legacies since 1989.</p>
            <div className="chips">
              {['Belagavi','Hubballi','Dharwad','and beyond'].map(c=> <div className="chip" key={c}>{c}</div>)}
            </div>
            <div style={{marginTop:18,display:'flex',gap:10}}>
              <button onClick={()=>setSection('ongoing')} className="card">View Ongoing</button>
              <button onClick={()=>setSection('completed')} className="card">1100+ Completed</button>
            </div>
          </div>

          <div style={{width:420}}>
            <div className="card"><img src="/images/1001.jpg" style={{width:'100%',borderRadius:10}} alt="showcase"/></div>
            <div style={{marginTop:8,textAlign:'right'}} className="card"><strong>1200+</strong> Projects Delivered</div>
          </div>
        </section>

        <section style={{marginTop:28}}>
          <div style={{color:'var(--muted)'}}>Swipe/scroll sideways ↓</div>
          <div className="slider">
            {['ongoing','upcoming','completed'].map(key=>(
              <div className="section-card" key={key}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <h3 style={{margin:0,textTransform:'capitalize'}}>{key}</h3>
                  <button onClick={()=>setSection(key)} className="card">Enter</button>
                </div>
                <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8,marginTop:12}}>
                  {(demo[key]||[]).slice(0,3).map(p=>(
                    <div key={p.id} style={{aspectRatio:'1/1',overflow:'hidden',borderRadius:8}}>
                      <img src={p.images[0]} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {section && (
          <section style={{marginTop:18}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <h2 style={{textTransform:'capitalize'}}>{section} Projects</h2>
              <button onClick={()=>setSection(null)} className="card">Close</button>
            </div>
            <div className="grid" style={{marginTop:12}}>
              {(demo[section]||[]).map(p=>(
                <ProjectCard key={p.id} p={p} onOpen={(img)=>setLightbox(img)}/>
              ))}
            </div>
          </section>
        )}

        <section id="contact" className="contact">
          <div className="card">
            <h3>Contact Us</h3>
            <p style={{color:'var(--muted)'}}>Tell us about your project. We usually respond the same day.</p>
            <form onSubmit={(e)=>{e.preventDefault(); const f=e.currentTarget; const name=f.name.value; const contact=f.contact.value; const brief=f.brief.value; window.open(`mailto:crpatil99@yahoo.in?subject=${encodeURIComponent('New enquiry')}&body=${encodeURIComponent(`Name:${name}\\nContact:${contact}\\nBrief:${brief}`)}`); window.open(`https://wa.me/919449143297?text=${encodeURIComponent(`Hello, I am ${name}. ${brief} (My contact: ${contact})`)}`)}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
                <input name="name" placeholder="Your Name" required style={{padding:8,borderRadius:6,background:'transparent',border:'1px solid rgba(255,255,255,0.06)',color:'var(--text)'}}/>
                <input name="contact" placeholder="Phone or Email" required style={{padding:8,borderRadius:6,background:'transparent',border:'1px solid rgba(255,255,255,0.06)',color:'var(--text)'}}/>
              </div>
              <textarea name="brief" placeholder="Project brief" style={{width:'100%',minHeight:120,marginTop:8,padding:8,borderRadius:6,background:'transparent',border:'1px solid rgba(255,255,255,0.06)',color:'var(--text)'}}></textarea>
              <div style={{display:'flex',gap:10,marginTop:12}}>
                <button type="submit" className="card">Send Inquiry</button>
                <a className="whatsapp" href="https://wa.me/919449143297" target="_blank" rel="noreferrer">WhatsApp</a>
              </div>
            </form>
          </div>
        </section>

        <footer className="footer">© {new Date().getFullYear()} C. R. Patil & Associates — Consulting Civil Engineers & Contractors · crpatilandassociates.com • +91 94491 43297 • crpatil99@yahoo.in</footer>
      </main>

      {lightbox && (
        <div className="lightbox-backdrop" onClick={()=>setLightbox(null)}>
          <img className="lightbox-img" src={lightbox} alt="enlarged"/>
        </div>
      )}
    </div>
  )
}
