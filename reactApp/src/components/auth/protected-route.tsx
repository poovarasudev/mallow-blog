import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '@/store';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, token } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!user || !token) {
      navigate('/login', {
        replace: true,
        state: { from: location.pathname }
      });
    }
  }, [user, token, navigate, location]);

  if (!user || !token) return null;

  return <>{children}</>;
}