import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api, setToken } from '../lib/api';

const SettingsContext = createContext(null);
const AuthContext = createContext(null);

const defaultSettings = {
  businessName: 'Cupcake Dreams Events And Party Planner',
  phone: '+44 7584 248854',
  email: 'hello@cupcakedreamsevents.example',
  whatsapp: '+447584248854',
  address: {
    line1: '13 Rossbank Rd',
    city: 'Port Glasgow',
    postcode: 'PA14 5AD',
    country: 'United Kingdom',
  },
  aboutText: '',
  openingInfo: 'Enquiries welcome — please get in touch to discuss your event.',
  socialLinks: {},
  seo: {
    title: 'Cupcake Dreams Events And Party Planner | Event Styling Port Glasgow',
    description:
      'Professional event dressing, party planning and decorations in Port Glasgow, Scotland.',
    ogImageUrl: '/images/hero.png',
  },
  bookingSettings: {
    defaultMessage:
      "Hi Cupcake Dreams Events And Party Planner, I'd like to enquire about an event.",
  },
};

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api('/settings')
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const value = useMemo(
    () => ({
      settings,
      loading,
      refreshSettings: () => api('/settings').then(setSettings),
      updateSettingsLocal: setSettings,
    }),
    [settings, loading]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('cd_token');
    if (!token) {
      setReady(true);
      return;
    }
    api('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setToken(null))
      .finally(() => setReady(true));
  }, []);

  async function login(email, password) {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } });
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }

  function logout() {
    setToken(null);
    setUser(null);
  }

  const value = useMemo(() => ({ user, ready, login, logout }), [user, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
