import { useEffect, useState } from 'react';
import SEO from '../../components/SEO';
import { api } from '../../lib/api';
import '../shared/Page.css';

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [filter, setFilter] = useState('All');
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    api('/gallery').then(setImages).catch(() => {});
  }, []);

  const categories = ['All', ...Array.from(new Set(images.map((i) => i.category).filter(Boolean)))];
  const filtered = filter === 'All' ? images : images.filter((i) => i.category === filter);

  function openAt(index) {
    setLightbox(index);
  }

  function prev() {
    setLightbox((i) => (i === null ? null : (i - 1 + filtered.length) % filtered.length));
  }

  function next() {
    setLightbox((i) => (i === null ? null : (i + 1) % filtered.length));
  }

  useEffect(() => {
    if (lightbox === null) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  return (
    <div className="page">
      <SEO
        title="Gallery"
        description="Event decoration and styling gallery — Cupcake Dreams Events, Port Glasgow."
        path="/gallery"
      />
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Gallery</p>
          <h1>Inspired by Beautiful Details</h1>
          <p className="section-lead">
            Images are managed by URL in the admin dashboard. Demo photos can be replaced anytime.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="filter-row">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                className={`filter-btn ${filter === c ? 'active' : ''}`}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="masonry">
            {filtered.map((img, index) => (
              <button
                key={img._id}
                type="button"
                className="masonry-item"
                onClick={() => openAt(index)}
              >
                <img src={img.imageUrl} alt={img.title || 'Event gallery image'} loading="lazy" />
                <span>{img.title}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {lightbox !== null && filtered[lightbox] && (
        <div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          onClick={() => setLightbox(null)}
          onTouchStart={(e) => {
            e.currentTarget.dataset.x = e.touches[0].clientX;
          }}
          onTouchEnd={(e) => {
            const start = Number(e.currentTarget.dataset.x || 0);
            const dx = e.changedTouches[0].clientX - start;
            if (dx > 50) prev();
            if (dx < -50) next();
          }}
        >
          <button type="button" className="lightbox-close" onClick={() => setLightbox(null)}>
            Close
          </button>
          <button
            type="button"
            className="lightbox-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
          >
            Prev
          </button>
          <img
            src={filtered[lightbox].imageUrl}
            alt={filtered[lightbox].title || 'Gallery image'}
            onClick={(e) => e.stopPropagation()}
          />
          <button
            type="button"
            className="lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
