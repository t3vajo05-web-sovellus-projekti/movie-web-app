import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { StarsDisplay } from './StarRating.jsx';

export default function HomeMostRecent() 
{
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => 
    {
        const fetchReviews = async () => 
        {
            try 
            {
                // Fetch latest reviews
                const res = await axios.get('http://localhost:3001/reviews/latest?limit=3');
                const reviewsData = res.data;

                // Fetch usernames and movie titles for each review
                const reviewsWithDetails = await Promise.all(
                    reviewsData.map(async (review) => 
                    {
                        try 
                        {
                            // Fetch username
                            const userRes = await axios.get(`http://localhost:3001/users/${review.user_id}/username`);
                            const username = userRes.data.username;

                            // Fetch movie info
                            const movieRes = await axios.get(`http://localhost:3001/movies/${review.movie_id}`);
                            const movieTitle = movieRes.data.title || 'Unknown Movie';

                            // Fetch rating for user and movie
                            const ratingRes = await axios.get(
                                `http://localhost:3001/ratings/user/${review.user_id}/movie/${review.movie_id}`
                            );
                            const rating = ratingRes.data?.rating || null;

                            return { ...review, username, movieTitle, rating };
                        } 
                        catch 
                        {
                            return { ...review, username: 'Unknown', movieTitle: 'Unknown Movie', rating: null };
                        }
                    })
                );

                setReviews(reviewsWithDetails);
            } 
            catch (err) 
            {
                console.error(err);
            } 
            finally 
            {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    return (
        <section className="container py-5">
            <h2 className="h3 mb-4">Most Recent Reviews</h2>

            {loading ? (
                <div className="d-flex justify-content-center my-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : reviews.length === 0 ? (
                <p className="text-center text-muted">No recent reviews found.</p>
            ) : (
                <div className="row g-3">
                    {reviews.map((review) => (
                        <div key={review.id} className="col-md-6 col-lg-4">
                            <div className="card h-100 text-center">
                                <div className="card-body">
                                    <Link to={`/movie/${review.movie_id}`}><h5 className="card-title my-3">{review.movieTitle}</h5></Link>
                                    {review.rating !== null && (
                                        <div className='d-flex justify-content-center mb-3'>
                                            <StarsDisplay rating={review.rating} />
                                        </div>
                                    )}
                                    <h6 className="card-subtitle mb-2 text-muted">From {review.username}:</h6>
                                    <p className="card-text fst-italic">{review.review_text}</p>
                                </div>
                                <div className="card-footer text-muted">
                                    {new Date(review.created).toLocaleDateString("fi-FI")}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            )}
        </section>
    );
}
