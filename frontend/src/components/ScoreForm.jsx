// components/ScoreForm.jsx — Add or edit a golf score
import { useState } from 'react';
import axios from 'axios';

const ScoreForm = ({ onScoreAdded, editScore, onEditDone }) => {
  const [value, setValue] = useState(editScore ? editScore.value : '');
  const [date, setDate] = useState(
    editScore ? editScore.date?.split('T')[0] : new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (Number(value) < 1 || Number(value) > 45) {
      return setError('Score must be between 1 and 45');
    }

    setLoading(true);
    try {
      if (editScore) {
        // Update existing score
        await axios.put(`http://localhost:5000/api/scores/${editScore._id}`, {
          value: Number(value),
          date,
        });
        onEditDone();
      } else {
        // Add new score
        const { data } = await axios.post('http://localhost:5000/api/scores', {
          value: Number(value),
          date,
        });
        onScoreAdded(data);
        setValue('');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving score');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="score-form" onSubmit={handleSubmit}>
      <h3>{editScore ? '✏️ Edit Score' : '➕ Add Score'}</h3>
      {error && <p className="error">{error}</p>}

      <div className="form-row">
        <div className="form-group">
          <label>Score Value (1–45)</label>
          <input
            type="number"
            min="1"
            max="45"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Date Played</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
      </div>

      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? 'Saving...' : editScore ? 'Update Score' : 'Add Score'}
      </button>
      {editScore && (
        <button
          type="button"
          className="btn-secondary"
          onClick={onEditDone}
          style={{ marginLeft: '0.5rem' }}
        >
          Cancel
        </button>
      )}
    </form>
  );
};

export default ScoreForm;
