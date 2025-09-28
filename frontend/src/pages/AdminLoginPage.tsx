import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLogin from '../components/AdminLogin';

const AdminLoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (token: string, user: any) => {
    login(token, user);
    // Small delay to ensure state is updated
    setTimeout(() => {
      navigate('/admin/staff-upload');
    }, 100);
  };

  return <AdminLogin onLogin={handleLogin} />;
};

export default AdminLoginPage;
