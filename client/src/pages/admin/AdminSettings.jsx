import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useSettings } from '../../context/AppContext';
import './Admin.css';

export default function AdminSettings() {
  const { refreshSettings } = useSettings();
  const [form, setForm] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api('/settings').then(setForm).catch(() => {});
  }, []);

  if (!form) return <div className="admin-page">Loading settings…</div>;

  function setField(path, value) {
    setForm((prev) => {
      const next = structuredClone(prev);
      const parts = path.split('.');
      let cur = next;
      for (let i = 0; i < parts.length - 1; i += 1) cur = cur[parts[i]];
      cur[parts[parts.length - 1]] = value;
      return next;
    });
  }

  async function save(e) {
    e.preventDefault();
    const updated = await api('/settings', { method: 'PUT', body: form });
    setForm(updated);
    await refreshSettings();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="admin-page">
      <h1>Settings</h1>
      <form className="admin-form" onSubmit={save}>
        <h2>Business</h2>
        <div className="admin-form-grid">
          <label>
            Business name
            <input
              value={form.businessName || ''}
              onChange={(e) => setField('businessName', e.target.value)}
            />
          </label>
          <label>
            Logo URL
            <input value={form.logoUrl || ''} onChange={(e) => setField('logoUrl', e.target.value)} />
          </label>
          <label>
            Phone
            <input value={form.phone || ''} onChange={(e) => setField('phone', e.target.value)} />
          </label>
          <label>
            Email
            <input value={form.email || ''} onChange={(e) => setField('email', e.target.value)} />
          </label>
          <label>
            WhatsApp
            <input value={form.whatsapp || ''} onChange={(e) => setField('whatsapp', e.target.value)} />
          </label>
          <label>
            Opening / contact info
            <input
              value={form.openingInfo || ''}
              onChange={(e) => setField('openingInfo', e.target.value)}
            />
          </label>
          <label>
            Address line
            <input
              value={form.address?.line1 || ''}
              onChange={(e) => setField('address.line1', e.target.value)}
            />
          </label>
          <label>
            City
            <input
              value={form.address?.city || ''}
              onChange={(e) => setField('address.city', e.target.value)}
            />
          </label>
          <label>
            Postcode
            <input
              value={form.address?.postcode || ''}
              onChange={(e) => setField('address.postcode', e.target.value)}
            />
          </label>
          <label>
            Country
            <input
              value={form.address?.country || ''}
              onChange={(e) => setField('address.country', e.target.value)}
            />
          </label>
          <label className="span-2">
            About text
            <textarea
              rows={6}
              value={form.aboutText || ''}
              onChange={(e) => setField('aboutText', e.target.value)}
            />
          </label>
        </div>

        <h2>Social links (leave blank to hide)</h2>
        <div className="admin-form-grid">
          {['facebook', 'instagram', 'tiktok', 'pinterest'].map((key) => (
            <label key={key}>
              {key}
              <input
                value={form.socialLinks?.[key] || ''}
                onChange={(e) => setField(`socialLinks.${key}`, e.target.value)}
              />
            </label>
          ))}
        </div>

        <h2>SEO</h2>
        <div className="admin-form-grid">
          <label className="span-2">
            SEO title
            <input value={form.seo?.title || ''} onChange={(e) => setField('seo.title', e.target.value)} />
          </label>
          <label className="span-2">
            Meta description
            <textarea
              rows={3}
              value={form.seo?.description || ''}
              onChange={(e) => setField('seo.description', e.target.value)}
            />
          </label>
          <label className="span-2">
            Open Graph image URL
            <input
              value={form.seo?.ogImageUrl || ''}
              onChange={(e) => setField('seo.ogImageUrl', e.target.value)}
            />
          </label>
        </div>

        <h2>Booking / notifications</h2>
        <div className="admin-form-grid">
          <label className="span-2">
            Default WhatsApp message
            <textarea
              rows={2}
              value={form.bookingSettings?.defaultMessage || ''}
              onChange={(e) => setField('bookingSettings.defaultMessage', e.target.value)}
            />
          </label>
          <label>
            Notification email
            <input
              value={form.notificationEmail || ''}
              onChange={(e) => setField('notificationEmail', e.target.value)}
            />
          </label>
          <div className="check-row">
            <label className="check-label">
              <input
                type="checkbox"
                checked={!!form.notificationEmailEnabled}
                onChange={(e) => setField('notificationEmailEnabled', e.target.checked)}
              />
              Enable email notification stub (logs to server console)
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">Save settings</button>
          {saved && <span>Saved</span>}
        </div>
      </form>
    </div>
  );
}
