import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import SEO from '../../components/SEO';
import { useSettings } from '../../context/AppContext';
import { api, whatsappLink } from '../../lib/api';
import '../shared/Page.css';

const BUDGETS = ['Prefer not to say', 'Under £500', '£500–£1,000', '£1,000–£2,500', '£2,500+'];

export default function Enquire() {
  const { settings } = useSettings();
  const [params] = useSearchParams();
  const [services, setServices] = useState([]);
  const [packages, setPackages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    startTime: '',
    location: '',
    guestCount: '',
    preferredPackageName: params.get('package') || '',
    package: '',
    servicesRequired: [],
    budgetRange: '',
    theme: '',
    message: '',
    inspirationUrls: '',
  });

  useEffect(() => {
    Promise.all([api('/services'), api('/packages'), api('/event-categories')])
      .then(([s, p, c]) => {
        setServices(s);
        setPackages(p);
        setCategories(c);
        const pref = params.get('package');
        if (pref) {
          const match = p.find((x) => x.name === pref);
          if (match) {
            setForm((f) => ({ ...f, preferredPackageName: match.name, package: match._id }));
          }
        }
      })
      .catch(() => {});
  }, [params]);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function toggleService(name) {
    setForm((f) => {
      const set = new Set(f.servicesRequired);
      if (set.has(name)) set.delete(name);
      else set.add(name);
      return { ...f, servicesRequired: [...set] };
    });
  }

  const waMessage = useMemo(() => {
    const parts = [
      "Hi Cupcake Dreams Events And Party Planner, I'd like to enquire about an event.",
      form.eventDate ? `Event date: ${form.eventDate}` : '',
      form.eventType ? `Event type: ${form.eventType}` : '',
      form.preferredPackageName ? `Package: ${form.preferredPackageName}` : '',
    ].filter(Boolean);
    return parts.join('\n');
  }, [form.eventDate, form.eventType, form.preferredPackageName]);

  async function onSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      const inspirationUrls = form.inspirationUrls
        .split(/[\n,]/)
        .map((s) => s.trim())
        .filter(Boolean);
      await api('/enquiries', {
        method: 'POST',
        body: {
          ...form,
          guestCount: form.guestCount ? Number(form.guestCount) : undefined,
          package: form.package || undefined,
          inspirationUrls,
        },
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.message || 'Unable to submit enquiry');
    } finally {
      setSaving(false);
    }
  }

  if (submitted) {
    return (
      <div className="page">
        <SEO title="Enquiry Received" path="/enquire" />
        <section className="section">
          <div className="container prose thank-you">
            <p className="section-label">Thank you</p>
            <h1>Enquiry received</h1>
            <p>
              Thank you! Your enquiry has been received. Cupcake Dreams Events And Party Planner will review
              your event details and get back to you shortly.
            </p>
            <a
              className="btn btn-whatsapp"
              href={whatsappLink(settings.whatsapp || settings.phone, waMessage)}
              target="_blank"
              rel="noreferrer"
            >
              Continue on WhatsApp
            </a>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="page">
      <SEO
        title="Check Availability"
        description="Enquire about event styling availability with Cupcake Dreams Events And Party Planner."
        path="/enquire"
      />
      <section className="page-hero">
        <div className="container">
          <p className="section-label">Enquire</p>
          <h1>Check Availability</h1>
          <p className="section-lead">
            This is an availability enquiry — not an automatic booking. We&apos;ll review your details and get
            back to you.
          </p>
        </div>
      </section>
      <section className="section">
        <div className="container enquire-layout">
          <form className="enquire-form" onSubmit={onSubmit}>
            <div className="form-grid">
              <label>
                Full Name *
                <input required value={form.name} onChange={(e) => update('name', e.target.value)} />
              </label>
              <label>
                Email *
                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(e) => update('email', e.target.value)}
                />
              </label>
              <label>
                Phone Number
                <input value={form.phone} onChange={(e) => update('phone', e.target.value)} />
              </label>
              <label>
                Event Type
                <select value={form.eventType} onChange={(e) => update('eventType', e.target.value)}>
                  <option value="">Select…</option>
                  {categories.map((c) => (
                    <option key={c._id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Event Date
                <input
                  type="date"
                  value={form.eventDate}
                  onChange={(e) => update('eventDate', e.target.value)}
                />
              </label>
              <label>
                Preferred Start Time
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => update('startTime', e.target.value)}
                />
              </label>
              <label className="full">
                Event Location
                <input value={form.location} onChange={(e) => update('location', e.target.value)} />
              </label>
              <label>
                Number of Guests
                <input
                  type="number"
                  min="1"
                  value={form.guestCount}
                  onChange={(e) => update('guestCount', e.target.value)}
                />
              </label>
              <label>
                Preferred Package
                <select
                  value={form.package}
                  onChange={(e) => {
                    const pkg = packages.find((p) => p._id === e.target.value);
                    update('package', e.target.value);
                    update('preferredPackageName', pkg?.name || '');
                  }}
                >
                  <option value="">Select…</option>
                  {packages.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Budget Range
                <select value={form.budgetRange} onChange={(e) => update('budgetRange', e.target.value)}>
                  <option value="">Select…</option>
                  {BUDGETS.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
              <label className="full">
                Theme / Colour Scheme
                <input value={form.theme} onChange={(e) => update('theme', e.target.value)} />
              </label>
            </div>

            <fieldset>
              <legend>Services Required</legend>
              <div className="checkbox-grid">
                {services.map((s) => (
                  <label key={s._id} className="check">
                    <input
                      type="checkbox"
                      checked={form.servicesRequired.includes(s.name)}
                      onChange={() => toggleService(s.name)}
                    />
                    {s.name}
                  </label>
                ))}
              </div>
            </fieldset>

            <label className="full">
              Additional Requirements / Message
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => update('message', e.target.value)}
              />
            </label>

            <label className="full">
              Inspiration image URLs (optional)
              <textarea
                rows={3}
                placeholder="Paste image URLs, one per line"
                value={form.inspirationUrls}
                onChange={(e) => update('inspirationUrls', e.target.value)}
              />
            </label>

            {error && <p className="form-error">{error}</p>}

            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Sending…' : 'Check Availability'}
            </button>
          </form>

          <aside className="enquire-aside">
            <h2>Prefer WhatsApp?</h2>
            <p>Message us with your event date and type — we&apos;ll take it from there.</p>
            <a
              className="btn btn-whatsapp"
              href={whatsappLink(settings.whatsapp || settings.phone, waMessage)}
              target="_blank"
              rel="noreferrer"
            >
              Chat on WhatsApp
            </a>
          </aside>
        </div>
      </section>
    </div>
  );
}
