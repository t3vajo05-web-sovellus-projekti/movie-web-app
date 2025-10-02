import { pool } from '../helper/db.js'

const addMovieToGroup = (groupId, movieId) =>
{
    return pool.query(
        'INSERT INTO group_tmdb_movies (movie_id, group_id) VALUES ($1, $2) RETURNING *', [movieId, groupId]
    )
}

const removeMovieFromGroup = (groupId, movieId) =>
{
    return pool.query(
        'DELETE FROM group_tmdb_movies WHERE group_id = $1 AND movie_id = $2 RETURNING *', [groupId, movieId]
    )
}

const getMoviesForGroup = async (groupId) =>
{
    const result = await pool.query(
        `SELECT * FROM group_tmdb_movies WHERE group_id = $1`, [groupId]
    )
    return result.rows
}

export {
    addMovieToGroup,
    removeMovieFromGroup,
    getMoviesForGroup
}