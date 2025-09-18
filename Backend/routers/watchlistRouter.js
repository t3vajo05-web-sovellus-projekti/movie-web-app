import { Router } from 'express'
import { auth } from '../helper/auth.js'
import { getMyWatchlist, addWatchlistItem, deleteWatchlistItem, toggleFavoriteItem, setStatusItem } from '../controllers/watchlistController.js'

const router = Router()

router.get('/', auth, getMyWatchlist)
router.post('/:movieId', auth, addWatchlistItem)
router.delete('/:movieId', auth, deleteWatchlistItem)
router.patch('/item/:id/favorite', auth, toggleFavoriteItem)
router.patch('/item/:id/status', auth, setStatusItem)

export default router