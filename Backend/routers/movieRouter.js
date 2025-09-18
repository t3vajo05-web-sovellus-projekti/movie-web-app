import { Router } from 'express';
import { auth } from '../helper/auth.js';
import { searchMovies, getMovieById } from '../controllers/movieController.js';

const router = Router();

router.get('/search', searchMovies);
router.get('/:id', getMovieById);

export default router;