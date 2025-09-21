import React, { useContext } from "react";
import { UserContext } from "../context/UserContext.js";

export default function FavoriteButton({ movieId, favoritelist, setFavoritelist }) {
    const { user } = useContext(UserContext);
    const isInFavorites = favoritelist.some(item => item.movie_id === movieId);

    const toggleFavorites = async () => {
        if (!user) return;

        try {
            const res = await fetch(`http://localhost:3001/watchlist/item/${movieId}/favorite`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to toggle favorites");

            const data = await res.json();

            setFavoritelist(prev => {
                // If removed or favorite = false → remove from list
                if (!data || data.favorite === false) {
                    return prev.filter(item => item.movie_id !== movieId);
                }
                // Otherwise, add or update
                return [...prev.filter(item => item.movie_id !== movieId), data];
            });

        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <button className="btn btn-warning" onClick={toggleFavorites}>
            {isInFavorites ? "Remove from Favorites" : "Add to Favorites"}
        </button>
    );
}
