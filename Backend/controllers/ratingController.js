import { 
    getAllRatings, 
    getRatingsByMovieId, 
    getRatingsByUserId, 
    getRatingByUserAndMovieId, 
    createRating, 
    changeRating, 
    deleteRatingById,
    getMovieRatingStats
} from "../models/ratingActions.js"
import { ApiError } from "../helper/apiError.js"

const returnAllRatings = async (req, res, next) => {
    try {
        const rows = await getAllRatings()
        return res.status(200).json(rows)
    } catch (err) {
        console.error('returnAllRatings error', err)
        return res.status(500).json({error:err.message})
    }
}

const returnRatingsByMovieId = async (req, res, next) => {
    try {
        const movieId = req.params.id
        const ratings = await getRatingsByMovieId(movieId)

        if (!ratings || ratings.length === 0) {
            return next(new ApiError('Ratings not found for movie', 404))
        }

        return res.status(200).json(ratings)
    } catch (err) {
        console.error('returnRatingsByMovieId error', err)
        return res.status(500).json({error:err.message})
    }
}

const returnRatingsByUserId = async (req, res, next) => {
    try {
        const userId = req.params.id
        const ratings = await getRatingsByUserId(userId)

        if (!ratings || ratings.length === 0) {
            return next(new ApiError('Ratings not found for user', 404))
        }

        return res.status(200).json(ratings)
    } catch (err) {
        console.error('returnRatingsByUserId error', err)
        return res.status(500).json({error:err.message})
    }
}

const returnRatingByUserAndMovieId = async (req, res, next) => {
    try {
        const { userId, movieId } = req.params
        const rating = await getRatingByUserAndMovieId(userId, movieId)

        if (!rating) {
            return next(new ApiError('Rating not found for given user and movie', 404))
        }

        return res.status(200).json(rating)
    } catch (err) {
        console.error('returnRatingByUserAndMovieId error:', err)
        return res.status(500).json({error:err.message})
    }
}

const rateMovie = async (req, res, next) => {
    try {
        const { rating } = req.body
        const userId = req.user.id

        if (!rating.movie_id) { 
            return next(new ApiError('Movie_id is required', 400))
        }
        if (rating.rating < 0 || rating.rating > 10) {
            return next(new ApiError('Rating cannot be under 0 or over 10', 400))
        }

        // Checks if the user has already rated a movie or not
        const existingRating = await getRatingByUserAndMovieId(userId, rating.movie_id)

        let result
        if (existingRating) {
            // User has already rated the movie -> changes the old rating
            result = await changeRating(userId, rating.movie_id, rating.rating)
        } else {
            // User hasn't rated the movie -> makes new rating
            const newRating = await createRating(userId, rating.movie_id, rating.rating)
            result = newRating.rows[0]
        }
        
        return res.status(201).json(result)
    } catch (err) {
        console.error('rateMovie error:', err)
        return res.status(500).json({error:err.message})
    }
}

const deleteRating = async (req, res, next) => {
    try {
        // Deletes rating using the user id from auth.js and rating id
        const ratingId = req.params.id
        const userId = req.user.id
        
        const deletedRating = await deleteRatingById(ratingId, userId)

        if (!deletedRating) {
            return next(new ApiError('Rating not found or not your rating', 404))
        }

        return res.status(200).json({
            message: 'Rating deleted successfully'
        })
    } catch (err) {
        console.error('deleteRating error:', err)
        return res.status(500).json({error:err.message})
    }
}

const returnMovieRatingStats = async (req, res, next) => {
    try {
        // returns average and count of ratings for the movie (two decimal accuracy for average)
        // returns 0 if there are no ratings for the movie
        const movieId = req.params.id

        const stats = await getMovieRatingStats(movieId)

        return res.status(200).json(stats)
    } catch (err) {
        console.error('returnMovieRatingStats error:', err)
        return res.status(500).json({error:err.message})
    }
}

export {
    returnAllRatings,
    returnRatingsByMovieId,
    returnRatingsByUserId,
    returnRatingByUserAndMovieId,
    rateMovie,
    deleteRating,
    returnMovieRatingStats
}