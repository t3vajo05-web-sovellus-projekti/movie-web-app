import { Router } from "express"
import { auth } from "../helper/auth.js"
import { 
    returnAllReviews, 
    returnReviewsByMovieId, 
    returnReviewsByUserId, 
    returnLatestReviews,
    returnLatestReviewsByUser,
    reviewMovie, 
    deleteReview 
} from "../controllers/reviewController.js"

const router = Router()

router.get('/', returnAllReviews)
router.get('/movie/:id', returnReviewsByMovieId)
router.get('/user/:id', returnReviewsByUserId)
router.get('/latest', returnLatestReviews)                  // change limit with query parameter ?limit=...
router.get('/user/:id/latest', returnLatestReviewsByUser)   // example: /latest?limit=5
router.post('/review', auth, reviewMovie)
router.delete('/:id', auth, deleteReview)

export default router