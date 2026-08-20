import { useState, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setToken } from '../lib/api';
import '../styles/auth.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e: SubmitEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await api('/auth/register', { method: 'POST', body: { email, password } });
      const res = await api<{ access_token: string }>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setToken(res.access_token);
      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
    <form className="auth-card" onSubmit={handleSubmit}>
      <h1>Create Account</h1>
      <p className="auth-subtitle">Start organizing your thoughts with TodoNote</p>

      <div className="field">
        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} required minLength={10} />
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Creating account…' : 'Create Account'}
      </button>

      <p className="auth-footer">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </form>
    </div>
  );
}