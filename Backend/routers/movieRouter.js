import { Router } from 'express';
import { auth } from '../helper/auth.js';
import { 
    searchMovies, 
    getMovieById, 
    getMovieRecommendationsController, 
    getSimilarMoviesController, 
    getNowPlayingMoviesController, 
    getUpcomingMoviesController, 
    getMovieGenreList,
    discoverMoviesFilter
} from '../controllers/movieController.js';


const router = Router();

router.get('/search', searchMovies);
router.get('/nowplaying', getNowPlayingMoviesController)
router.get('/upcoming', getUpcomingMoviesController)
router.get('/:id/recommendations', getMovieRecommendationsController)
router.get('/:id/similar', getSimilarMoviesController)
router.get('/discover', discoverMoviesFilter); // go to movieController.js for info on filters
router.get('/genres', getMovieGenreList);
router.get('/:id', getMovieById);

export default router;