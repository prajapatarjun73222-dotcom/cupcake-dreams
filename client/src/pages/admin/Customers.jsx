import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import './Admin.css';

export default function Customers() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', notes: '' });

  async function load(query = q) {
    const data = await api(`/customers${query ? `?q=${encodeURIComponent(query)}` : ''}`);
    setItems(data);
  }

  useEffect(() => {
    load().catch(() => {});
  }, []);

  async function create(e) {
    e.preventDefault();
    await api('/customers', { method: 'POST', body: form });
    setForm({ name: '', email: '', phone: '', address: '', notes: '' });
    await load();
  }

  return (
    <div className="admin-page">
      <h1>Customers</h1>
      <div className="admin-toolbar">
        <input
          placeholder="Search customers"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="button" onClick={() => load()}>
          Search
        </button>
      </div>
      <form className="admin-form" onSubmit={create}>
        <h2>Add customer</h2>
        <div className="admin-form-grid">
          <label>
            Name *
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </label>
          <label>
            Email *
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </label>
          <label>
            Phone
            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </label>
          <label>
            Address
            <input
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit">Create</button>
        </div>
      </form>
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.email}</td>
                <td>{c.phone || '—'}</td>
                <td>
                  <Link to={`/admin/customers/${c._id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
