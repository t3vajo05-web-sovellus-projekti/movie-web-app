import { useState } from "react";

export default function StarRating() {
    const [rating, setRating] = useState(0); // final selected rating
    const [hover, setHover] = useState(0);   // temporary hover rating

    return (
        <div className="d-flex align-items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <span
                    key={star}
                    className="fs-3"
                    style={{ cursor: "pointer", color: star <= (hover || rating) ? "#ffc107" : "#e4e5e9" }}
                    onClick={() => setRating(star)}
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
