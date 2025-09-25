import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function myRecentReviews({userId}) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const res = await axios.get(`http://localhost:3001/reviews/user/${userId}/latest?limit=5`);
                const reviewsData = res.data;

                const reviewsWithDetails = await Promise.all(
                    reviewsData.map(async (review) => {
                        try {
                            const movieRes = await axios.get(`http://localhost:3001/movies/${review.movie_id}`);
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
                } finally {
                    setLoading(false);
                }
            };

            if (userId) fetchReviews();
    }, [userId]);

    return (
        <section className="my-4">
            <h2 className="h4 mb-3">My recent Reviews</h2>
            {loading ? (
                <p>Loading...</p>
            ) : reviews.length === 0 ? (
                <p className="text-muted">You haven't made any written reviews yet.</p>
            ) : (
                <div className="list-group">
                    {reviews.map((review) => (
                        <div key={review.id} className="list-group-item">
                            <Link to={`/movie/${review.movie_id}`}>
                                <h5 className="mb-1">{review.movieTitle}</h5>
                            </Link>
                            <p className="mb-1">{review.review_text}</p>
                            <small className="text-muted">
                                {new Date(review.created).toLocaleDateString("fi-FI")}
                            </small>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}