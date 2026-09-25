import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api, formatDate, telLink, whatsappLink } from '../../lib/api';
import './Admin.css';

export default function Enquiries() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');

  async function load() {
    const q = status ? `?status=${status}` : '';
    setItems(await api(`/enquiries${q}`));
  }

  useEffect(() => {
    load().catch(() => {});
  }, [status]);

  async function confirm(id) {
    await api(`/enquiries/${id}/confirm`, { method: 'POST' });
    await load();
  }

  async function cancel(id) {
    await api(`/enquiries/${id}/cancel`, { method: 'POST' });
    await load();
  }

  return (
    <div className="admin-page">
      <h1>Enquiries</h1>
      <div className="admin-toolbar">
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
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
            {items.map((e) => (
              <tr key={e._id}>
                <td>
                  <div>{e.name}</div>
                  <small>{e.email}</small>
                </td>
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
                    <Link to={`/admin/enquiries/${e._id}`}>Edit</Link>
                    <a href={telLink(e.phone)}>Call</a>
                    <a
                      href={whatsappLink(e.phone || '+447584248854', `Hi ${e.name}, regarding your event enquiry…`)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Contact
                    </a>
                    {e.status !== 'confirmed' && (
                      <button type="button" onClick={() => confirm(e._id)}>
                        Confirm
                      </button>
                    )}
                    {e.status !== 'cancelled' && (
                      <button type="button" className="danger" onClick={() => cancel(e._id)}>
                        Cancel
                      </button>
                    )}
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
