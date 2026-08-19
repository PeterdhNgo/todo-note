import {useNavigate} from 'react-router-dom';
import {clearToken} from '../lib/api';

export default function Dashboard() {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Dashboard</h1>
            <button onClick={() => { clearToken(); navigate('/login'); }}>Log out</button>
        </div>
    );
}