import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { useSettings } from '../../context/AppContext';
import '../shared/Page.css';

export default function About() {
  const { settings } = useSettings();

  return (
    <div className="page">
      <SEO
        title="About"
        description="Professional event dressing and party styling in Port Glasgow, Scotland."
        path="/about"
      />
      <section className="page-hero">
        <div className="container">
          <p className="section-label">About</p>
          <h1>Your Event Deserves to Look Its Best</h1>
        </div>
      </section>
      <section className="section">
        <div className="container prose">
          {(settings.aboutText || '')
            .split('\n')
            .filter(Boolean)
            .map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
          {!settings.aboutText && (
            <>
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
            </>
          )}
          <Link to="/enquire" className="btn btn-primary" style={{ marginTop: '1.5rem' }}>
            Let&apos;s Plan Your Event
          </Link>
        </div>
      </section>
    </div>
  );
}
