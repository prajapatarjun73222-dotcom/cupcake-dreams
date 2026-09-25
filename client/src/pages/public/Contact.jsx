import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { useSettings } from '../../context/AppContext';
import { telLink, whatsappLink } from '../../lib/api';
import '../shared/Page.css';

export default function Contact() {
  const { settings } = useSettings();

  return (
    <div className="page">
      <SEO
        title="Contact"
        description="Contact Cupcake Dreams Events And Party Planner in Port Glasgow, Scotland."
        path="/contact"
      />
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Contact</p>
          <h1>Get in Touch</h1>
        </div>
      </section>
      <section className="section">
        <div className="container contact-page-grid">
          <div>
            <h2>{settings.businessName}</h2>
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
            <p>{settings.openingInfo}</p>
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
              title="Map to Cupcake Dreams Events"
              src="https://maps.google.com/maps?q=13%20Rossbank%20Rd%2C%20Port%20Glasgow%2C%20PA14%205AD&t=&z=15&ie=UTF8&iwloc=&output=embed"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
