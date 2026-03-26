// components/AdminRoute.jsx — Redirects non-admin users away from admin pages
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  // Must be logged in AND have admin role
  if (!user || user.role !== 'admin') return <Navigate to="/" />;

  return children;
};

export default AdminRoute;
