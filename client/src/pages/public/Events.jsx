import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { api, formatDate } from '../../lib/api';
import '../shared/Page.css';

const FILTERS = ['All', 'Birthdays', 'Weddings', 'Parties', 'Baby Showers', 'Corporate', 'Other'];

export default function Events() {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const q = filter === 'All' ? '' : `?category=${encodeURIComponent(filter)}`;
    api(`/events${q}`).then(setEvents).catch(() => {});
  }, [filter]);

  return (
    <div className="page">
      <SEO
        title="Our Events"
        description="Event styling portfolio from Cupcake Dreams Events And Party Planner in Port Glasgow."
        path="/events"
      />
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Portfolio</p>
          <h1>Our Events</h1>
          <p className="section-lead">
            A visual portfolio of styled celebrations. Demo entries use placeholder photography — replace with
            your own images and details.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="filter-row">
            {FILTERS.map((f) => (
              <button
                key={f}
                type="button"
                className={`filter-btn ${filter === f ? 'active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
          <div className="events-grid">
            {events.map((event) => (
              <Link to={`/events/${event.slug}`} key={event._id} className="event-card">
                <div className="event-card-image">
                  <img
                    src={event.imageUrls?.[0] || '/images/hero.png'}
                    alt={event.title}
                    loading="lazy"
                  />
                </div>
                <div className="event-card-body">
                  <span>{event.category}</span>
                  <h2>{event.title}</h2>
                  <p>
                    {formatDate(event.date)}
                    {event.location ? ` · ${event.location}` : ''}
                  </p>
                </div>
              </Link>
            ))}
          </div>
          {events.length === 0 && <p className="empty-note">No events in this category yet.</p>}
        </div>
      </section>
    </div>
  );
}
