import { Router } from 'express'
import { auth } from '../helper/auth.js'
import { returnAllUsers, signUp, signIn, deleteUser } from '../controllers/userController.js'

const router = Router()

router.get('/', returnAllUsers)
router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/delete', auth, deleteUser)

export default router