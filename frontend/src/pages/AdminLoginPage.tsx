import React, { useEffect } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from '../components/AdminLogin';

const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const from = (location.state as any)?.from?.pathname || '/admin';
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, location]);

  const handleLogin = (token: string, user: any) => {
    login(token, user);
    
    // Get the intended destination from location state (if user was redirected from a protected route)
    // Otherwise, default to the admin dashboard
    const from = (location.state as any)?.from?.pathname || '/admin';
    
    // Small delay to ensure auth state is updated before navigation
    setTimeout(() => {
      navigate(from, { replace: true });
    }, 100);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return null; // Or a loading spinner
  }

  // Redirect if already authenticated
  if (isAuthenticated) {
    const from = (location.state as any)?.from?.pathname || '/admin';
    return <Navigate to={from} replace />;
  }

  return <AdminLogin onLogin={handleLogin} />;
};

export default AdminLoginPage;
