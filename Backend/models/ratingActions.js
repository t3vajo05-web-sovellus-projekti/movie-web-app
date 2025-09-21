import { pool } from "../helper/db.js"

const getAllRatings = async () => {
    const result = await pool.query('SELECT * FROM user_ratings')
    return result.rows
}

const getRatingsByMovieId = async (movie_id) => {
    const result = await pool.query('SELECT * FROM user_ratings WHERE movie_id = $1', [movie_id])
    return result.rows
}

const getRatingsByUserId = async (user_id) => {
    const result = await pool.query('SELECT * FROM user_ratings WHERE user_id = $1', [user_id])
    return result.rows
}

const getRatingByUserAndMovieId = async (user_id, movie_id) => {
    const result = await pool.query('SELECT * FROM user_ratings WHERE user_id = $1 AND movie_id = $2', [user_id, movie_id])
    return result.rows[0] || null
}

const createRating = (user_id, movie_id, rating) => {
    return pool.query(
        'INSERT INTO user_ratings (user_id, movie_id, rating) VALUES ($1, $2, $3) RETURNING *', [user_id, movie_id, rating]
    )
}

const changeRating = async (user_id, movie_id, rating) => {
    const result = await pool.query(
        'UPDATE user_ratings SET rating = $3 WHERE user_id = $1 AND movie_id = $2 RETURNING *', [user_id, movie_id, rating]
    )
    return result.rows[0]
}

const deleteRatingById = async (id, user_id) => {
    const result = await pool.query('DELETE FROM user_ratings WHERE id = $1 AND user_id = $2 RETURNING *', [id, user_id])
    return result.rows[0] || null
}

const getMovieRatingStats = async (movie_id) => {
    const result = await pool.query(
        `SELECT
            COALESCE(AVG(rating), 0)::numeric(10,2) AS average_rating,
            COUNT(rating) AS rating_count
        FROM user_ratings WHERE movie_id = $1`, [movie_id]
    )
    return result.rows[0]
}

export {
    getAllRatings,
    getRatingsByMovieId,
    getRatingsByUserId,
    getRatingByUserAndMovieId,
    createRating,
    changeRating,
    deleteRatingById,
    getMovieRatingStats
}