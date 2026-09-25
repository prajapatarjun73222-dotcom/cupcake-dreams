import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import './Admin.css';

export default function AdminServices() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', active: true, order: 0 });
  const [editing, setEditing] = useState(null);

  async function load() {
    setItems(await api('/services?all=1'));
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function save(e) {
    e.preventDefault();
    const body = { ...form, order: Number(form.order) || 0 };
    if (editing) await api(`/services/${editing}`, { method: 'PUT', body });
    else await api('/services', { method: 'POST', body });
    setForm({ name: '', description: '', active: true, order: 0 });
    setEditing(null);
    await load();
  }

  return (
    <div className="admin-page">
      <h1>Services</h1>
      <form className="admin-form" onSubmit={save}>
        <div className="admin-form-grid">
          <label>
            Name
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
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
          <label className="span-2">
            Description
            <textarea
              rows={3}
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </label>
          <div className="check-row">
            <label className="check-label">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
              />
              Active
            </label>
          </div>
        </div>
        <div className="form-actions">
          <button type="submit">{editing ? 'Update' : 'Add service'}</button>
        </div>
      </form>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.description}</td>
                <td>{s.active ? 'Yes' : 'No'}</td>
                <td>
                  <div className="row-actions">
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(s._id);
                        setForm({
                          name: s.name,
                          description: s.description,
                          active: s.active,
                          order: s.order,
                        });
                      }}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={async () => {
                        await api(`/services/${s._id}`, { method: 'DELETE' });
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
