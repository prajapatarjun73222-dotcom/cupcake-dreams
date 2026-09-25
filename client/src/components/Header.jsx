import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSettings } from '../context/AppContext';
import './Header.css';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/events', label: 'Our Events' },
  { to: '/packages', label: 'Packages' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/enquire', label: 'Enquire' },
];

export default function Header() {
  const { settings } = useSettings();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header className={`site-header ${scrolled ? 'is-compact' : ''} ${open ? 'is-open' : ''}`}>
      <div className="container header-inner">
        <Link to="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">
            <span className="brand-name">Cupcake Dreams</span>
            <span className="brand-sub">Events &amp; Party Planner</span>
          </span>
        </Link>

        <nav className="nav-desktop" aria-label="Primary">
          {links.map((link) => (
            <NavLink key={link.to} to={link.to} end={link.end} className="nav-link">
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="header-actions">
          <Link to="/enquire" className="btn btn-primary header-cta">
            Check Availability
          </Link>
          <button
            type="button"
            className="menu-toggle"
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`nav-mobile ${open ? 'open' : ''}`}>
        <nav aria-label="Mobile">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className="nav-mobile-link"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          <Link to="/enquire" className="btn btn-primary" onClick={() => setOpen(false)}>
            Check Availability
          </Link>
          <p className="nav-mobile-meta">{settings.address?.city}, Scotland</p>
        </nav>
      </div>
    </header>
  );
}
