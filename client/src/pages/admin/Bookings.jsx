import { useEffect, useState } from 'react';
import { api, formatDate } from '../../lib/api';
import './Admin.css';

const STATUSES = ['new_enquiry', 'contacted', 'pending', 'confirmed', 'completed', 'cancelled'];

const empty = {
  title: '',
  customer: '',
  eventDate: '',
  startTime: '',
  venue: '',
  eventType: '',
  status: 'pending',
  notes: '',
  guestCount: '',
};

export default function Bookings() {
  const [items, setItems] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  async function load() {
    const [bookings, cust] = await Promise.all([api('/bookings'), api('/customers')]);
    setItems(bookings);
    setCustomers(cust);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function save(e) {
    e.preventDefault();
    const body = {
      ...form,
      guestCount: form.guestCount ? Number(form.guestCount) : undefined,
    };
    if (editing) await api(`/bookings/${editing}`, { method: 'PUT', body });
    else await api('/bookings', { method: 'POST', body });
    setForm(empty);
    setEditing(null);
    await load();
  }

  function edit(item) {
    setEditing(item._id);
    setForm({
      title: item.title || '',
      customer: item.customer?._id || item.customer || '',
      eventDate: item.eventDate ? item.eventDate.slice(0, 10) : '',
      startTime: item.startTime || '',
      venue: item.venue || '',
      eventType: item.eventType || '',
      status: item.status,
      notes: item.notes || '',
      guestCount: item.guestCount || '',
    });
  }

  return (
    <div className="admin-page">
      <h1>Bookings</h1>
      <form className="admin-form" onSubmit={save}>
        <h2>{editing ? 'Edit booking' : 'Create booking'}</h2>
        <div className="admin-form-grid">
          <label>
            Title
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>
            Customer *
            <select
              required
              value={form.customer}
              onChange={(e) => setForm({ ...form, customer: e.target.value })}
            >
              <option value="">Select…</option>
              {customers.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name} ({c.email})
                </option>
              ))}
            </select>
          </label>
          <label>
            Event date *
            <input
              required
              type="date"
              value={form.eventDate}
              onChange={(e) => setForm({ ...form, eventDate: e.target.value })}
            />
          </label>
          <label>
            Start time
            <input
              type="time"
              value={form.startTime}
              onChange={(e) => setForm({ ...form, startTime: e.target.value })}
            />
          </label>
          <label>
            Venue
            <input value={form.venue} onChange={(e) => setForm({ ...form, venue: e.target.value })} />
          </label>
          <label>
            Event type
            <input
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
            />
          </label>
          <label>
            Status
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </label>
          <label>
            Guests
            <input
              type="number"
              value={form.guestCount}
              onChange={(e) => setForm({ ...form, guestCount: e.target.value })}
            />
          </label>
          <label className="span-2">
            Notes
            <textarea
              rows={3}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">{editing ? 'Update' : 'Create'}</button>
          {editing && (
            <button
              type="button"
              className="btn-secondary-admin"
              onClick={() => {
                setEditing(null);
                setForm(empty);
              }}
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Venue</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((b) => (
              <tr key={b._id}>
                <td>{b.title || b.eventType || 'Booking'}</td>
                <td>{b.customer?.name || '—'}</td>
                <td>
                  {formatDate(b.eventDate)} {b.startTime}
                </td>
                <td>{b.venue || '—'}</td>
                <td>
                  <span className={`status-pill status-${b.status}`}>{b.status.replace('_', ' ')}</span>
                </td>
                <td>
                  <div className="row-actions">
                    <button type="button" onClick={() => edit(b)}>
                      Edit
                    </button>
                    <select
                      value={b.status}
                      onChange={async (e) => {
                        await api(`/bookings/${b._id}`, {
                          method: 'PATCH',
                          body: { status: e.target.value },
                        });
                        await load();
                      }}
                    >
                      {STATUSES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
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
