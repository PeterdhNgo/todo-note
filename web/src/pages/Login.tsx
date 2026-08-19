import {useState, type SubmitEvent} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import {api, setToken} from '../lib/api';

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
        <form onSubmit={handleSubmit}>
            <h1>Welcome</h1>
            <p>Login to continue your creative workflow</p>

            <label htmlFor="email">Email Address</label>
      <input
        id="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label htmlFor="password">Password</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in…' : 'Log In'}
      </button>

      <p>New to TodoNote? <Link to="/register">Sign up</Link></p>
        </form>
    )
}