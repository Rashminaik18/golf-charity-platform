// pages/Home.jsx — Public landing page
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-page">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section className="hero">
        <h1>⛳ Golf Charity Subscription Platform</h1>
        <p>
          Join our community of golfers making a difference. Submit your scores,
          participate in monthly draws, and contribute to your chosen charity.
        </p>
        <div className="hero-buttons">
          <Link to="/signup" className="btn-primary">Get Started Free</Link>
          <Link to="/charities" className="btn-secondary">View Charities</Link>
        </div>
      </section>

      {/* ─── Features Section ────────────────────────────────────────────── */}
      <section className="features">
        <div className="feature-card">
          <span className="feature-icon">🏌️</span>
          <h3>Submit Scores</h3>
          <p>Enter your last 5 golf scores to participate in each month's prize draw.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">🎯</span>
          <h3>Monthly Draw</h3>
          <p>5 random numbers drawn each month. Match 3 or more of your scores to win!</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">❤️</span>
          <h3>Support Charity</h3>
          <p>A minimum 10% of your subscription goes directly to your chosen charity.</p>
        </div>
        <div className="feature-card">
          <span className="feature-icon">📊</span>
          <h3>Track Progress</h3>
          <p>View your participation history and all draw results in your personal dashboard.</p>
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────────────────────────── */}
      <section className="plans-section">
        <h2>Choose Your Plan</h2>
        <div className="plans">
          <div className="plan-card">
            <h3>Monthly</h3>
            <p className="plan-price">€10<span style={{ fontSize: '1rem', fontWeight: 400 }}>/mo</span></p>
            <ul>
              <li>✓ Monthly draw entry</li>
              <li>✓ Choose your charity</li>
              <li>✓ Score tracking dashboard</li>
            </ul>
            <Link to="/signup" className="btn-primary">Sign Up</Link>
          </div>

          <div className="plan-card featured">
            <div className="badge">Best Value</div>
            <h3>Yearly</h3>
            <p className="plan-price">€100<span style={{ fontSize: '1rem', fontWeight: 400 }}>/yr</span></p>
            <ul>
              <li>✓ All Monthly benefits</li>
              <li>✓ 2 months free (save €20)</li>
              <li>✓ Priority draw participation</li>
            </ul>
            <Link to="/signup" className="btn-primary">Sign Up</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
