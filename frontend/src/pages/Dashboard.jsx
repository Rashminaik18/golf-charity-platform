// pages/Dashboard.jsx — Logged-in user's personal dashboard
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import ScoreForm from '../components/ScoreForm';
import ScoreList from '../components/ScoreList';
import DrawResults from '../components/DrawResults';

const Dashboard = () => {
  const { user, fetchUser } = useAuth();
  const [scores, setScores] = useState([]);
  const [drawResults, setDrawResults] = useState([]);
  const [editScore, setEditScore] = useState(null);
  const [charities, setCharities] = useState([]);
  const [selectedCharity, setSelectedCharity] = useState('');
  const [contributionPct, setContributionPct] = useState(user?.contributionPercentage || 10);
  const [showChangeCharity, setShowChangeCharity] = useState(false);
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');

  useEffect(() => {
    fetchScores();
    fetchDrawResults();
    axios.get('http://localhost:5000/api/charities').then((r) => setCharities(r.data));
    setSelectedCharity(user?.selectedCharity?._id || '');
  }, []);

  const showMsg = (msg, type = 'success') => {
    setMessage(msg);
    setMsgType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  const fetchScores = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/scores');
      setScores(data);
    } catch (err) {
      console.error('Error fetching scores', err);
    }
  };

  const fetchDrawResults = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/draw/myresults');
      setDrawResults(data);
    } catch (err) {
      // Silently ignore if no draws yet
    }
  };

  const handleScoreAdded = () => {
    fetchScores(); // Refresh list (handles the 5-cap automatically from backend)
    showMsg('Score added successfully!');
  };

  const handleEditDone = () => {
    setEditScore(null);
    fetchScores();
    showMsg('Score updated!');
  };

  const handleDeleteScore = async (id) => {
    if (!window.confirm('Delete this score?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/scores/${id}`);
      fetchScores();
      showMsg('Score deleted.');
    } catch (err) {
      showMsg('Error deleting score.', 'error');
    }
  };

  const handleChangeCharity = async (e) => {
    e.preventDefault();
    try {
      await axios.put('http://localhost:5000/api/auth/me/charity', {
        selectedCharity,
        contributionPercentage: Number(contributionPct),
      });
      setShowChangeCharity(false);
      fetchUser(); // Refresh user context
      showMsg('Charity updated successfully!');
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error updating charity.', 'error');
    }
  };

  return (
    <div className="dashboard-page">
      <h1>🏌️ My Dashboard</h1>

      {message && (
        <div className={`alert alert-${msgType === 'error' ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* ─── Info Cards ─────────────────────────────────────────────────── */}
      <div className="dashboard-grid">

        {/* Subscription Card */}
        <div className="dash-card">
          <h3>Subscription</h3>
          <p>
            Status:{' '}
            <span className={`status-badge ${user?.subscription?.status}`}>
              {user?.subscription?.status?.toUpperCase()}
            </span>
          </p>
          <p>Plan: <strong>{user?.subscription?.type === 'yearly' ? 'Yearly' : 'Monthly'}</strong></p>
          <p>
            Renews:{' '}
            <strong>
              {new Date(user?.subscription?.renewalDate).toLocaleDateString('en-IE', {
                year: 'numeric', month: 'long', day: 'numeric',
              })}
            </strong>
          </p>
        </div>

        {/* Charity Card */}
        <div className="dash-card">
          <h3>My Charity</h3>
          <p>
            <strong>{user?.selectedCharity?.name || 'No charity selected'}</strong>
          </p>
          <p>
            Contribution: <strong>{user?.contributionPercentage}%</strong> of subscription
          </p>
          <button
            className="btn-secondary"
            style={{ marginTop: '0.5rem' }}
            onClick={() => setShowChangeCharity(!showChangeCharity)}
          >
            {showChangeCharity ? 'Cancel' : '🔄 Change Charity'}
          </button>

          {/* Change charity inline form */}
          {showChangeCharity && (
            <form className="charity-change-form" onSubmit={handleChangeCharity}>
              <select
                value={selectedCharity}
                onChange={(e) => setSelectedCharity(e.target.value)}
                required
              >
                <option value="">-- Select charity --</option>
                {charities.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
              <input
                type="number"
                min="10"
                max="100"
                value={contributionPct}
                onChange={(e) => setContributionPct(e.target.value)}
                placeholder="Contribution %"
              />
              <button type="submit" className="btn-primary">Update</button>
            </form>
          )}
        </div>
      </div>

      {/* ─── Score Management ─────────────────────────────────────────────── */}
      <div className="dash-section">
        <h2>⛳ My Golf Scores</h2>
        <p className="section-note">
          Only your latest 5 scores are kept. Adding a 6th score automatically removes the oldest one.
          Scores are displayed newest first.
        </p>

        {/* Show edit form or add form */}
        {editScore ? (
          <ScoreForm editScore={editScore} onEditDone={handleEditDone} />
        ) : (
          <ScoreForm onScoreAdded={handleScoreAdded} />
        )}

        <ScoreList scores={scores} onEdit={setEditScore} onDelete={handleDeleteScore} />
      </div>

      {/* ─── Draw Results ─────────────────────────────────────────────────── */}
      <div className="dash-section">
        <h2>🎰 My Draw Results</h2>
        <p className="section-note">
          Your participation results for the last 10 monthly draws.
          Match 3, 4, or 5 numbers with the drawn numbers to win!
        </p>
        <DrawResults results={drawResults} />
      </div>
    </div>
  );
};

export default Dashboard;
