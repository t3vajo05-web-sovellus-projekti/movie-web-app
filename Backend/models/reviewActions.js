import { pool } from "../helper/db.js"

const getAllReviews = async () => {
    const result = await pool.query('SELECT * FROM user_reviews')
    return result.rows
}

const getReviewsByMovieId = async (movie_id) => {
    const result = await pool.query('SELECT * FROM user_reviews WHERE movie_id = $1', [movie_id])
    return result.rows
}

const getLatestReviewsByMovieId = async (movie_id, limit = 10) => {
    const result = await pool.query(
        'SELECT * FROM user_reviews WHERE movie_id = $1 ORDER BY created DESC LIMIT $2', [movie_id, limit]
    )
    return result.rows
}

const getReviewsByUserId = async (user_id) => {
    const result = await pool.query('SELECT * FROM user_reviews WHERE user_id = $1', [user_id])
    return result.rows
}

const getReviewByUserAndMovieId = async (user_id, movie_id) => {
    const result = await pool.query('SELECT * FROM user_reviews WHERE user_id = $1 AND movie_id = $2', [user_id, movie_id])
    return result.rows[0] || null
}

const getLatestReviews = async (limit = 10) => {
    const result = await pool.query('SELECT * FROM user_reviews ORDER BY created DESC LIMIT $1', [limit])
    return result.rows
}

const getLatestReviewsByUserId = async (user_id, limit = 10) =>{
    const result = await pool.query(
        'SELECT * FROM user_reviews WHERE user_id = $1 ORDER BY created DESC LIMIT $2', [user_id, limit]
    )
    return result.rows
}

const getUserReviewCount = async (user_id) => {
    const result = await pool.query(
        'SELECT COUNT(*) AS review_count FROM user_reviews WHERE user_id = $1', [user_id]
    )
    return parseInt(result.rows[0].review_count, 10)
}

const createReview = (user_id, movie_id, review_text) => {
    return pool.query(
        'INSERT INTO user_reviews (user_id, movie_id, review_text) VALUES ($1, $2, $3) RETURNING *', 
        [user_id, movie_id, review_text]
    )
}

const deleteReviewById = async (id, user_id) => {
    const result = await pool.query('DELETE FROM user_reviews WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id])
    return result.rows[0] || null
}

export {
    getAllReviews,
    getReviewsByMovieId,
    getReviewsByUserId,
    getReviewByUserAndMovieId,
    getLatestReviews,
    getLatestReviewsByUserId,
    getUserReviewCount,
    createReview,
    deleteReviewById,
    getLatestReviewsByMovieId
}