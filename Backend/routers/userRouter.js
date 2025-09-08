import { Router } from 'express'
import { returnAllUsers, signUp, signIn } from '../controllers/userController.js'

const router = Router()

router.get('/', returnAllUsers)
router.post('/signup', signUp)
router.post('/signin', signIn)

export default router