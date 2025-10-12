import { ApiError } from '../helper/apiError.js';
import { 
  searchMoviesByName, 
  searchMoviesById, 
  getMovieRecommendations, 
  getSimilarMovies, 
  getNowPlayingMovies, 
  getUpcomingMovies, 
  getMovieGenres,
  getActorIdByName,
  discoverMovies
} from '../helper/tmdb.js';
import {
  addMovieToGroup,
  removeMovieFromGroup,
  getMoviesForGroup
} from '../models/movieActions.js';
import { isUserMemberOfGroup } from '../models/groupActions.js'; // for adding / removing movie to a group

// Kuvien filepathien url: https://image.tmdb.org/t/p/w500/ (filepath)
// esim https://image.tmdb.org/t/p/w500/AbgEQO2mneCSOc8CSnOMa8pBS8I.jpg%22

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

export const getMovieById = async (req, res, next) => {
  const id = parseInt(req.params.id, 10)
  if (!Number.isFinite(id)) return next(new ApiError('Valid ID is required', 400))
  
  const language = (req.query.language || 'en-US').trim()
  
  try {
    const data = await searchMoviesById(id, { language })
    if (!data || data.success === false) return next(new ApiError('Movie not found', 400))
    return res.json(data)
  } catch (err) {
    console.error('getMovieById error:', err)
    res.status(500).json({ error: err.message })
  }
}

export const getMovieRecommendationsController = async (req, res, next) => 
  {
    const id = parseInt(req.params.id, 10)
    if (!Number.isFinite(id)) return next(new ApiError('Valid ID is required', 400))
  
    const language = (req.query.language || 'en-US').trim()
  
    try 
    {
      const data = await getMovieRecommendations(id, { language })
      if (!data || data.success === false) return next(new ApiError('Recommendations not found', 400))
      return res.json(data)
    } 
    catch (err) 
    {
      console.error('getMovieRecommendationsController error:', err)
      return res.status(500).json({ error: err.message })
    }
  }
  
  export const getSimilarMoviesController = async (req, res, next) => 
  {
    const id = parseInt(req.params.id, 10)
    if (!Number.isFinite(id)) return next(new ApiError('Valid ID is required', 400))
  
    const language = (req.query.language || 'en-US').trim()
  
    try 
    {
      const data = await getSimilarMovies(id, { language })
      if (!data || data.success === false) return next(new ApiError('Similar movies not found', 400))
      return res.json(data)
    } 
    catch (err) 
    {
      console.error('getSimilarMoviesController error:', err)
      return res.status(500).json({ error: err.message })
    }
  }
  
  export const getNowPlayingMoviesController = async (req, res, next) => 
  {
    const page = Math.max(1, parseInt(req.query.page || '1', 10) || 1)
    const language = (req.query.language || 'en-US').trim()
  
    try 
    {
      const data = await getNowPlayingMovies(page, { language })
      if (!data || data.success === false) return next(new ApiError('Now playing movies not found', 400))
      return res.json(data)
    } 
    catch (err) 
    {
      console.error('getNowPlayingMoviesController error:', err)
      return res.status(500).json({ error: err.message })
    }
  }
  
  export const getUpcomingMoviesController = async (req, res, next) => 
  {
    const page = Math.max(1, parseInt(req.query.page || '1', 10) || 1)
    const language = (req.query.language || 'en-US').trim()
  
    try 
    {
      const data = await getUpcomingMovies(page, { language })
      if (!data || data.success === false) return next(new ApiError('Upcoming movies not found', 400))
      return res.json(data)
    } 
    catch (err) 
    {
      console.error('getUpcomingMoviesController error:', err)
      return res.status(500).json({ error: err.message })
    }
  }

export const getMovieGenreList = async (req, res, next) => {
  try {
    const language = (req.query.language || 'en-US').trim();
    const data = await getMovieGenres({ language });

    return res.json(data);
  } catch (err) {
    console.error('getMoviesGenreList error:', err);
    return res.status(500).json({error:err.message});
  }
};

// checks for filters in query, passing only the filters in the filters-object to TMDB
// filters list: genres, castName, year, startYear and endYear
// example: /movies/discover?genres=53&castName=Tom%20Hanks&startYear=2000&endYear=2010&page=1
export const discoverMoviesFilter = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page || '1', 10) || 1);
    const language = (req.query.language || 'en-US').trim();

    const filters = {
      page,
      language,
      with_genres: req.query.genres,
      primary_release_year: req.query.year,
    };

    if (req.query.startYear && req.query.endYear) {
      filters['primary_release_date.gte'] = `${req.query.startYear}-01-01`;
      filters['primary_release_date.lte'] = `${req.query.endYear}-12-31`;
      delete filters.primary_release_year;
    }

    if (req.query.castName) {
      const actorData = await getActorIdByName(req.query.castName, 1, { language });

      if (actorData.results && actorData.results.length > 0) {
        filters.with_cast = actorData.results[0].id;
      }
    }

    Object.keys(filters).forEach(
      (key) => filters[key] === undefined && delete filters[key]
    );

    const data = await discoverMovies(filters);

    if (!data || data.success === false) {
      return next(new ApiError('No movies found', 404));
    }

    res.json(data);
  } catch (err) {
    console.error('discoverMoviesFilter error:', err);
    return res.status(500).json({error:err.message});
  }
};

const addMovieToGroupController = async (req, res, next) => 
{
    const userId = req.user?.id;
    if (!userId) return next(new ApiError("Unauthorized", 401));

    const { groupId, movieId } = req.body;
    if (!groupId || !movieId) 
    {
        return next(new ApiError("groupId and movieId are required", 400));
    }

    try 
    {
        const isMember = await isUserMemberOfGroup(userId, groupId);
        if (!isMember) return next(new ApiError("You are not a member of this group", 403));

        // check if movie already exists in group
        const existingMovies = await getMoviesForGroup(groupId);
        if (existingMovies.some(m => m.movie_id === movieId)) 
        {
            return next(new ApiError("Movie already exists in group", 400));
        }

        const movie = await addMovieToGroup(groupId, movieId);
        if (!movie) return next(new ApiError("Failed to add movie to group", 500));

        res.status(201).json(movie.rows[0]);
    } 
    catch (err) 
    {
        console.error("addMovieToGroupController error:", err);
        res.status(500).json({ error: err.message });
    }
};

const removeMovieFromGroupController = async (req, res, next) => 
{
    const userId = req.user?.id;
    if (!userId) return next(new ApiError("Unauthorized", 401));

    const { groupId, movieId } = req.body;
    if (!groupId || !movieId) 
    {
        return next(new ApiError("groupId and movieId are required", 400));
    }

    try 
    {
        const isMember = await isUserMemberOfGroup(userId, groupId);
        if (!isMember) return next(new ApiError("You are not a member of this group", 403));

        const movie = await removeMovieFromGroup(groupId, movieId);
        if (!movie) return next(new ApiError("Failed to remove movie from group", 500));

        res.status(200).json({ message: "Movie removed from group" });
    } 
    catch (err) 
    {
        console.error("removeMovieFromGroupController error:", err);
        res.status(500).json({ error: err.message });
    }
};

const getMoviesForGroupController = async (req, res, next) => 
{
    const userId = req.user?.id;
    if (!userId) return next(new ApiError("Unauthorized", 401));

    const groupId = req.params.id;
    if (!groupId) 
    {
        return next(new ApiError("groupId is required", 400));
    }

    try 
    {
        const isMember = await isUserMemberOfGroup(userId, groupId);
        if (!isMember) return next(new ApiError("You are not a member of this group", 403));

        const movies = await getMoviesForGroup(groupId);

        // gets movies from tmdb for each movieId in the group
        const movieDetailsPromises = movies.map((movie) => 
            searchMoviesById(movie.movie_id)
        );
        const movieDetails = await Promise.all(movieDetailsPromises);

        // filter out any null or undefined results
        const validMovies = movieDetails.filter((movie) => movie && !movie.error);

        // return the valid movie details
        return res.json(validMovies);
    } 
    catch (err) 
    {
        console.error("getMoviesForGroupController error:", err);
        res.status(500).json({ error: err.message });
    }
};

export {
  addMovieToGroupController,
  removeMovieFromGroupController,
  getMoviesForGroupController,
};