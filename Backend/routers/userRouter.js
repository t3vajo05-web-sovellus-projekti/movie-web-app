import { Router } from 'express'
import { returnAllUsers, signUp } from '../controllers/userController.js'

const router = Router()

router.get('/', returnAllUsers)
router.post('/signup', signUp)

export default router