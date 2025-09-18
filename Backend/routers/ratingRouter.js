import { Router } from "express"
import { auth } from "../helper/auth.js"
import { returnAllRatings, returnRatingsByMovieId, returnRatingsByUserId, rateMovie, deleteRating } from "../controllers/ratingController.js"

const router = Router()

router.get('/', returnAllRatings)
router.get('/movie/:id', returnRatingsByMovieId)
router.get('/user/:id', returnRatingsByUserId)
// Make route to get rating by userId and movieId for linking ratings and reviews together
// Should average rating for movie be in backend or frontend?
// (from ratingController.js:) Should backend or frontend be used to figure out what movie is being rated?
// And if the movie is in tmdb or not. 
// front end hoitaa tämän (elokuvan haku -> elokuvan arviointi)
router.post('/rate', auth, rateMovie)
router.delete('/:id', auth, deleteRating)

export default router