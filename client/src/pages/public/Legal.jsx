import SEO from '../../components/SEO';
import '../shared/Page.css';

export function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      path="/privacy"
      body="This is placeholder privacy policy content. Replace with your solicitor-approved policy covering how Cupcake Dreams Events And Party Planner collects and uses enquiry information."
    />
  );
}

export function Cookies() {
  return (
    <LegalPage
      title="Cookie Policy"
      path="/cookies"
      body="This is placeholder cookie policy content. Replace with details of any cookies or analytics used on this website."
    />
  );
}

export function Terms() {
  return (
    <LegalPage
      title="Terms & Conditions"
      path="/terms"
      body="This is placeholder terms and conditions content. Replace with your business terms for event styling enquiries and bookings."
    />
  );
}

function LegalPage({ title, path, body }) {
  return (
    <div className="page">
      <SEO title={title} path={path} />
      <section className="page-hero">
        <div className="container">
          <h1>{title}</h1>
        </div>
      </section>
      <section className="section">
        <div className="container prose">
          <p>{body}</p>
        </div>
      </section>
    </div>
  );
}
