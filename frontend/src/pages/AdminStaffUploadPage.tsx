import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';
import AdminStaffUpload from './AdminStaffUpload';
import AdminLogin from '../components/AdminLogin';

const AdminStaffUploadPage: React.FC = () => {
  const { isAuthenticated, login } = useAuth();

  const handleLogin = (token: string, user: any) => {
    login(token, user);
  };

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <AdminLayout>
      <AdminStaffUpload />
    </AdminLayout>
  );
};

export default AdminStaffUploadPage;
