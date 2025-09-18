import { pool } from "../helper/db.js"

const ALLOWED_STATUSES = ['plan_to_watch', 'not_interested', 'watched']

const getWatchlist = async (userId) => {
    const { rows } = await pool.query('SELECT * FROM user_watchlist WHERE user_id = $1', [userId])
    return rows
}

const addToWatchlist = async (userId, movieId) => {
    const { rows } = await pool.query(
        'INSERT INTO user_watchlist (user_id, movie_id) VALUES ($1, $2) RETURNING *', [userId, movieId])
        return rows[0]
}

const deleteFromWatchlist = async (movieId) => {
    const { rows } = await pool.query('DELETE FROM user_watchlist WHERE movie_id = $1', [movieId])
    return rows[0]
}

const toggleFavoriteById = async (id) => {
    const { rows } = await pool.query(
        'UPDATE user_watchlist SET favorite = NOT favorite WHERE id = $1 RETURNING *', [id])
        return rows[0] || null
}

const setStatus = async (id, status) => {
    if (!ALLOWED_STATUSES.includes(status)) throw new Error('Invalid status')

    const { rows } = await pool.query(
        'UPDATE user_watchlist SET status = $2 WHERE id = $1 RETURNING *', [id, status])

    return rows[0] || null
}

export { setStatus, ALLOWED_STATUSES, getWatchlist, addToWatchlist, toggleFavoriteById, deleteFromWatchlist }