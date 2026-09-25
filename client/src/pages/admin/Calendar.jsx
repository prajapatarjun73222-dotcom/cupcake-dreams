import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../lib/api';
import './Admin.css';

export default function Calendar() {
  const [view, setView] = useState('month');
  const [cursor, setCursor] = useState(() => new Date());
  const [bookings, setBookings] = useState([]);

  const range = useMemo(() => {
    const y = cursor.getFullYear();
    const m = cursor.getMonth();
    if (view === 'day') {
      const from = new Date(y, m, cursor.getDate());
      const to = new Date(y, m, cursor.getDate(), 23, 59, 59);
      return { from, to };
    }
    if (view === 'week') {
      const day = cursor.getDay();
      const from = new Date(y, m, cursor.getDate() - day);
      const to = new Date(from);
      to.setDate(from.getDate() + 6);
      to.setHours(23, 59, 59);
      return { from, to };
    }
    const from = new Date(y, m, 1);
    const to = new Date(y, m + 1, 0, 23, 59, 59);
    return { from, to };
  }, [cursor, view]);

  useEffect(() => {
    api(
      `/calendar?view=${view}&from=${range.from.toISOString()}&to=${range.to.toISOString()}`
    )
      .then((data) => setBookings(data.bookings || []))
      .catch(() => {});
  }, [range, view]);

  const days = useMemo(() => {
    if (view === 'day') return [new Date(cursor)];
    if (view === 'week') {
      const start = new Date(range.from);
      return Array.from({ length: 7 }, (_, i) => {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        return d;
      });
    }
    const start = new Date(range.from);
    const startPad = start.getDay();
    const total = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const cells = [];
    for (let i = 0; i < startPad; i += 1) cells.push(null);
    for (let d = 1; d <= total; d += 1) {
      cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
    }
    return cells;
  }, [view, cursor, range]);

  function bookingsOn(day) {
    if (!day) return [];
    return bookings.filter((b) => {
      const d = new Date(b.eventDate);
      return (
        d.getFullYear() === day.getFullYear() &&
        d.getMonth() === day.getMonth() &&
        d.getDate() === day.getDate()
      );
    });
  }

  function shift(delta) {
    const next = new Date(cursor);
    if (view === 'day') next.setDate(next.getDate() + delta);
    else if (view === 'week') next.setDate(next.getDate() + delta * 7);
    else next.setMonth(next.getMonth() + delta);
    setCursor(next);
  }

  return (
    <div className="admin-page">
      <h1>Calendar</h1>
      <div className="admin-toolbar">
        <button type="button" onClick={() => setView('month')}>
          Month
        </button>
        <button type="button" onClick={() => setView('week')}>
          Week
        </button>
        <button type="button" onClick={() => setView('day')}>
          Day
        </button>
        <button type="button" onClick={() => shift(-1)}>
          Prev
        </button>
        <button type="button" onClick={() => shift(1)}>
          Next
        </button>
        <strong>
          {cursor.toLocaleDateString('en-GB', {
            month: 'long',
            year: 'numeric',
            ...(view !== 'month' ? { day: 'numeric' } : {}),
          })}
        </strong>
      </div>
      <div className="calendar-wrap">
        {view === 'month' && (
          <div className="calendar-grid" style={{ marginBottom: '0.5rem' }}>
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
              <strong key={d}>{d}</strong>
            ))}
          </div>
        )}
        <div
          className="calendar-grid"
          style={{ gridTemplateColumns: view === 'day' ? '1fr' : 'repeat(7, 1fr)' }}
        >
          {days.map((day, idx) => (
            <div key={day ? day.toISOString() : `pad-${idx}`} className="cal-cell">
              {day && <strong>{day.getDate()}</strong>}
              {bookingsOn(day).map((b) => (
                <Link
                  key={b._id}
                  to="/admin/bookings"
                  className={`cal-event ${b.status}`}
                  title="Edit date/status in Bookings"
                >
                  {b.title || b.customer?.name || 'Booking'}
                </Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <p style={{ color: 'var(--muted)', marginTop: '1rem' }}>
        To move a booking date or change status, open Bookings and edit the entry.
      </p>
    </div>
  );
}
