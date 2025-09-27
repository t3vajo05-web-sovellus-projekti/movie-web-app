import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/useUser.js";

// User rating
export function StarRating({ movieId }) {
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

// Shows partial stars for average and TMDB rating
export function PartialStarsDisplay({ rating, maxStars = 5, showNumber }) {
    return (
        <div className="d-flex align-items-center gap-1">
            {[...Array(maxStars)].map((_, i) => {
                const fillPercentage = Math.min(Math.max(rating - i, 0), 1) * 100;

                return (
                    <span
                        key={i}
                        className="fs-3"
                        style={{
                            position: "relative",
                            display: "inline-block",
                            color: "#e4e5e9"
                        }}
                    >
                        &#9733;
                        <span
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: `${fillPercentage}%`,
                                overflow: "hidden",
                                color: "#ffc107"
                            }}
                        >
                            &#9733;
                        </span>
                    </span>
                )
            })}
            {showNumber && <span className="ms-2">{showNumber}</span>}
        </div>
    );
}   

// Show full stars for user ratings
export function StarsDisplay({ rating, maxStars = 5 }) {
    const fullStars = Math.round(rating);
    
    return (
        <div className="d-flex align-items-center gap-1">
            {[...Array(maxStars)].map((_, i) => (
                <span
                    key={i}
                    className="fs-3"
                    style={{ color: i < fullStars ? "#ffc107" : "#e4e5e9" }}
                >
                    &#9733;
                </span>
            ))}
        </div>
    );
}

export function TmdbStarRating({ rating }) {
    const stars = rating / 2;
    return <PartialStarsDisplay rating={stars} showNumber={`${rating.toFixed(1) / 2} / 5`} />
}
