// components/Navbar.jsx — Responsive navigation bar
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">⛳ GolfCharity</Link>
      </div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/charities">Charities</Link></li>

        {/* Show Login/Signup only when not logged in */}
        {!user && <li><Link to="/login">Login</Link></li>}
        {!user && <li><Link to="/signup">Sign Up</Link></li>}

        {/* Logged-in regular user */}
        {user && user.role === 'user' && (
          <li><Link to="/dashboard">Dashboard</Link></li>
        )}

        {/* Admin user */}
        {user && user.role === 'admin' && (
          <li><Link to="/admin">Admin Panel</Link></li>
        )}

        {/* Logout button */}
        {user && (
          <li>
            <button className="btn-logout" onClick={handleLogout}>
              Logout ({user.name?.split(' ')[0]})
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
