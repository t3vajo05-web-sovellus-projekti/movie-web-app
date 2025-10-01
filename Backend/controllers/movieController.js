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