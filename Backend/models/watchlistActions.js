import { pool } from "../helper/db.js"

const ALLOWED_STATUSES = ['Plan to watch', 'Not interested', 'Watched', 'Favorited only']

const getWatchlist = async (userId) => {
    const { rows } = await pool.query('SELECT * FROM user_watchlist WHERE user_id = $1', [userId])
    return rows
}

const addToWatchlist = async (userId, movieId, status) =>
{
    if (!status || !ALLOWED_STATUSES.includes(status))
    {
        throw new Error(`Invalid status. Must be one of: ${ALLOWED_STATUSES.join(", ")}`);
    }

    // Check if row already exists
    const { rows: existingRows } = await pool.query(
        'SELECT * FROM user_watchlist WHERE user_id = $1 AND movie_id = $2',
        [userId, movieId]
    );

    if (existingRows.length > 0)
    {
        // Row exists → update status
        const { rows: updatedRows } = await pool.query(
            'UPDATE user_watchlist SET status = $1 WHERE user_id = $2 AND movie_id = $3 RETURNING *',
            [status, userId, movieId]
        );
        return updatedRows[0];
    }
    else
    {
        // Row doesn’t exist → insert new
        const { rows: insertedRows } = await pool.query(
            'INSERT INTO user_watchlist (user_id, movie_id, status) VALUES ($1, $2, $3) RETURNING *',
            [userId, movieId, status]
        );
        return insertedRows[0];
    }
};
    
const deleteFromWatchlist = async (userId, movieId) =>
{
    // Check if row exists
    const { rows: existingRows } = await pool.query(
        'SELECT * FROM user_watchlist WHERE user_id = $1 AND movie_id = $2',
        [userId, movieId]
    );

    if (existingRows.length === 0) return null;

    const row = existingRows[0];

    if (row.favorite)
    {
        // Keep the row but set status to 'Favorited only'
        const { rows: updatedRows } = await pool.query(
            "UPDATE user_watchlist SET status = 'Favorited only' WHERE user_id = $1 AND movie_id = $2 RETURNING *",
            [userId, movieId]
        );
        return updatedRows[0];
    }
    else
    {
        // Delete the row
        const { rows: deletedRows } = await pool.query(
            'DELETE FROM user_watchlist WHERE user_id = $1 AND movie_id = $2 RETURNING *',
            [userId, movieId]
        );
        return deletedRows[0] || null;
    }
};
    
    

const toggleFavoriteById = async (userId, movieId) =>
{
    const { rows } = await pool.query(
        "SELECT * FROM user_watchlist WHERE movie_id = $1 AND user_id = $2",
        [movieId, userId]
    );

    if (rows.length === 0)
    {
        // Not in table → insert as favorite
        const { rows: inserted } = await pool.query(
            "INSERT INTO user_watchlist (user_id, movie_id, favorite, status) VALUES ($1, $2, true, 'Favorited only') RETURNING *",
            [userId, movieId]
        );
        return inserted[0];
    }

    const existing = rows[0];

    if (existing.status === 'Favorited only')
    {
        // Delete the row
        await pool.query(
            "DELETE FROM user_watchlist WHERE movie_id = $1 AND user_id = $2",
            [movieId, userId]
        );
        return { removed: true }; // indicate deletion
    }

    // Otherwise, toggle favorite to false
    const { rows: updated } = await pool.query(
        "UPDATE user_watchlist SET favorite = NOT favorite WHERE movie_id = $1 AND user_id = $2 RETURNING *",
        [movieId, userId]
    );

    return updated[0];
};
    
    
    
    

const setStatus = async (id, status) => {
    if (!ALLOWED_STATUSES.includes(status)) throw new Error('Invalid status')

    const { rows } = await pool.query(
        'UPDATE user_watchlist SET status = $2 WHERE id = $1 RETURNING *', [id, status])

    return rows[0] || null
}

export { setStatus, ALLOWED_STATUSES, getWatchlist, addToWatchlist, toggleFavoriteById, deleteFromWatchlist }