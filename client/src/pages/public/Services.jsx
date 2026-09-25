import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { api } from '../../lib/api';
import '../shared/Page.css';

export default function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    api('/services').then(setServices).catch(() => {});
  }, []);

  return (
    <div className="page">
      <SEO
        title="Services"
        description="Event dressing, party planning, balloon styling and venue decorations in Port Glasgow."
        path="/services"
      />
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Services</p>
          <h1>What We Can Do For Your Event</h1>
          <p className="section-lead">
            Service names and descriptions are editable — replace demo content with your confirmed offerings.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container service-list">
          {services.map((s, i) => (
            <article key={s._id} className="service-row">
              <span className="service-num">{String(i + 1).padStart(2, '0')}</span>
              <div>
                <h2>{s.name}</h2>
                <p>{s.description}</p>
              </div>
            </article>
          ))}
          <Link to="/enquire" className="btn btn-primary">
            Check Availability
          </Link>
        </div>
      </section>
    </div>
  );
}
