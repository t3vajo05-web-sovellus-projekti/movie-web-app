import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/useUser.js";

export default function StarRating({ movieId }) {
    const { user } = useUser();
    const [rating, setRating] = useState(0); // final selected rating
    const [hover, setHover] = useState(0);   // temporary hover rating

    useEffect(() => {
        if (!user) return;

        const fetchUserRating = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:3001/ratings/user/${user.id}/movie/${movieId}`,
                    { headers: { Authorization: `Bearer ${user.token}` } }
                );
                
                if (res.data && res.data.rating) {
                    setRating(res.data.rating);
                }
            } catch (err) {
                console.error("Error fetching user rating:", err);
            }
        };

        fetchUserRating();
    }, [user, movieId]);

    const handleClick = async (star) => {
        setRating(star);

        if (!user) return;

        try {
            await axios.post(
                "http://localhost:3001/ratings/rate",
                { movie_id: Number(movieId), rating: star },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
        } catch (err) {
            console.error("Error saving rating:", err)
        }
    }

    return (
        <div className="d-flex align-items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className="fs-3"
                    style={{ cursor: "pointer", color: star <= (hover || rating) ? "#ffc107" : "#e4e5e9" }}
                    onClick={() => handleClick(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                >
                    &#9733;
                </span>
            ))}
            <span className="ms-2">Rating: {rating}</span>
        </div>
    );
}
