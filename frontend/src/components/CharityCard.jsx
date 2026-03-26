// components/CharityCard.jsx — Display a charity with optional selection
const CharityCard = ({ charity, onSelect, selected }) => {
  return (
    <div className={`charity-card ${selected ? 'selected' : ''}`}>
      {/* Show image only if imageUrl is provided */}
      {charity.imageUrl && (
        <img src={charity.imageUrl} alt={charity.name} className="charity-img" />
      )}
      <h3>{charity.name}</h3>
      <p>{charity.description}</p>

      {/* Show select/selected button only in selection mode */}
      {onSelect && (
        <button
          className={selected ? 'btn-selected' : 'btn-primary'}
          onClick={() => onSelect(charity._id)}
        >
          {selected ? '✓ Selected' : 'Select Charity'}
        </button>
      )}
    </div>
  );
};

export default CharityCard;
