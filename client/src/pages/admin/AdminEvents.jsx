import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import './Admin.css';

const empty = {
  title: '',
  slug: '',
  category: 'Other',
  date: '',
  location: '',
  description: '',
  servicesUsed: '',
  imageUrls: '/images/hero.png',
  featured: false,
  order: 0,
};

export default function AdminEvents() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);
  const [catForm, setCatForm] = useState({ name: '', order: 0 });

  async function load() {
    const [events, cats] = await Promise.all([api('/events'), api('/event-categories?all=1')]);
    setItems(events);
    setCategories(cats);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function save(e) {
    e.preventDefault();
    const body = {
      ...form,
      servicesUsed: form.servicesUsed
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      imageUrls: form.imageUrls
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean),
      order: Number(form.order) || 0,
      date: form.date || undefined,
    };
    if (editing) await api(`/events/${editing}`, { method: 'PUT', body });
    else await api('/events', { method: 'POST', body });
    setForm(empty);
    setEditing(null);
    await load();
  }

  async function saveCategory(e) {
    e.preventDefault();
    await api('/event-categories', {
      method: 'POST',
      body: { name: catForm.name, order: Number(catForm.order) || 0 },
    });
    setCatForm({ name: '', order: 0 });
    await load();
  }

  return (
    <div className="admin-page">
      <h1>Events / Portfolio</h1>
      <form className="admin-form" onSubmit={saveCategory}>
        <h2>Event categories</h2>
        <div className="admin-toolbar">
          <input
            placeholder="Category name"
            value={catForm.name}
            onChange={(e) => setCatForm({ ...catForm, name: e.target.value })}
            required
          />
          <button type="submit">Add category</button>
        </div>
        <p>{categories.map((c) => c.name).join(' · ')}</p>
      </form>

      <form className="admin-form" onSubmit={save}>
        <h2>{editing ? 'Edit event' : 'Add portfolio event'}</h2>
        <div className="admin-form-grid">
          <label>
            Title
            <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>
            Slug (optional)
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </label>
          <label>
            Category
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </label>
          <label>
            Date
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
          </label>
          <label>
            Location
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </label>
          <label>
            Order
            <input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: e.target.value })} />
          </label>
          <label className="span-2">
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label>
            Services used (comma-separated)
            <input
              value={form.servicesUsed}
              onChange={(e) => setForm({ ...form, servicesUsed: e.target.value })}
            />
          </label>
          <label className="span-2">
            Image URLs (comma or new line)
            <textarea
              rows={3}
              value={form.imageUrls}
              onChange={(e) => setForm({ ...form, imageUrls: e.target.value })}
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
          </div>
        </div>
        <div className="form-actions">
          <button type="submit">{editing ? 'Update' : 'Add event'}</button>
        </div>
      </form>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Featured</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((ev) => (
              <tr key={ev._id}>
                <td>{ev.title}</td>
                <td>{ev.category}</td>
                <td>{ev.featured ? 'Yes' : 'No'}</td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(ev._id);
                        setForm({
                          title: ev.title,
                          slug: ev.slug,
                          category: ev.category,
                          date: ev.date ? ev.date.slice(0, 10) : '',
                          location: ev.location || '',
                          description: ev.description || '',
                          servicesUsed: (ev.servicesUsed || []).join(', '),
                          imageUrls: (ev.imageUrls || []).join('\n'),
                          featured: ev.featured,
                          order: ev.order,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={async () => {
                        await api(`/events/${ev._id}`, { method: 'DELETE' });
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
