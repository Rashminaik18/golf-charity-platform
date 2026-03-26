// pages/AdminDashboard.jsx — Full admin panel with tabs for users, charities, and draw
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const API = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { user } = useAuth();

  // ─── State ────────────────────────────────────────────────────────────────
  const [users, setUsers] = useState([]);
  const [charities, setCharities] = useState([]);
  const [drawResults, setDrawResults] = useState([]);
  const [activeTab, setActiveTab] = useState('charities');

  // Charity form state
  const [charityForm, setCharityForm] = useState({ name: '', description: '', imageUrl: '' });
  const [editCharity, setEditCharity] = useState(null);   // null = "add mode"
  const [charityLoading, setCharityLoading] = useState(false);

  // User panel state
  const [selectedUserScores, setSelectedUserScores] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState('');

  // Toast notifications
  const [message, setMessage] = useState('');
  const [msgType, setMsgType] = useState('success');

  // ─── On mount ────────────────────────────────────────────────────────────
  useEffect(() => {
    fetchCharities();
    fetchUsers();
    fetchDrawResults();
  }, []);

  // ─── Helpers ─────────────────────────────────────────────────────────────
  const showMsg = (msg, type = 'success') => {
    setMessage(msg);
    setMsgType(type);
    setTimeout(() => setMessage(''), 4000);
  };

  // ─── Charity CRUD ─────────────────────────────────────────────────────────
  const fetchCharities = async () => {
    try {
      const { data } = await axios.get(`${API}/charities`);
      setCharities(data);
    } catch (err) {
      showMsg('Error loading charities.', 'error');
    }
  };

  const handleCharitySubmit = async (e) => {
    e.preventDefault();
    setCharityLoading(true);
    try {
      if (editCharity) {
        await axios.put(`${API}/charities/${editCharity._id}`, charityForm);
        showMsg('✅ Charity updated successfully!');
        setEditCharity(null);
      } else {
        await axios.post(`${API}/charities`, charityForm);
        showMsg('✅ Charity added successfully!');
      }
      setCharityForm({ name: '', description: '', imageUrl: '' });
      fetchCharities();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error saving charity.', 'error');
    } finally {
      setCharityLoading(false);
    }
  };

  const handleEditCharity = (c) => {
    setEditCharity(c);
    setCharityForm({ name: c.name, description: c.description, imageUrl: c.imageUrl || '' });
    // Scroll to form
    document.getElementById('charity-form-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleCancelEdit = () => {
    setEditCharity(null);
    setCharityForm({ name: '', description: '', imageUrl: '' });
  };

  const handleDeleteCharity = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this charity?')) return;
    try {
      await axios.delete(`${API}/charities/${id}`);
      showMsg('🗑️ Charity deleted.');
      fetchCharities();
    } catch (err) {
      showMsg('Error deleting charity.', 'error');
    }
  };

  // ─── Users ────────────────────────────────────────────────────────────────
  const fetchUsers = async () => {
    try {
      const { data } = await axios.get(`${API}/admin/users`);
      setUsers(data);
    } catch (err) {
      showMsg('Error loading users.', 'error');
    }
  };

  const handleViewScores = async (userId, userName) => {
    try {
      const { data } = await axios.get(`${API}/admin/users/${userId}/scores`);
      setSelectedUserScores(data);
      setSelectedUserName(userName);
    } catch (err) {
      showMsg('Error fetching scores.', 'error');
    }
  };

  const handleToggleSubscription = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      await axios.put(`${API}/admin/users/${userId}/subscription`, { status: newStatus });
      showMsg(`User subscription set to "${newStatus}".`);
      fetchUsers();
    } catch (err) {
      showMsg('Error updating subscription.', 'error');
    }
  };

  // ─── Draw ─────────────────────────────────────────────────────────────────
  const fetchDrawResults = async () => {
    try {
      const { data } = await axios.get(`${API}/draw/results`);
      setDrawResults(data);
    } catch {
      // No draws yet — silently skip
    }
  };

  const handleRunDraw = async () => {
    if (!window.confirm('Run the monthly draw now? This will generate 5 random numbers and check all active users.')) return;
    try {
      const { data } = await axios.post(`${API}/draw/run`);
      showMsg(`🎰 Draw complete! Numbers: ${data.numbers.join(', ')} | Winners: ${data.winners.length}`);
      fetchDrawResults();
    } catch (err) {
      showMsg(err.response?.data?.message || 'Error running draw.', 'error');
    }
  };

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="admin-page">

      {/* ─── Page Header ───────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, var(--green-dark) 0%, var(--green) 100%)',
        borderRadius: 'var(--radius)',
        padding: '2rem 2rem 1.75rem',
        marginBottom: '2rem',
        color: 'var(--white)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <span style={{ fontSize: '1.8rem' }}>⚙️</span>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: 'var(--white)', margin: 0 }}>
            Admin Dashboard
          </h1>
        </div>
        <p style={{ opacity: 0.85, fontSize: '0.95rem', margin: 0 }}>
          Welcome back, <strong>{user?.name || 'Admin'}</strong>! Manage charities, users, and monthly draws from here.
        </p>

        {/* Quick-stats strip */}
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Charities', value: charities.length, icon: '❤️' },
            { label: 'Users', value: users.length, icon: '👥' },
            { label: 'Draws Run', value: drawResults.length, icon: '🎰' },
          ].map(({ label, value, icon }) => (
            <div key={label} style={{
              background: 'rgba(255,255,255,0.18)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.6rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backdropFilter: 'blur(4px)',
            }}>
              <span>{icon}</span>
              <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{value}</span>
              <span style={{ fontSize: '0.82rem', opacity: 0.8 }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Toast Alert ───────────────────────────────────────────────────── */}
      {message && (
        <div className={`alert alert-${msgType === 'error' ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {/* ─── Tab Navigation ────────────────────────────────────────────────── */}
      <div className="tab-nav">
        <button
          id="tab-charities"
          className={`tab-btn ${activeTab === 'charities' ? 'active' : ''}`}
          onClick={() => setActiveTab('charities')}
        >
          ❤️ Charities ({charities.length})
        </button>
        <button
          id="tab-users"
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users ({users.length})
        </button>
        <button
          id="tab-draw"
          className={`tab-btn ${activeTab === 'draw' ? 'active' : ''}`}
          onClick={() => setActiveTab('draw')}
        >
          🎰 Monthly Draw
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          CHARITIES TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'charities' && (
        <div className="admin-section">

          {/* ── Add / Edit Form ─────────────────────────────────────────────── */}
          <div id="charity-form-section">
            <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              {editCharity ? '✏️ Edit Charity' : '➕ Add New Charity'}
            </h2>

            <form className="admin-form" onSubmit={handleCharitySubmit}>
              <div className="form-row">
                {/* Name */}
                <div className="form-group">
                  <label htmlFor="charity-name">Charity Name *</label>
                  <input
                    id="charity-name"
                    type="text"
                    value={charityForm.name}
                    onChange={(e) => setCharityForm({ ...charityForm, name: e.target.value })}
                    required
                    placeholder="e.g. Irish Heart Foundation"
                  />
                </div>

                {/* Image URL */}
                <div className="form-group">
                  <label htmlFor="charity-image">Image URL (optional)</label>
                  <input
                    id="charity-image"
                    type="url"
                    value={charityForm.imageUrl}
                    onChange={(e) => setCharityForm({ ...charityForm, imageUrl: e.target.value })}
                    placeholder="https://example.com/logo.png"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="form-group">
                <label htmlFor="charity-description">Description *</label>
                <textarea
                  id="charity-description"
                  value={charityForm.description}
                  onChange={(e) => setCharityForm({ ...charityForm, description: e.target.value })}
                  required
                  rows="3"
                  placeholder="Describe the charity and its mission..."
                />
              </div>

              {/* Image preview */}
              {charityForm.imageUrl && (
                <div style={{ marginBottom: '1rem' }}>
                  <img
                    src={charityForm.imageUrl}
                    alt="Preview"
                    onError={(e) => { e.target.style.display = 'none'; }}
                    style={{ height: 70, width: 'auto', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-200)' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  id="charity-submit-btn"
                  type="submit"
                  className="btn-primary"
                  disabled={charityLoading}
                >
                  {charityLoading ? 'Saving…' : editCharity ? 'Update Charity' : 'Add Charity'}
                </button>
                {editCharity && (
                  <button
                    id="charity-cancel-btn"
                    type="button"
                    className="btn-secondary"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ── Charity Table ────────────────────────────────────────────────── */}
          <h2 style={{ marginTop: '0.5rem' }}>All Charities</h2>

          {charities.length === 0 ? (
            <p className="no-data">No charities yet. Use the form above to add one.</p>
          ) : (
            <>
              {/* Card Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}>
                {charities.map((c) => (
                  <div
                    key={c._id}
                    style={{
                      background: 'var(--white)',
                      borderRadius: 'var(--radius)',
                      border: '1px solid var(--gray-200)',
                      boxShadow: 'var(--shadow-sm)',
                      overflow: 'hidden',
                      transition: 'box-shadow var(--transition), transform var(--transition)',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    {/* Card Image */}
                    {c.imageUrl ? (
                      <img
                        src={c.imageUrl}
                        alt={c.name}
                        style={{ width: '100%', height: 130, objectFit: 'cover' }}
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    ) : (
                      <div style={{
                        height: 80,
                        background: 'linear-gradient(135deg, var(--green-pale) 0%, var(--green-light) 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2rem',
                      }}>
                        ❤️
                      </div>
                    )}

                    <div style={{ padding: '1rem' }}>
                      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--green-dark)', marginBottom: '0.4rem' }}>
                        {c.name}
                      </h3>
                      <p style={{ fontSize: '0.84rem', color: 'var(--gray-600)', marginBottom: '0.9rem', lineHeight: 1.5 }}>
                        {c.description.length > 90 ? c.description.substring(0, 90) + '…' : c.description}
                      </p>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <button
                          id={`edit-charity-${c._id}`}
                          className="btn-edit"
                          onClick={() => handleEditCharity(c)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          id={`delete-charity-${c._id}`}
                          className="btn-delete"
                          onClick={() => handleDeleteCharity(c._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Also show compact table view below */}
              <details>
                <summary style={{
                  cursor: 'pointer',
                  fontSize: '0.88rem',
                  fontWeight: 600,
                  color: 'var(--green-dark)',
                  marginBottom: '0.75rem',
                  userSelect: 'none',
                }}>
                  📋 Table View
                </summary>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Description</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {charities.map((c, i) => (
                      <tr key={c._id}>
                        <td style={{ color: 'var(--gray-400)', fontWeight: 600 }}>{i + 1}</td>
                        <td><strong>{c.name}</strong></td>
                        <td>{c.description.length > 80 ? c.description.substring(0, 80) + '…' : c.description}</td>
                        <td>
                          <button className="btn-edit" onClick={() => handleEditCharity(c)}>Edit</button>
                          <button className="btn-delete" onClick={() => handleDeleteCharity(c._id)}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </details>
            </>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          USERS TAB
      ══════════════════════════════════════════════════════════════════════ */}
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
                    <td><strong>{u.name}</strong></td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>{u.email}</td>
                    <td style={{ textTransform: 'capitalize' }}>{u.subscription?.type}</td>
                    <td>
                      <span className={`status-badge ${u.subscription?.status}`}>
                        {u.subscription?.status}
                      </span>
                    </td>
                    <td>{u.selectedCharity?.name || '—'}</td>
                    <td>{u.contributionPercentage}%</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleViewScores(u._id, u.name)}
                      >
                        Scores
                      </button>
                      <button
                        className={u.subscription?.status === 'active' ? 'btn-delete' : 'btn-primary'}
                        style={{ fontSize: '0.78rem', padding: '0.3rem 0.6rem' }}
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

          {/* ── User Scores Panel ────────────────────────────────────────────── */}
          {selectedUserScores && (
            <div className="user-scores-modal">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3>📊 Scores for: <em>{selectedUserName}</em></h3>
                <button
                  className="btn-secondary"
                  style={{ padding: '0.3rem 0.75rem', fontSize: '0.85rem' }}
                  onClick={() => { setSelectedUserScores(null); setSelectedUserName(''); }}
                >
                  ✕ Close
                </button>
              </div>

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
                        <td>
                          {new Date(s.date).toLocaleDateString('en-IE', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          DRAW TAB
      ══════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'draw' && (
        <div className="admin-section">
          <h2>🎰 Run Monthly Draw</h2>
          <p style={{ color: 'var(--gray-600)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
            The draw generates <strong>5 random numbers (1–45)</strong> and automatically checks all active users' scores.
            Users with 3, 4, or 5 matching scores are recorded as winners.
          </p>

          <button
            id="run-draw-btn"
            className="btn-primary btn-large"
            onClick={handleRunDraw}
          >
            🎰 Run Monthly Draw Now
          </button>

          <h3 style={{ marginTop: '2rem', marginBottom: '1rem' }}>📋 Draw History</h3>

          {drawResults.length === 0 ? (
            <p className="no-data">No draws have been run yet.</p>
          ) : (
            drawResults.map((d, i) => (
              <div key={i} className="draw-result-card" style={{ marginBottom: '1rem' }}>
                <h4>
                  Draw:{' '}
                  {new Date(d.drawDate).toLocaleDateString('en-IE', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                  })}
                </h4>
                <p style={{ marginTop: '0.4rem' }}>
                  <strong>Numbers Drawn: </strong>
                  {d.numbers?.map((n) => (
                    <span
                      key={n}
                      style={{
                        display: 'inline-block',
                        background: 'var(--green-pale)',
                        borderRadius: '4px',
                        padding: '0 8px',
                        marginRight: '4px',
                        fontWeight: 700,
                        color: 'var(--green-dark)',
                      }}
                    >
                      {n}
                    </span>
                  ))}
                </p>
                <p style={{ marginTop: '0.35rem' }}>
                  <strong>Winners: {d.winners?.length || 0}</strong>
                </p>

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
                            <span className="status-badge active">
                              {w.matchCount} Match{w.matchCount > 1 ? 'es' : ''}
                            </span>
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
