// --- File: components/ProjectCard.js ---
import React from 'react';

export default function ProjectCard({ project, onOpen }) {
  // project.images is expected to be an array (strings)
  const image = (project.images && project.images.length && project.images[0]) || null;

  return (
    <div className="project-card" style={{ background: '#0f1114', border: '1px solid #222', borderRadius: 8, padding: 12 }}>
      {image ? (
        <img
          src={image}
          alt={project.title}
          style={{ width: '100%', height: 160, objectFit: 'cover', borderRadius: 6, cursor: 'pointer' }}
          onClick={() => onOpen(image)}
        />
      ) : (
        <div style={{ width: '100%', height: 160, borderRadius: 6, background: '#151718', display: 'grid', placeItems: 'center', color: '#888' }}>
          No image
        </div>
      )}

      <h3 style={{ margin: '10px 0 6px', color: '#fff' }}>{project.title}</h3>
      <div style={{ color: '#bfc7cd', fontSize: 14 }}>{project.location} • {project.scope}</div>
      <div style={{ marginTop: 8 }}>
        <span style={{ padding: '6px 8px', background: '#1e4fbf', color: '#fff', borderRadius: 6, fontSize: 12 }}>{project.status}</span>
      </div>
    </div>
  );
}


// --- File: pages/ongoing.js ---
import Head from 'next/head';
import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';

export default function Ongoing() {
  const [projects, setProjects] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch('/api/projects/list')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProjects(data.filter(p => p.status === 'ongoing'));
      });
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', color: '#fff', background: '#0f1114', minHeight: '100vh' }}>
      <Head>
        <title>Ongoing Projects • C. R. Patil & Associates</title>
      </Head>

      <header style={{ maxWidth: 1100, margin: '0 auto 28px' }}>
        <h1 style={{ margin: 0 }}>Ongoing Projects</h1>
        <p style={{ opacity: 0.7 }}>Work in progress — delivered by C R Patil & Associates.</p>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto' }}>
        {projects.length === 0 ? (
          <p>No ongoing projects yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} onOpen={(img) => setLightbox(img)} />
            ))}
          </div>
        )}
      </main>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'grid', placeItems: 'center', zIndex: 60 }}>
          <img src={lightbox} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
}


// --- File: pages/upcoming.js ---
import Head from 'next/head';
import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';

export default function Upcoming() {
  const [projects, setProjects] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch('/api/projects/list')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProjects(data.filter(p => p.status === 'upcoming'));
      });
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', color: '#fff', background: '#0f1114', minHeight: '100vh' }}>
      <Head>
        <title>Upcoming Projects • C. R. Patil & Associates</title>
      </Head>

      <header style={{ maxWidth: 1100, margin: '0 auto 28px' }}>
        <h1 style={{ margin: 0 }}>Upcoming Projects</h1>
        <p style={{ opacity: 0.7 }}>Planned projects coming soon.</p>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto' }}>
        {projects.length === 0 ? (
          <p>No upcoming projects yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} onOpen={(img) => setLightbox(img)} />
            ))}
          </div>
        )}
      </main>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'grid', placeItems: 'center', zIndex: 60 }}>
          <img src={lightbox} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
}


// --- File: pages/completed.js ---
import Head from 'next/head';
import { useEffect, useState } from 'react';
import ProjectCard from '../components/ProjectCard';

export default function Completed() {
  const [projects, setProjects] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    fetch('/api/projects/list')
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) setProjects(data.filter(p => p.status === 'completed'));
      });
  }, []);

  return (
    <div style={{ padding: 24, fontFamily: 'Inter, Arial, sans-serif', color: '#fff', background: '#0f1114', minHeight: '100vh' }}>
      <Head>
        <title>Completed Projects • C. R. Patil & Associates</title>
      </Head>

      <header style={{ maxWidth: 1100, margin: '0 auto 28px' }}>
        <h1 style={{ margin: 0 }}>Completed Projects</h1>
        <p style={{ opacity: 0.7 }}>Our portfolio — projects delivered with quality and assurance.</p>
      </header>

      <main style={{ maxWidth: 1100, margin: '0 auto' }}>
        {projects.length === 0 ? (
          <p>No completed projects yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
            {projects.map(p => (
              <ProjectCard key={p.id} project={p} onOpen={(img) => setLightbox(img)} />
            ))}
          </div>
        )}
      </main>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'grid', placeItems: 'center', zIndex: 60 }}>
          <img src={lightbox} style={{ maxWidth: '90%', maxHeight: '90%', borderRadius: 8 }} />
        </div>
      )}
    </div>
  );
}


// --- End of files ---

/*
Instructions:
1) Create a new file components/ProjectCard.js and paste the ProjectCard code.
2) Create pages/ongoing.js, pages/upcoming.js, pages/completed.js and paste corresponding code blocks.
3) These pages fetch data from /api/projects/list and filter by `status`.
4) Make sure your projects table `images` column is text[] and that your /api/upload-url returns a `path` (see earlier message).
5) Commit, push, and Vercel will redeploy.
*/
