import { useContext } from "react";
import { UserContext } from "../context/UserContext";
import { API_URL } from "./API_URL.jsx";

export default function StatusDropdown({ movieId, currentStatus, setWatchlist }) {
  const { user } = useContext(UserContext);
  const label = currentStatus || "Add to watchlist";

  const setStatus = async (selectedStatus) => {
    if (!user?.token) return;

    const idStr = String(movieId);

    if (selectedStatus === "Remove") {
      try {
        const res = await fetch(`${API_URL}/watchlist/${idStr}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${user.token}` },
        });
        if (res.ok) {
          setWatchlist((prev) => prev.filter((it) => String(it.movie_id) !== idStr));
        }
      } catch (e) {
        console.error(e);
      }
      return;
    }

    try {
      const res = await fetch(`${API_URL}/watchlist/${idStr}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ status: selectedStatus }),
      });

      if (res.ok) {
        const newItem = await res.json();
        setWatchlist((prev) => {
          const old = prev.find((it) => String(it.movie_id) === idStr) || {};
          return [
            ...prev.filter((it) => String(it.movie_id) !== idStr),
            { ...old, ...newItem },
          ];
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="dropdown">
      <button
        type="button"
        className="btn btn-outline-secondary btn-sm dropdown-toggle"
        data-bs-toggle="dropdown"
        data-bs-boundary="viewport"   
        data-bs-offset="0,4"          
        aria-expanded="false"
      >
        {label}
      </button>
      <ul className="dropdown-menu" style={{ zIndex: 2000 }}>
        <li><button className="dropdown-item" type="button" onClick={() => setStatus("Plan to watch")}>Plan to watch</button></li>
        <li><button className="dropdown-item" type="button" onClick={() => setStatus("Watched")}>Watched</button></li>
        <li><button className="dropdown-item" type="button" onClick={() => setStatus("Not interested")}>Not interested</button></li>
        <li><hr className="dropdown-divider" /></li>
        <li><button className="dropdown-item" type="button" onClick={() => setStatus("Remove")}>Remove</button></li>
      </ul>
    </div>
  );
}