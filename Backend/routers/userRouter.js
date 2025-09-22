import { Router } from 'express'
import { auth } from '../helper/auth.js'
import { returnAllUsers, signUp, signIn, deleteUser, returnMyUserInfo, changePassword } from '../controllers/userController.js'

const router = Router()

router.get('/', returnAllUsers)
router.get('/me', auth, returnMyUserInfo)
router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/delete', auth, deleteUser)
router.post('/changepw', auth, changePassword)

export default router