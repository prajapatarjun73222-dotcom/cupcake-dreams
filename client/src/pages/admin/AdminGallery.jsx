import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import './Admin.css';

const empty = {
  title: '',
  category: 'Other',
  description: '',
  imageUrl: '/images/hero.png',
  featured: false,
  order: 0,
};

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  async function load() {
    setItems(await api('/gallery'));
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function save(e) {
    e.preventDefault();
    const body = { ...form, order: Number(form.order) || 0 };
    if (editing) await api(`/gallery/${editing}`, { method: 'PUT', body });
    else await api('/gallery', { method: 'POST', body });
    setForm(empty);
    setEditing(null);
    await load();
  }

  return (
    <div className="admin-page">
      <h1>Gallery</h1>
      <form className="admin-form" onSubmit={save}>
        <div className="admin-form-grid">
          <label>
            Title
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
          <label>
            Category
            <input
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </label>
          <label className="span-2">
            Image URL *
            <input
              required
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
          </label>
          {form.imageUrl && (
            <div className="preview-wrap">
              <img className="image-preview" src={form.imageUrl} alt="" />
            </div>
          )}
          <label className="span-2">
            Description
            <textarea
              rows={2}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <label>
            Order
            <input
              type="number"
              value={form.order}
              onChange={(e) => setForm({ ...form, order: e.target.value })}
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
          <button type="submit">{editing ? 'Update' : 'Add image'}</button>
        </div>
      </form>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Preview</th>
              <th>Title</th>
              <th>Category</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((img) => (
              <tr key={img._id}>
                <td>
                  <img className="image-preview" src={img.imageUrl} alt="" />
                </td>
                <td>{img.title}</td>
                <td>{img.category}</td>
                <td>{img.order}</td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(img._id);
                        setForm({
                          title: img.title,
                          category: img.category,
                          description: img.description,
                          imageUrl: img.imageUrl,
                          featured: img.featured,
                          order: img.order,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={async () => {
                        await api(`/gallery/${img._id}`, { method: 'DELETE' });
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
