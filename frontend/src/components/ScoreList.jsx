// components/ScoreList.jsx — Display scores in a table (newest first)
const ScoreList = ({ scores, onEdit, onDelete }) => {
  if (!scores || scores.length === 0) {
    return <p className="no-data">No scores yet. Add your first golf score above!</p>;
  }

  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>#</th>
          <th>Score</th>
          <th>Date Played</th>
          {(onEdit || onDelete) && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {scores.map((s, index) => (
          <tr key={s._id}>
            <td>{index + 1}</td>
            <td><strong>{s.value}</strong></td>
            <td>{new Date(s.date).toLocaleDateString('en-IE', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
            {(onEdit || onDelete) && (
              <td>
                {onEdit && (
                  <button className="btn-edit" onClick={() => onEdit(s)}>Edit</button>
                )}
                {onDelete && (
                  <button className="btn-delete" onClick={() => onDelete(s._id)}>Delete</button>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ScoreList;
