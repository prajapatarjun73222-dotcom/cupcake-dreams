import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AppContext';
import './Admin.css';

export default function AdminLogin() {
  const { user, ready, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@cupcakedreams.local');
  const [password, setPassword] = useState('ChangeMe123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (ready && user) return <Navigate to="/admin" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="admin-login">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>Admin Login</h1>
        <p>Cupcake Dreams Events dashboard</p>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        {error && <p className="form-error">{error}</p>}
        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
