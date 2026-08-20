import {useState, type SubmitEvent} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {api, setToken} from '../lib/api';
import '../styles/auth.css';

export default function Login(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<String | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e: SubmitEvent){
        e.preventDefault();
        setError(null);
        setLoading(true);
        try{
            const res = await api<{access_token: string}>('/auth/login', {
                method: 'POST',
                body:{email, password}
            });
            setToken(res.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError(err instanceof Error ? err.message: 'Login failed.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
    <form className="auth-card" onSubmit={handleSubmit}>
      <h1>Welcome</h1>
      <p className="auth-subtitle">Log in to continue your creative workflow</p>

      <div className="field">
        <label htmlFor="email">Email Address</label>
        <input id="email" type="email" value={email}
          onChange={(e) => setEmail(e.target.value)} required />
      </div>

      <div className="field">
        <label htmlFor="password">Password</label>
        <input id="password" type="password" value={password}
          onChange={(e) => setPassword(e.target.value)} required />
      </div>

      {error && <p className="form-error" role="alert">{error}</p>}

      <button className="btn-primary" type="submit" disabled={loading}>
        {loading ? 'Logging in…' : 'Log In'}
      </button>

      <p className="auth-footer">
        New to TodoNote? <Link to="/register">Sign up</Link>
      </p>
    </form>
  </div>
    )
}