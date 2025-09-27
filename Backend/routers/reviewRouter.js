import { Router } from "express"
import { auth } from "../helper/auth.js"
import { 
    returnAllReviews, 
    returnReviewsByMovieId, 
    returnReviewsByUserId, 
    returnLatestReviews,
    returnLatestReviewsByUser,
    returnUserReviewCount,
    returnMovieReviewCount,
    reviewMovie, 
    returnReviewByUserAndMovieId,
    deleteReview,
    returnLatestReviewsByMovieId
} from "../controllers/reviewController.js"

const router = Router()

router.get('/', returnAllReviews)
router.get('/movie/:id', returnReviewsByMovieId)
router.get('/movie/:id/latest', returnLatestReviewsByMovieId)
router.get('/user/:id', returnReviewsByUserId)
router.get('/latest', returnLatestReviews)                  // change limit with query parameter ?limit=...
router.get('/user/:id/latest', returnLatestReviewsByUser)   // example: /latest?limit=5
router.get('/user/:id/count', returnUserReviewCount)
router.get('/movie/:id/count', returnMovieReviewCount)
router.get('/user/:userId/movie/:movieId', returnReviewByUserAndMovieId)
router.post('/review', auth, reviewMovie)
router.delete('/:id', auth, deleteReview)

export default router