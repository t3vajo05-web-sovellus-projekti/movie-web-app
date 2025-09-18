import { Router } from "express"
import { auth } from "../helper/auth.js"
import { 
    returnAllReviews, 
    returnReviewsByMovieId, 
    returnReviewsByUserId, 
    reviewMovie, 
    deleteReview 
} from "../controllers/reviewController.js"

const router = Router()

router.get('/', returnAllReviews)
// return latest reviews (sort by datetime)
// return latest reviews from user
router.get('/movie/:id', returnReviewsByMovieId)
router.get('/user/:id', returnReviewsByUserId)
router.post('/review', auth, reviewMovie)
router.delete('/:id', auth, deleteReview)

export default router