import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatDate } from '../../lib/api';
import './Admin.css';

export default function CustomerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [notes, setNotes] = useState('');

  async function load() {
    const res = await api(`/customers/${id}`);
    setData(res);
    setNotes(res.customer.notes || '');
  }

  useEffect(() => {
    load().catch(() => {});
  }, [id]);

  async function saveNotes(e) {
    e.preventDefault();
    await api(`/customers/${id}`, { method: 'PUT', body: { notes } });
    await load();
  }

  if (!data) return <div className="admin-page">Loading…</div>;
  const { customer, enquiries, upcomingEvents, previousEvents } = data;

  return (
    <div className="admin-page">
      <Link to="/admin/customers">← Back</Link>
      <h1>{customer.name}</h1>
      <div className="detail-grid">
        <div className="detail-card">
          <h2>Profile</h2>
          <p>
            <strong>Email:</strong> {customer.email}
          </p>
          <p>
            <strong>Phone:</strong> {customer.phone || '—'}
          </p>
          <p>
            <strong>Address:</strong> {customer.address || '—'}
          </p>
          <form onSubmit={saveNotes}>
            <label>
              Notes
              <textarea rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>
            <button type="submit">Save notes</button>
          </form>
        </div>
        <div className="detail-card">
          <h2>Upcoming Events</h2>
          <ul>
            {upcomingEvents.map((b) => (
              <li key={b._id}>
                {formatDate(b.eventDate)} — {b.title || b.eventType || 'Event'} ({b.status})
              </li>
            ))}
            {upcomingEvents.length === 0 && <li>None</li>}
          </ul>
          <h2>Previous Events</h2>
          <ul>
            {previousEvents.map((b) => (
              <li key={b._id}>
                {formatDate(b.eventDate)} — {b.title || b.eventType || 'Event'}
              </li>
            ))}
            {previousEvents.length === 0 && <li>None</li>}
          </ul>
          <h2>Enquiries</h2>
          <ul>
            {enquiries.map((e) => (
              <li key={e._id}>
                <Link to={`/admin/enquiries/${e._id}`}>
                  {formatDate(e.receivedAt)} — {e.eventType || 'Enquiry'} ({e.status})
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
