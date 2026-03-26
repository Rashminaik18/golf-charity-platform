// pages/CharityList.jsx — Public charity listing page
import { useState, useEffect } from 'react';
import axios from 'axios';
import CharityCard from '../components/CharityCard';

const CharityList = () => {
  const [charities, setCharities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/charities')
      .then((r) => setCharities(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <h1>🏥 Supported Charities</h1>
      <p className="page-sub">
        Every Golf Charity member contributes a minimum of 10% of their subscription fee
        to their chosen charity every month.
      </p>

      {loading ? (
        <p className="loading">Loading charities...</p>
      ) : charities.length === 0 ? (
        <p className="no-data">
          No charities have been added yet. Check back soon!
        </p>
      ) : (
        <div className="charity-grid">
          {charities.map((c) => (
            <CharityCard key={c._id} charity={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CharityList;
