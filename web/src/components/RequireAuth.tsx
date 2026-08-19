import {Navigate} from 'react-router-dom';
import {getToken} from '../lib/api';

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  return getToken() ? <>{children}</> : <Navigate to="/login" replace />;
}