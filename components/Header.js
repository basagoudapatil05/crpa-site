import Link from 'next/link'

export default function Header(){
  return (
    <header className="container header">
      <div className="logo">
        {/* Update your logo file here if needed */}
        <img src="/images/CIVIL.jpg" alt="CRPA Logo"/>
        <div>
          <div className="tag">CONSULTING CIVIL ENGINEERS & CONTRACTORS</div>
          <div style={{fontSize:14,color:'var(--muted)'}}>Structure. <span style={{color:'var(--accent)'}}>Craft.</span> Assurance.</div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{display:'flex',alignItems:'center',gap:20}}>
        <Link href="/ongoing" style={{color:'var(--muted)'}}>Ongoing</Link>
        <Link href="/upcoming" style={{color:'var(--muted)'}}>Upcoming</Link>
        <Link href="/completed" style={{color:'var(--muted)'}}>Completed</Link>
        <a href="#contact" style={{color:'var(--muted)'}}>Contact</a>
      </nav>
    </header>
  )
}
