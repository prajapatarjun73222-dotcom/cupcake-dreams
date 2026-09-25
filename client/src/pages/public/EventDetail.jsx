import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import SEO from '../../components/SEO';
import { api, formatDate } from '../../lib/api';
import '../shared/Page.css';

export default function EventDetail() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    api(`/events/slug/${slug}`)
      .then((data) => {
        setEvent(data);
        setActive(0);
      })
      .catch(() => setEvent(null));
  }, [slug]);

  if (!event) {
    return (
      <div className="page section container">
        <p>Loading event…</p>
      </div>
    );
  }

  const images = event.imageUrls?.length ? event.imageUrls : ['/images/hero.png'];

  return (
    <div className="page">
      <SEO title={event.title} description={event.description} path={`/events/${event.slug}`} />
      <section className="section">
        <div className="container event-detail">
          <p className="section-label">{event.category}</p>
          <h1>{event.title}</h1>
          <p className="event-meta">
            {formatDate(event.date)}
            {event.location ? ` · ${event.location}` : ''}
          </p>
          <div className="event-gallery">
            <div className="event-main-image">
              <img src={images[active]} alt={`${event.title} photo ${active + 1}`} />
            </div>
            {images.length > 1 && (
              <div className="event-thumbs">
                {images.map((src, i) => (
                  <button
                    key={`${src}-${i}`}
                    type="button"
                    className={i === active ? 'active' : ''}
                    onClick={() => setActive(i)}
                  >
                    <img src={src} alt="" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="event-copy">
            <p>{event.description}</p>
            {event.servicesUsed?.length > 0 && (
              <div className="used-services">
                <h2>Services used</h2>
                <ul>
                  {event.servicesUsed.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            )}
            <Link to="/enquire" className="btn btn-primary">
              Plan Something Similar
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
