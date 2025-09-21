import { Router } from "express"
import { auth } from "../helper/auth.js"
import { 
    returnAllRatings, 
    returnRatingsByMovieId, 
    returnRatingsByUserId, 
    returnRatingByUserAndMovieId, 
    rateMovie, 
    deleteRating,
    returnMovieRatingStats
} from "../controllers/ratingController.js"

const router = Router()

router.get('/', returnAllRatings)
router.get('/movie/:id', returnRatingsByMovieId)
router.get('/user/:id', returnRatingsByUserId)
router.get('/user/:userId/movie/:movieId', returnRatingByUserAndMovieId)
router.get('/movie/stats/:id', returnMovieRatingStats)
router.post('/rate', auth, rateMovie)
router.delete('/:id', auth, deleteRating)

export default router