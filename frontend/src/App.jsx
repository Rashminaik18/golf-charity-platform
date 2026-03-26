// App.jsx — Root component with router and all page routes
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CharityList from './pages/CharityList';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <AuthProvider>
      <Router>
        {/* Navbar is always visible */}
        <Navbar />

        <main className="main-content">
          <Routes>
            {/* ── Public Routes ─────────────────────────────────────────── */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/charities" element={<CharityList />} />

            {/* ── Protected User Route ──────────────────────────────────── */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />

            {/* ── Admin-Only Route ──────────────────────────────────────── */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            {/* ── 404 Fallback ──────────────────────────────────────────── */}
            <Route
              path="*"
              element={
                <div style={{ textAlign: 'center', padding: '4rem' }}>
                  <h2>404 — Page Not Found</h2>
                  <a href="/" style={{ color: 'var(--green)' }}>Go Home</a>
                </div>
              }
            />
          </Routes>
        </main>
      </Router>
    </AuthProvider>
  );
}

export default App;
