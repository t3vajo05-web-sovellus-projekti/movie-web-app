export default function StarRatingDisplay({ value10 }) {
  
  if (value10 === '-' || value10 == null || Number.isNaN(Number(value10))) {
    return <span>-</span>;
  }
  
  const fiveScale = Math.max(0, Math.min(5, Math.round(Number(value10))));

  return (
    <span aria-label={`${value10}/10`} title={`${value10}/10`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          style={{ color: i < fiveScale ? '#f5c518' : '#ddd' }}
        >
          ★
        </span>
      ))}
    </span>
  );
}