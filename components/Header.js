import Link from 'next/link'
export default function Header(){ 
  return (
    <header className="container header">
      <div className="logo">
        <img src="/images/CIVIL.jpg" alt="logo"/>
        <div>
          <div className="tag">CONSULTING CIVIL ENGINEERS & CONTRACTORS</div>
          <div style={{fontSize:14,color:'var(--muted)'}}>Structure. <span style={{color:'var(--accent)'}}>Craft.</span> Assurance.</div>
        </div>
      </div>
      <nav style={{display:'flex',gap:14,alignItems:'center'}}>
        <a href="#contact" style={{color:'var(--muted)'}}>Contact</a>
        <a href="https://instagram.com/crpa1989" target="_blank" rel="noreferrer" style={{color:'var(--muted)'}}>@crpa1989</a>
      </nav>
    </header>
  )
}