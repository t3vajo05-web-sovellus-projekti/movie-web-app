import { 
    getAllReviews, 
    getReviewsByMovieId, 
    getReviewsByUserId, 
    getReviewByUserAndMovieId, 
    getLatestReviews,
    getLatestReviewsByUserId,
    getUserReviewCount,
    createReview, 
    deleteReviewById 
} from "../models/reviewActions.js"
import { ApiError } from "../helper/apiError.js"

const returnAllReviews = async (req, res, next) => {
    try {
        const rows = await getAllReviews()
        return res.status(200).json(rows)
    } catch (err) {
        console.error('returnAllReviews error:', err)
        return res.status(500).json({error:err.message})
    }
}

const returnReviewsByMovieId = async (req, res, next) => {
    try {
        const movieId = req.params.id
        const reviews = await getReviewsByMovieId(movieId)

        if (!reviews || reviews.length === 0) {
            return next(new ApiError('Reviews not found for movie', 404))
        }

        return res.status(200).json(reviews)
    } catch (err) {
        console.error('returnReviewsByMovieId error:', err)
        return res.status(500).json({error:err.message})
    }
}

const returnReviewsByUserId = async (req, res, next) => {
    try {
        const userId = req.params.id
        const reviews = await getReviewsByUserId(userId)

        if (!reviews || reviews.length === 0) {
            return next(new ApiError('Reviews not found for user', 404))
        }

        return res.status(200).json(reviews)
    } catch (err) {
        console.error('returnReviewsByUserId error:', err)
        return res.status(500).json({error:err.message})
    }
}

const returnLatestReviews = async (req, res, next) => {
    try {
        // returns latest reviews with a limit of 10 results by default
        const limit = parseInt(req.query.limit) || 10
        const reviews = await getLatestReviews(limit)

        if (!reviews || reviews.length === 0) {
            return next(new ApiError('No reviews found', 404))
        }

        return res.status(200).json(reviews)
    } catch (err) {
        console.error('returnLatestReviews error:', err)
        return res.status(500).json({error:err.message})
    }
}

const returnLatestReviewsByUser = async (req, res, next) => {
    try {
        const userId = req.params.id
        const limit = parseInt(req.query.limit) || 10
        const reviews = await getLatestReviewsByUserId(userId, limit)

        if (!reviews || reviews.length === 0) {
            return next(new ApiError('No reviews found for user', 404))
        }

        return res.status(200).json(reviews)
    } catch (err) {
        console.error('returnLatestReveiwsByUser error:', err)
        return res.status(500).json({error:err.message})
    }
}

const returnUserReviewCount = async (req, res, next) => {
    try {
        // returns count of reviews for given user_id
        const userId = req.params.id
        const count = await getUserReviewCount(userId)

        return res.status(200).json({count})
    } catch (err) {
        console.error('returnUserReviewCount error:', err)
        return res.status(500).json({error:err.message})
    }
}

const reviewMovie = async (req, res, next) => {
    try {
        const review = req.body
        const userId = req.user.id

        if (!review.movie_id) {
            return next(new ApiError('Movie_id is required', 400))
        }

        const existingReview = await getReviewByUserAndMovieId(userId, review.movie_id)

        let result
        if (existingReview) {
            return next(new ApiError('Movie already has review from user', 400))
        } else {
            const newReview = await createReview(userId, review.movie_id, review.review_text)
            result = newReview.rows[0]
        }

        return res.status(201).json(result)
    } catch (err) {
        console.error('reviewMovie error:', err)
        return res.status(500).json({error:err.message})
    }
}

const deleteReview = async (req, res, next) => {
    try {
        const reviewId = req.params.id
        const userId = req.user.id

        const deletedReview = await deleteReviewById(reviewId, userId)

        if (!deletedReview) {
            return next(new ApiError ('Review not found or not your review', 404))
        }

        return res.status(200).json({message: 'Review deleted successfully'})
    } catch (err) {
        console.error('deleteReview error:', err)
        return res.status(500).json({error:err.message})
    }
}

export {
    returnAllReviews,
    returnReviewsByMovieId,
    returnReviewsByUserId,
    returnLatestReviews,
    returnLatestReviewsByUser,
    returnUserReviewCount,
    reviewMovie,
    deleteReview
}