import { Link } from 'react-router-dom';
import { useSettings } from '../context/AppContext';
import { telLink, whatsappLink } from '../lib/api';
import './Footer.css';

export default function Footer() {
  const { settings } = useSettings();
  const social = settings.socialLinks || {};
  const configuredSocial = Object.entries(social).filter(([, url]) => url);

  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <h2 className="footer-brand">Cupcake Dreams Events And Party Planner</h2>
          <p className="footer-tagline">Event Styling • Party Planning • Event Decorations</p>
          <p className="footer-loc">Port Glasgow, Scotland</p>
          <div className="footer-contact">
            <a href={telLink(settings.phone)}>{settings.phone}</a>
            <a
              href={whatsappLink(
                settings.whatsapp || settings.phone,
                settings.bookingSettings?.defaultMessage
              )}
              target="_blank"
              rel="noreferrer"
            >
              WhatsApp
            </a>
          </div>
        </div>

        <div>
          <h3>Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/gallery">Gallery</Link></li>
            <li><Link to="/packages">Packages</Link></li>
            <li><Link to="/enquire">Enquire</Link></li>
          </ul>
        </div>

        <div>
          <h3>Visit</h3>
          <address>
            {settings.address?.line1}
            <br />
            {settings.address?.city}
            <br />
            {settings.address?.postcode}
            <br />
            {settings.address?.country}
          </address>
          {configuredSocial.length > 0 && (
            <div className="footer-social">
              {configuredSocial.map(([key, url]) => (
                <a key={key} href={url} target="_blank" rel="noreferrer">
                  {key}
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="container footer-bottom">
        <p>© {new Date().getFullYear()} Cupcake Dreams Events And Party Planner</p>
        <div className="footer-legal">
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/cookies">Cookie Policy</Link>
          <Link to="/terms">Terms &amp; Conditions</Link>
        </div>
      </div>
    </footer>
  );
}
