import { Router } from 'express'
import { fetchTheatres, getShowsByTheatre, getEventById } from '../controllers/finnkinoController.js'

const router = Router()

router.get('/theatres', fetchTheatres)
router.get('/showsByTheatre/:theatreId', getShowsByTheatre)
router.get('/event/:eventId', getEventById)


export default router