/*
import { pool } from '../helper/db.js';

export const addFavorite = async (userId, movieId) => {
  const id = String(movieId);
  const exists = await pool.query(
    'SELECT id FROM user_favorites WHERE user_id = $1 AND movie_id = $2',
    [userId, id]
  );
  if (exists.rows.length) return { alreadyExists: true };

  const result = await pool.query(
    'INSERT INTO user_favorites (user_id, movie_id) VALUES ($1, $2) RETURNING *',
    [userId, id]
  );
  return result.rows[0];
};

export const removeFavorite = async (userId, movieId) => {
  const id = String(movieId);
  const result = await pool.query(
    'DELETE FROM user_favorites WHERE user_id = $1 AND movie_id = $2 RETURNING *',
    [userId, id]
  );
  return result.rows[0] || null;
};

export const listFavorites = async (userId) => {
  const result = await pool.query(
    'SELECT movie_id FROM user_favorites WHERE user_id = $1 ORDER BY id DESC',
    [userId]
  );
  return result.rows.map(r => r.movie_id);
}; */