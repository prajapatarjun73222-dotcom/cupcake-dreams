import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate } from '../../lib/api';
import './Admin.css';

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api('/dashboard/stats').then(setStats).catch(() => {});
  }, []);

  if (!stats) return <div className="admin-page">Loading dashboard…</div>;

  return (
    <div className="admin-page">
      <h1>Dashboard</h1>
      <div className="stat-grid">
        <div className="stat-card">
          <strong>{stats.newEnquiries}</strong>
          <span>New Enquiries</span>
        </div>
        <div className="stat-card">
          <strong>{stats.pendingEnquiries}</strong>
          <span>Pending Enquiries</span>
        </div>
        <div className="stat-card">
          <strong>{stats.upcomingEvents}</strong>
          <span>Upcoming Events</span>
        </div>
        <div className="stat-card">
          <strong>{stats.confirmedEvents}</strong>
          <span>Confirmed Events</span>
        </div>
        <div className="stat-card">
          <strong>{stats.eventsThisMonth}</strong>
          <span>Events This Month</span>
        </div>
      </div>

      <h2>Recent Enquiries</h2>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Event Type</th>
              <th>Event Date</th>
              <th>Location</th>
              <th>Status</th>
              <th>Received</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stats.recentEnquiries.map((e) => (
              <tr key={e._id}>
                <td>{e.name}</td>
                <td>{e.eventType || '—'}</td>
                <td>{formatDate(e.eventDate)}</td>
                <td>{e.location || '—'}</td>
                <td>
                  <span className={`status-pill status-${e.status}`}>{e.status}</span>
                </td>
                <td>{formatDate(e.receivedAt)}</td>
                <td>
                  <div className="row-actions">
                    <Link to={`/admin/enquiries/${e._id}`}>View</Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
