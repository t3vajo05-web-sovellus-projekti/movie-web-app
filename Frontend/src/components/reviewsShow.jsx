import { useEffect, useState } from "react";
import axios from "axios";
import { useUser } from "../context/useUser.js";

export default function ReviewsShow({ movieId }) 
{
    const [reviews, setReviews] = useState([]);
    const [usernames, setUsernames] = useState({});
    const [loading, setLoading] = useState(true);
    const { user } = useUser();

    useEffect(() =>
    {
        const fetchReviews = async () =>
        {
            try
            {
                const res = await axios.get(`http://localhost:3001/reviews/movie/${movieId}/latest?limit=5`);
                const filtered = user?.id
                    ? res.data.filter(r => r.user_id !== user.id)
                    : res.data;
                setReviews(filtered);
            }
            catch (err)
            {
                console.error("Error fetching movie reviews:", err);
            }
            setLoading(false);
        };

        fetchReviews();
    }, [movieId, user]);

    useEffect(() =>
    {
        const fetchUsernames = async () =>
        {
            const missingIds = reviews
                .map(r => r.user_id)
                .filter(id => !(id in usernames));

            if (missingIds.length === 0) return;

            try
            {
                const newUsernames = {};
                await Promise.all(missingIds.map(async (id) =>
                {
                    const res = await axios.get(`http://localhost:3001/users/${id}/username`);
                    newUsernames[id] = res.data.username;
                }));
                setUsernames(prev => ({ ...prev, ...newUsernames }));
            }
            catch (err)
            {
                console.error("Error fetching usernames:", err);
            }
        };

        if (reviews.length > 0) fetchUsernames();
    }, [reviews, usernames]);

    if (loading) 
    {
        return (
            <div className="d-flex justify-content-center my-3">
                <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }
        
    if (reviews.length === 0) return <p>No reviews yet.</p>;

    return (
        <div className="mt-4">
            <h5>Latest user reviews</h5>
            {reviews.map(review => (
                <div key={review.id} className="border rounded p-2 mb-2">
                    <small className="text-muted d-block mb-2">
                        By {usernames[review.user_id]}:
                    </small>
                    <p className="mb-3" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                        {review.review_text}
                    </p>
                    <small className="text-muted">
                        Reviewed on: {new Date(review.created).toLocaleDateString("fi-FI")}
                    </small>
                </div>
            ))}
        </div>
    );
}
