import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api, formatDate, telLink, whatsappLink } from '../../lib/api';
import './Admin.css';

export default function EnquiryDetail() {
  const { id } = useParams();
  const [enquiry, setEnquiry] = useState(null);
  const [note, setNote] = useState('');

  async function load() {
    setEnquiry(await api(`/enquiries/${id}`));
  }

  useEffect(() => {
    load().catch(() => {});
  }, [id]);

  async function setStatus(status) {
    await api(`/enquiries/${id}`, { method: 'PUT', body: { status } });
    await load();
  }

  async function confirm() {
    await api(`/enquiries/${id}/confirm`, { method: 'POST' });
    await load();
  }

  async function cancel() {
    await api(`/enquiries/${id}/cancel`, { method: 'POST' });
    await load();
  }

  async function addNote(e) {
    e.preventDefault();
    if (!note.trim()) return;
    await api(`/enquiries/${id}/notes`, { method: 'POST', body: { text: note } });
    setNote('');
    await load();
  }

  if (!enquiry) return <div className="admin-page">Loading…</div>;

  return (
    <div className="admin-page">
      <div className="admin-toolbar">
        <Link to="/admin/enquiries">← Back</Link>
        <span className={`status-pill status-${enquiry.status}`}>{enquiry.status}</span>
      </div>
      <h1>Enquiry — {enquiry.name}</h1>

      <div className="detail-actions">
        <button type="button" onClick={confirm}>
          Confirm Booking
        </button>
        <button type="button" onClick={() => setStatus('contacted')}>
          Request More Information
        </button>
        <button type="button" onClick={() => setStatus('contacted')}>
          Contact Customer
        </button>
        <button type="button" className="danger" onClick={cancel}>
          Cancel Enquiry
        </button>
        <a href={telLink(enquiry.phone)} className="btn-admin">
          Call
        </a>
        <a href={`mailto:${enquiry.email}`} className="btn-admin">
          Email
        </a>
        <a
          href={whatsappLink(
            enquiry.phone || '+447584248854',
            `Hi ${enquiry.name}, thank you for your enquiry with Cupcake Dreams Events.`
          )}
          target="_blank"
          rel="noreferrer"
          className="btn-admin"
        >
          WhatsApp
        </a>
      </div>

      <div className="detail-grid">
        <div className="detail-card">
          <h2>Customer Details</h2>
          <p>
            <strong>Name:</strong> {enquiry.name}
          </p>
          <p>
            <strong>Email:</strong> {enquiry.email}
          </p>
          <p>
            <strong>Phone:</strong> {enquiry.phone || '—'}
          </p>
          {enquiry.customer && (
            <p>
              <Link to={`/admin/customers/${enquiry.customer._id || enquiry.customer}`}>
                View customer profile
              </Link>
            </p>
          )}
        </div>
        <div className="detail-card">
          <h2>Event Details</h2>
          <p>
            <strong>Type:</strong> {enquiry.eventType || '—'}
          </p>
          <p>
            <strong>Date:</strong> {formatDate(enquiry.eventDate)}
          </p>
          <p>
            <strong>Time:</strong> {enquiry.startTime || '—'}
          </p>
          <p>
            <strong>Venue:</strong> {enquiry.location || '—'}
          </p>
          <p>
            <strong>Guests:</strong> {enquiry.guestCount ?? '—'}
          </p>
        </div>
        <div className="detail-card">
          <h2>Requirements</h2>
          <p>
            <strong>Package:</strong>{' '}
            {enquiry.package?.name || enquiry.preferredPackageName || '—'}
          </p>
          <p>
            <strong>Services:</strong>{' '}
            {(enquiry.servicesRequired || []).join(', ') || '—'}
          </p>
          <p>
            <strong>Theme:</strong> {enquiry.theme || '—'}
          </p>
          <p>
            <strong>Budget:</strong> {enquiry.budgetRange || '—'}
          </p>
          <p>
            <strong>Message:</strong> {enquiry.message || '—'}
          </p>
          {enquiry.inspirationUrls?.length > 0 && (
            <div>
              <strong>Inspiration URLs:</strong>
              <ul>
                {enquiry.inspirationUrls.map((url) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noreferrer">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <div className="detail-card">
          <h2>Internal Notes</h2>
          <ul>
            {(enquiry.internalNotes || []).map((n) => (
              <li key={n._id || n.createdAt}>
                {n.text} <small>({formatDate(n.createdAt)})</small>
              </li>
            ))}
          </ul>
          <form onSubmit={addNote} className="admin-toolbar">
            <input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add internal note"
            />
            <button type="submit">Add Internal Note</button>
          </form>
        </div>
      </div>
    </div>
  );
}
