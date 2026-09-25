import { Link } from 'react-router-dom';
import { useSettings } from '../context/AppContext';
import { telLink, whatsappLink } from '../lib/api';
import './FloatingCTAs.css';

export default function FloatingCTAs() {
  const { settings } = useSettings();
  const msg =
    settings.bookingSettings?.defaultMessage ||
    "Hi Cupcake Dreams Events And Party Planner, I'd like to enquire about an event.";

  return (
    <>
      <a
        className="whatsapp-fab"
        href={whatsappLink(settings.whatsapp || settings.phone, msg)}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat on WhatsApp"
      >
        <span className="whatsapp-fab-icon" aria-hidden="true">
          ✦
        </span>
        <span>Chat on WhatsApp</span>
      </a>

      <div className="mobile-cta-bar" role="navigation" aria-label="Quick actions">
        <a href={whatsappLink(settings.whatsapp || settings.phone, msg)} target="_blank" rel="noreferrer">
          WhatsApp
        </a>
        <a href={telLink(settings.phone)}>Call</a>
        <Link to="/enquire" className="mobile-cta-primary">
          Check Availability
        </Link>
      </div>
    </>
  );
}
