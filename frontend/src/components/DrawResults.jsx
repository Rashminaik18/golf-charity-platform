// components/DrawResults.jsx — Display a user's personal draw history
const DrawResults = ({ results }) => {
  if (!results || results.length === 0) {
    return <p className="no-data">No draw results yet. Results appear here after each monthly draw.</p>;
  }

  return (
    <div className="draw-results">
      {results.map((r, i) => (
        <div key={i} className="draw-result-card">
          <h4>
            Draw: {new Date(r.drawDate).toLocaleDateString('en-IE', {
              year: 'numeric', month: 'long', day: 'numeric'
            })}
          </h4>
          <p>
            <strong>Numbers Drawn:</strong>{' '}
            {r.numbers?.map((n) => (
              <span key={n} style={{ display: 'inline-block', background: '#e8f5ec', borderRadius: '4px', padding: '0 6px', marginRight: '4px', fontWeight: 700 }}>{n}</span>
            ))}
          </p>

          {r.myResult ? (
            <span className="win-badge">
              🏆 {r.myResult.matchCount} Match{r.myResult.matchCount > 1 ? 'es' : ''}!
              Matched: {r.myResult.matchedNumbers?.join(', ')}
            </span>
          ) : (
            <p className="no-match">No match this draw — keep playing!</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DrawResults;
