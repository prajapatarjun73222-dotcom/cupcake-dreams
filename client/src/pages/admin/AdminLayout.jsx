import { useState } from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';
import './Admin.css';

const links = [
  { to: '/admin', label: 'Dashboard', end: true },
  { to: '/admin/enquiries', label: 'Enquiries' },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/calendar', label: 'Calendar' },
  { to: '/admin/customers', label: 'Customers' },
  { to: '/admin/services', label: 'Services' },
  { to: '/admin/packages', label: 'Packages' },
  { to: '/admin/events', label: 'Events' },
  { to: '/admin/gallery', label: 'Gallery' },
  { to: '/admin/testimonials', label: 'Testimonials' },
  { to: '/admin/settings', label: 'Settings' },
];

export default function AdminLayout() {
  const { user, ready, logout } = useAuth();
  const navigate = useNavigate();
  const [navOpen, setNavOpen] = useState(false);

  if (!ready) return <div className="admin-loading">Loading…</div>;
  if (!user) return <Navigate to="/admin/login" replace />;

  function closeNav() {
    setNavOpen(false);
  }

  return (
    <div className={`admin-shell ${navOpen ? 'nav-open' : ''}`}>
      <div className="admin-nav-backdrop" onClick={closeNav} aria-hidden="true" />
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <strong>Cupcake Dreams</strong>
          <span>Admin</span>
        </div>
        <nav>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="admin-nav-link"
              onClick={closeNav}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          type="button"
          className="admin-logout"
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
        >
          Log out
        </button>
      </aside>
      <div className="admin-main">
        <header className="admin-top">
          <div className="admin-top-left">
            <button
              type="button"
              className="admin-menu-btn"
              aria-label="Open menu"
              aria-expanded={navOpen}
              onClick={() => setNavOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
            <p>Signed in as {user.name || user.email}</p>
          </div>
          <a href="/" target="_blank" rel="noreferrer">
            View website
          </a>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
