const API_BASE = '/api';

function getToken() {
  return localStorage.getItem('cd_token');
}

export function setToken(token) {
  if (token) localStorage.setItem('cd_token', token);
  else localStorage.removeItem('cd_token');
}

export async function api(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    err.data = data;
    throw err;
  }
  return data;
}

export function whatsappLink(phone, message) {
  const digits = String(phone || '').replace(/\D/g, '');
  const text = encodeURIComponent(message || '');
  return `https://wa.me/${digits}?text=${text}`;
}

export function telLink(phone) {
  return `tel:${String(phone || '').replace(/\s/g, '')}`;
}

export function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function priceLabel(startingPrice) {
  if (!startingPrice) return 'Price on request';
  return startingPrice;
}
