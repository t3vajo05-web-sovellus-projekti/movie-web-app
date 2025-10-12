import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { StarsDisplay } from "./StarRating";
import { API_URL } from "./API_URL.jsx";

export default function myRecentReviews({userId}) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`${API_URL}/reviews/user/${userId}/latest?limit=5`);
                const reviewsData = res.data;

                const reviewsWithDetails = await Promise.all(
                    reviewsData.map(async (review) => {
                        try {
                            const movieRes = await axios.get(`${API_URL}/movies/${review.movie_id}`);
                            const movieTitle = movieRes.data.title || 'Unknown movie';
                            return { ...review, movieTitle};
                        } catch {
                            return { ...review, movieTitle: 'Unknown movie'};
                        }
                    })
                    );

                    setReviews(reviewsWithDetails);
                } catch (err) {
                    console.error(err);
                } 

                setLoading(false);
            };

            if (userId) fetchReviews();
    }, [userId]);

    useEffect(() => {
        const fetchRatings = async () => {
            if (reviews.length === 0) return;

            try {
                const reviewsWithRatings = await Promise.all(
                    reviews.map(async (review) => {
                        try {
                            const res = await axios.get(
                                `${API_URL}/ratings/user/${userId}/movie/${review.movie_id}`
                            );
                            const rating = res.data?.rating ?? null;
                            
                            return { ...review, rating };
                        } catch {
                            return { ...review, rating: null };
                        }
                    })
                );

                setReviews(reviewsWithRatings);
            } catch (err) {
                console.error("Error fetching ratings:", err);
            }
        };

        fetchRatings();
    }, [reviews, userId]);

    if (loading) return <p>Loading...</p>;

    if (reviews.length === 0) return <p className="text-muted">You haven't made any reviews yet.</p>;

    return (
        <section className="mt-4">
                {reviews.map((review) => (
                    <div key={review.id} className="border rounded p-2 mb-2">
                        <div className="d-flex justify-content-between align-items-start">
                            <Link to={`/movie/${review.movie_id}`}>
                                <h5 className="mb-2">{review.movieTitle}</h5>
                            </Link>
                            {review.rating !== null && <StarsDisplay rating={review.rating} />}
                        </div>
                        <p className="mb-3" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                            {review.review_text}
                        </p>
                        <small className="text-muted">
                            Reviewed on: {new Date(review.created).toLocaleDateString("fi-FI")}
                        </small>
                    </div>
                ))}
        </section>
    );
}