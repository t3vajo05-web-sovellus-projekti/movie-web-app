export default function FavoriteButton({ active, onClick }) {
  const color = active ? "#dc3545" : "#adb5bd"; // red / grey
  return (
    <button
      type="button"
      onClick={onClick}
      className="btn btn-link p-0 border-0"
      aria-label={active ? "Unfavorite" : "Favorite"}
      title={active ? "Unfavorite" : "Favorite"}
      style={{ lineHeight: 1, textDecoration: "none" }}
    >
      <span style={{ fontSize: "1.25rem", color, userSelect: "none" }}>♥</span>
    </button>
  );
}
