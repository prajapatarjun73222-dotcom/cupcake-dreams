import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import './Admin.css';

const empty = {
  customerName: '',
  eventType: '',
  review: '',
  photoUrl: '',
  date: '',
  featured: true,
  isPlaceholder: false,
};

export default function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  async function load() {
    setItems(await api('/testimonials'));
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function save(e) {
    e.preventDefault();
    const body = { ...form, date: form.date || undefined };
    if (editing) await api(`/testimonials/${editing}`, { method: 'PUT', body });
    else await api('/testimonials', { method: 'POST', body });
    setForm(empty);
    setEditing(null);
    await load();
  }

  return (
    <div className="admin-page">
      <h1>Testimonials</h1>
      <p style={{ color: 'var(--muted)' }}>
        Do not invent reviews. Add genuine customer testimonials only. Placeholder items are labelled in the
        public site.
      </p>
      <form className="admin-form" onSubmit={save}>
        <div className="admin-form-grid">
          <label>
            Customer name
            <input
              required
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
          </label>
          <label>
            Event type
            <input
              value={form.eventType}
              onChange={(e) => setForm({ ...form, eventType: e.target.value })}
            />
          </label>
          <label className="span-2">
            Review
            <textarea
              required
              rows={3}
              value={form.review}
              onChange={(e) => setForm({ ...form, review: e.target.value })}
            />
          </label>
          <label>
            Photo URL
            <input
              value={form.photoUrl}
              onChange={(e) => setForm({ ...form, photoUrl: e.target.value })}
            />
          </label>
          <label>
            Date
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </label>
          <div className="check-row">
            <label className="check-label">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) => setForm({ ...form, featured: e.target.checked })}
              />
              Featured
            </label>
            <label className="check-label">
              <input
                type="checkbox"
                checked={form.isPlaceholder}
                onChange={(e) => setForm({ ...form, isPlaceholder: e.target.checked })}
              />
              Placeholder
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit">{editing ? 'Update' : 'Add testimonial'}</button>
          {editing && (
            <button
              type="button"
              className="btn-secondary-admin"
              onClick={() => {
                setEditing(null);
                setForm({
                  customerName: '',
                  eventType: '',
                  review: '',
                  photoUrl: '',
                  date: '',
                  featured: true,
                  isPlaceholder: false,
                });
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
              <th>Name</th>
              <th>Review</th>
              <th>Placeholder</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((t) => (
              <tr key={t._id}>
                <td>{t.customerName}</td>
                <td>{t.review}</td>
                <td>{t.isPlaceholder ? 'Yes' : 'No'}</td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(t._id);
                        setForm({
                          customerName: t.customerName,
                          eventType: t.eventType || '',
                          review: t.review,
                          photoUrl: t.photoUrl || '',
                          date: t.date ? t.date.slice(0, 10) : '',
                          featured: t.featured,
                          isPlaceholder: t.isPlaceholder,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={async () => {
                        await api(`/testimonials/${t._id}`, { method: 'DELETE' });
                        await load();
                      }}
                    >
                      Delete
                    </button>
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
