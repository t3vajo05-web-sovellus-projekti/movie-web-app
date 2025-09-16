import { Router } from 'express';
import { auth } from '../helper/auth.js';
import { searchMovies, getMovieById,
  /*addFavoriteController,
  removeFavoriteController,
  listFavoritesController,*/
} from '../controllers/movieController.js';

const router = Router();

router.get('/search', searchMovies);
router.get('/:id', getMovieById);
/*
router.get('/favorites', auth, listFavoritesController);
router.post('/favorites/:movieId', auth, addFavoriteController);
router.delete('/favorites/:movieId', auth, removeFavoriteController);
*/
export default router;