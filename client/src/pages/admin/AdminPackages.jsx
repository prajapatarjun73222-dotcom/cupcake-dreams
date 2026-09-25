import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import './Admin.css';

const empty = {
  name: '',
  description: '',
  includedServices: '',
  optionalServices: '',
  startingPrice: '',
  imageUrl: '/images/hero.png',
  available: true,
  order: 0,
};

export default function AdminPackages() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  async function load() {
    setItems(await api('/packages?all=1'));
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  function toBody() {
    return {
      name: form.name,
      description: form.description,
      includedServices: form.includedServices
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      optionalServices: form.optionalServices
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      startingPrice: form.startingPrice || null,
      imageUrl: form.imageUrl,
      available: form.available,
      order: Number(form.order) || 0,
    };
  }

  async function save(e) {
    e.preventDefault();
    const body = toBody();
    if (editing) await api(`/packages/${editing}`, { method: 'PUT', body });
    else await api('/packages', { method: 'POST', body });
    setForm(empty);
    setEditing(null);
    await load();
  }

  return (
    <div className="admin-page">
      <h1>Packages</h1>
      <form className="admin-form" onSubmit={save}>
        <div className="admin-form-grid">
          <label>
            Name
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </label>
          <label>
            Starting price (leave blank for “Price on request”)
            <input
              value={form.startingPrice}
              onChange={(e) => setForm({ ...form, startingPrice: e.target.value })}
            />
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
            Included services (comma-separated)
            <input
              value={form.includedServices}
              onChange={(e) => setForm({ ...form, includedServices: e.target.value })}
            />
          </label>
          <label>
            Optional services (comma-separated)
            <input
              value={form.optionalServices}
              onChange={(e) => setForm({ ...form, optionalServices: e.target.value })}
            />
          </label>
          <label>
            Image URL
            <input
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
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
          {form.imageUrl && (
            <div className="preview-wrap">
              <img className="image-preview" src={form.imageUrl} alt="" />
            </div>
          )}
          <div className="check-row">
            <label className="check-label">
              <input
                type="checkbox"
                checked={form.available}
                onChange={(e) => setForm({ ...form, available: e.target.checked })}
              />
              Available
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit">{editing ? 'Update' : 'Add package'}</button>
        </div>
      </form>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Available</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.startingPrice || 'Price on request'}</td>
                <td>{p.available ? 'Yes' : 'No'}</td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(p._id);
                        setForm({
                          name: p.name,
                          description: p.description,
                          includedServices: (p.includedServices || []).join(', '),
                          optionalServices: (p.optionalServices || []).join(', '),
                          startingPrice: p.startingPrice || '',
                          imageUrl: p.imageUrl || '',
                          available: p.available,
                          order: p.order,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={async () => {
                        await api(`/packages/${p._id}`, { method: 'DELETE' });
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
