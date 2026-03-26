// pages/AdminDashboard.jsx — Full admin panel with tabs for users, charities, and draw
import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);
  const [drawResults, setDrawResults] = useState([]);
  const [activeTab, setActiveTab] = useState('users');
  const [charityForm, setCharityForm] = useState({ name: '', description: '', imageUrl: '' });
  const [editCharity, setEditCharity] = useState(null);
  const [selectedUserScores, setSelectedUserScores] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');

  useEffect(() => {
    fetchUsers();
    fetchCharities();
    fetchDrawResults();
  }, []);

  const showMsg = (msg, type = 'success') => {
    setMessage(msg);
    setMsgType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  const fetchUsers = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/admin/users');
      setUsers(data);
    } catch (err) {
      showMsg('Error loading users.', 'error');
    }
  };

  const fetchCharities = async () => {
    const { data } = await axios.get('http://localhost:5000/api/charities');
    setCharities(data);
  };

  const fetchDrawResults = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/draw/results');
      setDrawResults(data);
    } catch (err) {
      // No draws yet — silently skip
    }
  };

  // ─── Draw ────────────────────────────────────────────────────────────────
  const handleRunDraw = async () => {
    if (!window.confirm('Run the monthly draw now? This will generate 5 random numbers and check all active users.')) return;
    try {
      const { data } = await axios.post('http://localhost:5000/api/draw/run');
      showMsg(`✅ Draw complete! Numbers: ${data.numbers.join(', ')} | Winners: ${data.winners.length}`);
      fetchDrawResults();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error running draw.', 'error');
    }
  };

  // ─── Charities ───────────────────────────────────────────────────────────
  const handleCharitySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editCharity) {
        await axios.put(`http://localhost:5000/api/charities/${editCharity._id}`, charityForm);
        showMsg('Charity updated successfully!');
        setEditCharity(null);
      } else {
        await axios.post('http://localhost:5000/api/charities', charityForm);
        showMsg('Charity added successfully!');
      }
      setCharityForm({ name: '', description: '', imageUrl: '' });
      fetchCharities();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error saving charity.', 'error');
    }
  };

  const handleEditCharity = (c) => {
    setEditCharity(c);
    setCharityForm({ name: c.name, description: c.description, imageUrl: c.imageUrl || '' });
  };

  const handleCancelEdit = () => {
    setEditCharity(null);
    setCharityForm({ name: '', description: '', imageUrl: '' });
  };

  const handleDeleteCharity = async (id) => {
    if (!window.confirm('Delete this charity permanently?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/charities/${id}`);
      showMsg('Charity deleted.');
      fetchCharities();
    } catch (err) {
      showMsg('Error deleting charity.', 'error');
    }
  };

  // ─── Users ───────────────────────────────────────────────────────────────
  const handleViewScores = async (userId, userName) => {
    try {
      const { data } = await axios.get(`http://localhost:5000/api/admin/users/${userId}/scores`);
      setSelectedUserScores(data);
      setSelectedUserName(userName);
    } catch (err) {
      showMsg('Error fetching scores.', 'error');
    }
  };

  const handleToggleSubscription = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/subscription`, { status: newStatus });
      showMsg(`User subscription set to "${newStatus}".`);
      fetchUsers();
    } catch (err) {
      showMsg('Error updating subscription.', 'error');
    }
  };

  return (
    <div className="admin-page">
      <h1>⚙️ Admin Dashboard</h1>

      {message && (
        <div className={`alert alert-${msgType === 'error' ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* ─── Tab Navigation ──────────────────────────────────────────────── */}
      <div className="tab-nav">
        <button className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
          👥 Users ({users.length})
        </button>
        <button className={`tab-btn ${activeTab === 'charities' ? 'active' : ''}`} onClick={() => setActiveTab('charities')}>
          ❤️ Charities ({charities.length})
        </button>
        <button className={`tab-btn ${activeTab === 'draw' ? 'active' : ''}`} onClick={() => setActiveTab('draw')}>
          🎰 Monthly Draw
        </button>
      </div>

      {/* ─── Users Tab ───────────────────────────────────────────────────── */}
      {activeTab === 'users' && (
        <div className="admin-section">
          <h2>All Registered Users</h2>
          {users.length === 0 ? (
            <p className="no-data">No users registered yet.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Charity</th>
                  <th>Contribution</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u._id}>
                    <td>{u.name}</td>
                    <td>{u.email}</td>
                    <td style={{ textTransform: 'capitalize' }}>{u.subscription?.type}</td>
                    <td>
                      <span className={`status-badge ${u.subscription?.status}`}>
                        {u.subscription?.status}
                      </span>
                    </td>
                    <td>{u.selectedCharity?.name || '—'}</td>
                    <td>{u.contributionPercentage}%</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleViewScores(u._id, u.name)}>
                        Scores
                      </button>
                      <button
                        className={u.subscription?.status === 'active' ? 'btn-delete' : 'btn-primary'}
                        onClick={() => handleToggleSubscription(u._id, u.subscription?.status)}
                      >
                        {u.subscription?.status === 'active' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* User Scores Panel */}
          {selectedUserScores && (
            <div className="user-scores-modal">
              <h3>📊 Scores for: {selectedUserName}</h3>
              <button className="btn-secondary" onClick={() => setSelectedUserScores(null)} style={{ marginBottom: '1rem' }}>
                ✕ Close
              </button>
              {selectedUserScores.length === 0 ? (
                <p className="no-data">This user has no scores yet.</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr><th>#</th><th>Score</th><th>Date Played</th></tr>
                  </thead>
                  <tbody>
                    {selectedUserScores.map((s, i) => (
                      <tr key={s._id}>
                        <td>{i + 1}</td>
                        <td><strong>{s.value}</strong></td>
                        <td>{new Date(s.date).toLocaleDateString('en-IE', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── Charities Tab ───────────────────────────────────────────────── */}
      {activeTab === 'charities' && (
        <div className="admin-section">
          {/* Add/Edit Form */}
          <h2>{editCharity ? '✏️ Edit Charity' : '➕ Add New Charity'}</h2>
          <form className="admin-form" onSubmit={handleCharitySubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Charity Name</label>
                <input
                  type="text"
                  value={charityForm.name}
                  onChange={(e) => setCharityForm({ ...charityForm, name: e.target.value })}
                  required
                  placeholder="e.g. Irish Heart Foundation"
                />
              </div>
              <div className="form-group">
                <label>Image URL (optional)</label>
                <input
                  type="url"
                  value={charityForm.imageUrl}
                  onChange={(e) => setCharityForm({ ...charityForm, imageUrl: e.target.value })}
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea
                value={charityForm.description}
                onChange={(e) => setCharityForm({ ...charityForm, description: e.target.value })}
                required
                rows="3"
                placeholder="Describe the charity and its mission..."
              />
            </div>
            <button type="submit" className="btn-primary">
              {editCharity ? 'Update Charity' : 'Add Charity'}
            </button>
            {editCharity && (
              <button type="button" className="btn-secondary" style={{ marginLeft: '0.5rem' }} onClick={handleCancelEdit}>
                Cancel
              </button>
            )}
          </form>

          {/* Charity Table */}
          <h2>All Charities</h2>
          {charities.length === 0 ? (
            <p className="no-data">No charities yet. Add one above.</p>
          ) : (
            <table className="data-table">
              <thead>
                <tr><th>Name</th><th>Description</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {charities.map((c) => (
                  <tr key={c._id}>
                    <td><strong>{c.name}</strong></td>
                    <td>{c.description.length > 80 ? c.description.substring(0, 80) + '...' : c.description}</td>
                    <td>
                      <button className="btn-edit" onClick={() => handleEditCharity(c)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteCharity(c._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* ─── Draw Tab ────────────────────────────────────────────────────── */}
      {activeTab === 'draw' && (
        <div className="admin-section">
          <h2>🎰 Run Monthly Draw</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem' }}>
            The draw generates 5 random numbers (1–45) and automatically checks all active users' scores.
            Users with 3, 4, or 5 matching scores are recorded as winners.
          </p>
          <button className="btn-primary btn-large" onClick={handleRunDraw}>
            🎰 Run Monthly Draw Now
          </button>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>📋 Draw History</h3>
          {drawResults.length === 0 ? (
            <p className="no-data">No draws have been run yet.</p>
          ) : (
            drawResults.map((d, i) => (
              <div key={i} className="draw-result-card" style={{ marginBottom: '1rem' }}>
                <h4>
                  Draw: {new Date(d.drawDate).toLocaleDateString('en-IE', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </h4>
                <p>
                  <strong>Numbers Drawn:</strong>{' '}
                  {d.numbers?.map((n) => (
                    <span key={n} style={{ display: 'inline-block', background: '#e8f5ec', borderRadius: '4px', padding: '0 8px', marginRight: '4px', fontWeight: 700 }}>
                      {n}
                    </span>
                  ))}
                </p>
                <p><strong>Winners: {d.winners?.length || 0}</strong></p>
                {d.winners && d.winners.length > 0 ? (
                  <table className="data-table" style={{ marginTop: '0.5rem' }}>
                    <thead>
                      <tr><th>User</th><th>Matches</th><th>Matched Numbers</th></tr>
                    </thead>
                    <tbody>
                      {d.winners.map((w, j) => (
                        <tr key={j}>
                          <td>{w.userName}</td>
                          <td>
                            <span className="status-badge active">{w.matchCount} Match{w.matchCount > 1 ? 'es' : ''}</span>
                          </td>
                          <td>{w.matchedNumbers?.join(', ')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="no-data">No winners this draw (need 3+ matches).</p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
