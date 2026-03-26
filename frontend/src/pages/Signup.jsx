// pages/Signup.jsx — Registration form with charity selection and subscription plan
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    subscriptionType: 'monthly',
    selectedCharity: '',
    contributionPercentage: 10,
  });
  const [charities, setCharities] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  // Load charities for selection
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/charities')
      .then((r) => setCharities(r.data))
      .catch(() => {});
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.contributionPercentage < 10) {
      return setError('Contribution percentage must be at least 10%');
    }
    if (!form.selectedCharity) {
      return setError('Please select a charity');
    }

    setLoading(true);
    try {
      await signup(form);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card signup-card">
        <h2>⛳ Create Account</h2>
        <p className="auth-sub">Join the Golf Charity community today.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Name & Email */}
          <div className="form-row">
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Smith"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password (min. 6 characters)</label>
            <input
              type="password"
              name="password"
              placeholder="Choose a strong password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
            />
          </div>

          {/* Subscription Plan & Contribution */}
          <div className="form-row">
            <div className="form-group">
              <label>Subscription Plan</label>
              <select name="subscriptionType" value={form.subscriptionType} onChange={handleChange}>
                <option value="monthly">Monthly (€10/month)</option>
                <option value="yearly">Yearly (€100/year)</option>
              </select>
            </div>
            <div className="form-group">
              <label>Charity Contribution % (min 10%)</label>
              <input
                type="number"
                name="contributionPercentage"
                min="10"
                max="100"
                value={form.contributionPercentage}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Charity Selection */}
          <div className="form-group">
            <label>Select Your Charity</label>
            <select
              name="selectedCharity"
              value={form.selectedCharity}
              onChange={handleChange}
              required
            >
              <option value="">-- Choose a charity to support --</option>
              {charities.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
            {charities.length === 0 && (
              <p style={{ fontSize: '0.8rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                No charities available yet. An admin must add charities first.
              </p>
            )}
          </div>

          <button type="submit" className="btn-primary btn-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
