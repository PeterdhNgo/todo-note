import { useState, type SubmitEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, setToken } from '../lib/api';

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
    <form onSubmit={handleSubmit}>
      <h1>Create Account</h1>
      <p>Start organizing your thoughts with TodoNote</p>

      <label htmlFor="email">Email Address</label>
      <input id="email" type="email" value={email}
        onChange={(e) => setEmail(e.target.value)} required />

      <label htmlFor="password">Password</label>
      <input id="password" type="password" value={password}
        onChange={(e) => setPassword(e.target.value)} required minLength={10} />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Creating account…' : 'Create Account'}
      </button>

      <p>Already have an account? <Link to="/login">Log in</Link></p>
    </form>
  );
}