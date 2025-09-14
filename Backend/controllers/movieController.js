import { ApiError } from '../helper/apiError.js';
//import { addFavorite, removeFavorite, listFavorites } from '../models/movieActions.js';
import { searchMoviesByName } from '../helper/tmdb.js';

// Search by name: GET /movies/search?query=...&language=en-US&include_adult=false&page=1
export const searchMovies = async (req, res, next) => {
  const query = (req.query.query || '').trim();
  if (!query) return next(new ApiError('query is required', 400));

  const page = Math.max(1, parseInt(req.query.page || '1', 10) || 1);
  const language = (req.query.language || 'en-US').trim();

  // parse include_adult to boolean
  const include_adult =
    String(req.query.include_adult || 'false').toLowerCase() === 'true' ||
    req.query.include_adult === '1';

  try {
    const data = await searchMoviesByName(query, page, { language, include_adult });
    return res.json(data);
  } catch (err) {
    console.error('searchMovies error:', err);
    return res.status(500).json({ error: err.message });
  }
};

/* Add favorite: POST /movies/favorites/:movieId (auth)
export const addFavoriteController = async (req, res, next) => {
  const userId = req.user?.id;
  const movieId = String(req.params.movieId || req.body.movieId || '').trim();

  if (!userId) return next(new ApiError('Unauthorized', 401));
  if (!movieId) return next(new ApiError('movieId is required', 400));

  try {
    const result = await addFavorite(userId, movieId);
    if (result?.alreadyExists) return res.status(200).json({ message: 'Already in favorites' });
    return res.status(201).json({ favorite: result });
  } catch (err) {
    console.error('addFavorite error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// Remove favorite: DELETE /movies/favorites/:movieId (auth)
export const removeFavoriteController = async (req, res, next) => {
  const userId = req.user?.id;
  const movieId = String(req.params.movieId || '').trim();

  if (!userId) return next(new ApiError('Unauthorized', 401));
  if (!movieId) return next(new ApiError('movieId is required', 400));

  try {
    const removed = await removeFavorite(userId, movieId);
    if (!removed) return next(new ApiError('Favorite not found', 404));
    return res.status(200).json({ removed });
  } catch (err) {
    console.error('removeFavorite error:', err);
    return res.status(500).json({ error: err.message });
  }
};

// List favorites: GET /movies/favorites (auth)
export const listFavoritesController = async (req, res, next) => {
  const userId = req.user?.id;
  if (!userId) return next(new ApiError('Unauthorized', 401));

  try {
    const movieIds = await listFavorites(userId);
    return res.status(200).json({ movieIds });
  } catch (err) {
    console.error('listFavorites error:', err);
    return res.status(500).json({ error: err.message });
  }
}; */