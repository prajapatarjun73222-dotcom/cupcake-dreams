import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SEO from '../../components/SEO';
import { api, priceLabel } from '../../lib/api';
import '../shared/Page.css';

export default function Packages() {
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    api('/packages').then(setPackages).catch(() => {});
  }, []);

  return (
    <div className="page">
      <SEO
        title="Packages"
        description="Event styling packages from Cupcake Dreams Events And Party Planner. Request a quote."
        path="/packages"
      />
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Packages</p>
          <h1>Choose a Starting Point</h1>
          <p className="section-lead">
            No fixed pricing listed here — request a quote for your date and celebration.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container packages-page-grid">
          {packages.map((pkg) => (
            <article key={pkg._id} className="pkg-page-card">
              <img src={pkg.imageUrl || '/images/hero.png'} alt={pkg.name} loading="lazy" />
              <div>
                <h2>{pkg.name}</h2>
                <p>{pkg.description}</p>
                <h3>Included</h3>
                <ul>
                  {(pkg.includedServices || []).map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                {pkg.optionalServices?.length > 0 && (
                  <>
                    <h3>Optional</h3>
                    <ul>
                      {pkg.optionalServices.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ul>
                  </>
                )}
                <p className="package-price">{priceLabel(pkg.startingPrice)}</p>
                <Link
                  to={`/enquire?package=${encodeURIComponent(pkg.name)}`}
                  className="btn btn-primary"
                >
                  Request a Quote
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
