// components/PrivateRoute.jsx — Redirects unauthenticated users to login
// Also blocks users with inactive subscriptions
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div className="loading">Loading...</div>;

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" />;

  // Logged in but subscription inactive → show message
  if (user.subscription?.status !== 'active') {
    return (
      <div className="main-content">
        <div className="restricted-msg">
          <h2>🔒 Subscription Inactive</h2>
          <p>Your subscription is currently inactive. Please contact an admin to reactivate your account.</p>
        </div>
      </div>
    );
  }

  return children;
};

export default PrivateRoute;
