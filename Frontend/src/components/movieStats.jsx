import { useEffect, useState } from "react";
import axios from "axios";
import { StarsDisplay, PartialStarsDisplay } from "./StarRating.jsx";
import { API_URL } from "./API_URL.jsx";

export default function MovieStats({ movieId, refreshTrigger }) {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const ratingRes = await axios.get(`${API_URL}/ratings/movie/stats/${movieId}`);
                const reviewRes = await axios.get(`${API_URL}/reviews/movie/${movieId}/count`);

                setStats({
                    avgRating: ratingRes.data.average_rating ?? 0,
                    ratingCount: ratingRes.data.rating_count ?? 0,
                    reviewCount: reviewRes.data.count ?? 0
                });
            } catch (err) {
                console.error("Error fetching movie stats:", err);
            }
            setLoading(false);
        }

        fetchStats();
    }, [movieId, refreshTrigger]);

    if (loading) return <p>Loading Stats...</p>;
    
    return (
        <div className="mt-3 mb-3">
            <div className="d-flex align-items-center gap-2 mb-1">
                <strong>Average Rating:</strong>
                <PartialStarsDisplay rating={stats.avgRating} />
                ({stats.ratingCount} {Number(stats.ratingCount) === 1 ? 'rating' : 'ratings'})
            </div>
            <p>
                <strong>Reviews:</strong> {stats.reviewCount}
            </p>
        </div>
    )
}