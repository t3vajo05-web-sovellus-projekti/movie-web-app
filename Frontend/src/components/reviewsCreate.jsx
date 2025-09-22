import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "../context/useUser.js";

export default function ReviewCreate({ movieId }) 
{
    const [reviewText, setReviewText] = useState("");
    const [loading, setLoading] = useState(false);
    const [hasReviewed, setHasReviewed] = useState(false);
    const [existingReview, setExistingReview] = useState("");
    const [reviewCreatedAt, setReviewCreatedAt] = useState(null);
    const [existingReviewID, setExistingReviewID] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useUser();

    useEffect(() =>
    {
        const fetchUserReviews = async () =>
        {
            if (!user?.id) return;

            try
            {
                const res = await axios.get(`http://localhost:3001/reviews/user/${user.id}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });

                const reviewRecord = res.data.find(
                    r => r.movie_id.toString().trim() === movieId.toString().trim()
                );

                if (reviewRecord)
                {
                    setHasReviewed(true);
                    setExistingReview(reviewRecord.review_text || "");
                    setReviewCreatedAt(reviewRecord.created || null);
                    setExistingReviewID(reviewRecord.id);
                }

            }
            catch (err)
            {
                console.error("Error fetching user reviews:", err);
            }
        };

        fetchUserReviews();
    }, [user, movieId]);

    const handleSubmit = async () =>
    {
        if (!reviewText.trim())
        {
            alert("Review cannot be empty");
            return;
        }

        setLoading(true);
        try
        {
            // If editing, delete the old one first
            if (isEditing && existingReviewID)
            {
                await axios.delete(`http://localhost:3001/reviews/${existingReviewID}`, {
                    headers: { Authorization: `Bearer ${user.token}` }
                });
            }

            const res = await axios.post(
                "http://localhost:3001/reviews/review",
                {
                    movie_id: movieId,
                    review_text: reviewText
                },
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            setHasReviewed(true);
            setExistingReview(reviewText);
            setReviewCreatedAt(new Date().toISOString());
            setExistingReviewID(res.data.id || existingReviewID);
            setReviewText("");
            setIsEditing(false);

        }
        catch (err)
        {
            alert(err.response?.data?.error || "Failed to submit review");
        }
        setLoading(false);
    };

    const handleDelete = async () =>
    {
        if (!window.confirm("Are you sure you want to delete your review?")) return;

        try
        {
            await axios.delete(`http://localhost:3001/reviews/${existingReviewID}`, {
                headers: { Authorization: `Bearer ${user.token}` }
            });
            setExistingReview(null);
            setHasReviewed(false);
            setIsEditing(false);
        }
        catch (err)
        {
            alert(err.response?.data?.error || "Failed to delete review");
        }
    };

    if (hasReviewed && !isEditing)
    {
        return (
            <div className="mb-4">
                <h5>Your Review</h5>
                {existingReview ? (
                    <>
                        <div className="border rounded p-2 d-flex flex-column">
                            <span>{existingReview}</span>
                            <small className="text-muted mt-auto">
                                Reviewed on: {new Date(reviewCreatedAt).toLocaleDateString("fi-FI")}
                            </small>
                        </div>
                        <div className="mt-2 d-flex gap-2">
                            <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => {
                                    setIsEditing(true);
                                    setReviewText(existingReview);
                                }}
                            >
                                Edit my review
                            </button>
                            <button
                                className="btn btn-sm btn-danger"
                                onClick={handleDelete}
                            >
                                Delete
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="text-muted">You have already submitted a review.</p>
                )}
            </div>
        );
    }

    return (
        <div className="mb-4">
            <h5>{isEditing ? "Edit Your Review" : "Leave a Review"}</h5>
            <textarea
                className="form-control mb-2"
                placeholder="Write your review..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
            />
            <div className="d-flex gap-2">
                <button
                    className="btn btn-primary"
                    onClick={handleSubmit}
                    disabled={loading || !reviewText.trim()}
                >
                    {loading ? "Submitting..." : isEditing ? "Save Changes" : "Submit Review"}
                </button>
                {isEditing && (
                    <button
                        className="btn btn-secondary"
                        onClick={() => setIsEditing(false)}
                    >
                        Cancel
                    </button>
                )}
            </div>
        </div>
    );
}
