import './buttons.css'
import { useState, useEffect, useContext } from "react";
import { UserContext } from "../context/UserContext.js";
import { API_URL } from "./API_URL.jsx";

export default function WatchlistDropdown({ movieId, watchlist, setWatchlist }) {
    const { user } = useContext(UserContext);
    const isInWatchlist = watchlist.some(item => item.movie_id === movieId);

    async function toggleWatchlist(selectedStatus) {
        if (!user) return;

        if (selectedStatus === "Remove") {
            const res = await fetch(`${API_URL}/watchlist/${movieId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${user.token}` },
            });
            if (res.ok) setWatchlist(prev => prev.filter(item => item.movie_id !== movieId));
        } else {
            const res = await fetch(`${API_URL}/watchlist/${movieId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
                body: JSON.stringify({ status: selectedStatus }),
            });
            if (res.ok) {
                const newItem = await res.json();
                setWatchlist(prev => {
                    // Remove any previous entry for the movie and add the updated one
                    return [...prev.filter(item => item.movie_id !== movieId), newItem];
                });
            }
        }
    }

    return (
        <div className="dropdown">
            <button
                type="button"
                className="btn btn-primary dropdown-toggle"
                data-bs-toggle="dropdown"
                aria-expanded="false"
            >
                {isInWatchlist ? "Modify on watchlist" : "Add to my Watchlist"}
            </button>
            <ul className="dropdown-menu">
                <li>
                    <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => toggleWatchlist("Plan to watch")}
                    >
                        Plan to Watch
                    </button>
                </li>
                <li>
                    <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => toggleWatchlist("Watched")}
                    >
                        Watched
                    </button>
                </li>
                <li>
                    <button
                        className="dropdown-item"
                        type="button"
                        onClick={() => toggleWatchlist("Not interested")}
                    >
                        Not Interested
                    </button>
                </li>
                {isInWatchlist && (
                    <>
                        <li>
                            <hr className="dropdown-divider" />
                        </li>
                        <li>
                            <button
                                className="dropdown-item"
                                type="button"
                                onClick={() => toggleWatchlist("Remove")}
                            >
                                Remove
                            </button>
                        </li>
                    </>
                )}
            </ul>
        </div>
    );
}
