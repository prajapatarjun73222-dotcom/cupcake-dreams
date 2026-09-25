import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { api, priceLabel, telLink, whatsappLink } from '../../lib/api';
import { useSettings } from '../../context/AppContext';
import './Home.css';

const STEPS = [
  { n: '01', title: 'Tell Us About Your Event', text: 'Share your date, venue and the celebration you have in mind.' },
  { n: '02', title: 'Discuss Your Vision', text: 'We talk through colours, styling ideas and the feeling you want to create.' },
  { n: '03', title: 'Plan Your Styling', text: 'Together we shape a thoughtful plan for your space and details.' },
  { n: '04', title: 'Celebrate in Style', text: 'Arrive to a beautifully dressed room ready for your guests.' },
];

export default function Home() {
  const { settings } = useSettings();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [events, setEvents] = useState([]);
  const [packages, setPackages] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    Promise.all([
      api('/services'),
      api('/event-categories'),
      api('/events?featured=1'),
      api('/packages'),
      api('/testimonials?featured=1'),
    ])
      .then(([s, c, e, p, t]) => {
        setServices(s);
        setCategories(c);
        setEvents(e.slice(0, 4));
        setPackages(p);
        setTestimonials(t);
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <SEO path="/" />

      <section
        className="hero"
        aria-label="Cupcake Dreams Events hero"
        style={{
          '--hero-image':
            'url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2400&q=85)',
        }}
      >
        <div className="hero-veil" aria-hidden="true" />
        <div className="hero-content fade-in">
          <p className="hero-brand">Cupcake Dreams</p>
          <p className="hero-location">Event Styling &amp; Party Planning • Port Glasgow, Scotland</p>
          <h1>Beautifully Styled Events, Made Unforgettable</h1>
          <p className="hero-lead">
            Professional event dressing that transforms your celebration into something truly special.
          </p>
          <div className="hero-actions">
            <Link to="/enquire" className="btn btn-primary">
              Check Availability
            </Link>
            <Link to="/events" className="btn btn-hero-ghost">
              Explore Our Events
            </Link>
          </div>
        </div>
      </section>

      <section className="section about-preview">
        <div className="container about-grid">
          <div className="about-visual">
            <img
              src="https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80"
              alt="Beautifully styled celebration tables with floral centrepieces"
              loading="lazy"
            />
            <div className="about-visual-accent" aria-hidden="true" />
          </div>
          <div>
            <p className="section-label">About</p>
            <h2 className="section-title">Your Event Deserves to Look Its Best</h2>
            <p>
              Whether you&apos;re a seasoned event planner or putting together an event for the first time, the
              right event dressing can make all the difference.
            </p>
            <p>
              At Cupcake Dreams Events And Party Planner, we help bring your celebration together through
              thoughtful decoration, styling and attention to detail.
            </p>
            <p>
              From the first idea to the finished room, we&apos;re here to help you create an event that feels
              special, beautiful and personal.
            </p>
            <Link to="/enquire" className="btn btn-outline">
              Let&apos;s Plan Your Event
            </Link>
          </div>
        </div>
      </section>

      <section className="section services-section">
        <div className="container">
          <p className="section-label">Services</p>
          <h2 className="section-title">What We Can Do For Your Event</h2>
          <p className="section-lead">
            Explore the ways we can help dress and style your celebration. Details can be tailored to your
            occasion.
          </p>
          <div className="service-grid">
            {services.map((service) => (
              <article key={service._id} className="service-item">
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </article>
            ))}
          </div>
          <div className="section-cta">
            <Link to="/services" className="btn btn-ghost">
              View all services
            </Link>
          </div>
        </div>
      </section>

      <section className="section events-style-section">
        <div className="container">
          <p className="section-label">Occasions</p>
          <h2 className="section-title">Events We Style</h2>
          <p className="section-lead">
            Configurable celebration categories — tell us about your occasion and we&apos;ll help shape the look.
          </p>
          <div className="category-row">
            {categories.map((cat) => (
              <span key={cat._id} className="category-chip">
                {cat.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="section portfolio-section">
        <div className="container">
          <div className="section-head-row">
            <div>
              <p className="section-label">Portfolio</p>
              <h2 className="section-title">Featured Events</h2>
            </div>
            <Link to="/events" className="btn btn-outline">
              View portfolio
            </Link>
          </div>
          <div className="portfolio-grid">
            {events.map((event) => (
              <Link to={`/events/${event.slug}`} key={event._id} className="portfolio-card">
                <div className="portfolio-image">
                  <img
                    src={event.imageUrls?.[0] || '/images/hero.png'}
                    alt={event.title}
                    loading="lazy"
                  />
                </div>
                <div className="portfolio-meta">
                  <span>{event.category}</span>
                  <h3>{event.title}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section packages-section">
        <div className="container">
          <p className="section-label">Packages</p>
          <h2 className="section-title">Styling Experiences</h2>
          <p className="section-lead">
            Starting points for your celebration. Every package can be tailored — request a quote for your date.
          </p>
          <div className="package-grid">
            {packages.map((pkg) => (
              <article key={pkg._id} className="package-card">
                <div className="package-image">
                  <img src={pkg.imageUrl || '/images/hero.png'} alt={pkg.name} loading="lazy" />
                </div>
                <div className="package-body">
                  <h3>{pkg.name}</h3>
                  <p>{pkg.description}</p>
                  <p className="package-price">{priceLabel(pkg.startingPrice)}</p>
                  <Link to={`/enquire?package=${encodeURIComponent(pkg.name)}`} className="btn btn-outline">
                    Request a Quote
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section how-section">
        <div className="container">
          <p className="section-label">Process</p>
          <h2 className="section-title">How It Works</h2>
          <div className="steps-grid">
            {STEPS.map((step) => (
              <article key={step.n} className="step-item">
                <span className="step-icon" aria-hidden="true">
                  {step.n}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section testimonials-section">
        <div className="container">
          <p className="section-label">Kind Words</p>
          <h2 className="section-title">Testimonials</h2>
          <p className="section-lead">
            Genuine customer reviews will appear here once added. Placeholders are shown until then.
          </p>
          <div className="testimonial-grid">
            {testimonials.map((t) => (
              <blockquote key={t._id} className={`testimonial-card ${t.isPlaceholder ? 'is-placeholder' : ''}`}>
                <p>&ldquo;{t.review}&rdquo;</p>
                <footer>
                  <strong>{t.customerName}</strong>
                  {t.eventType && <span>{t.eventType}</span>}
                  {t.isPlaceholder && <em>Placeholder</em>}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      <section className="section cta-band">
        <div className="container cta-band-inner">
          <h2>Ready to Check Availability?</h2>
          <p>Tell us about your celebration and we&apos;ll be in touch to discuss your vision.</p>
          <Link to="/enquire" className="btn btn-primary">
            Check Availability
          </Link>
        </div>
      </section>

      <section className="section contact-section" id="contact">
        <div className="container contact-grid">
          <div>
            <p className="section-label">Contact</p>
            <h2 className="section-title">Let&apos;s Talk About Your Event</h2>
            <p className="contact-name">{settings.businessName}</p>
            <address>
              {settings.address?.line1}
              <br />
              {settings.address?.city}
              <br />
              {settings.address?.postcode}
              <br />
              {settings.address?.country}
            </address>
            <p>
              <a href={telLink(settings.phone)}>{settings.phone}</a>
            </p>
            <div className="contact-actions">
              <a href={telLink(settings.phone)} className="btn btn-outline">
                Call Us
              </a>
              <a
                href={whatsappLink(
                  settings.whatsapp || settings.phone,
                  settings.bookingSettings?.defaultMessage
                )}
                className="btn btn-whatsapp"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp
              </a>
              <Link to="/enquire" className="btn btn-primary">
                Send an Enquiry
              </Link>
            </div>
          </div>
          <div className="map-embed">
            <iframe
              title="Cupcake Dreams Events location map"
              src="https://maps.google.com/maps?q=13%20Rossbank%20Rd%2C%20Port%20Glasgow%2C%20PA14%205AD&t=&z=15&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>
    </>
  );
}
