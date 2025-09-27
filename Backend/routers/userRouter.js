import { Router } from 'express'
import { auth } from '../helper/auth.js'
import { signUp, signIn, deleteUser, returnMyUserInfo, changePassword, returnUsername } from '../controllers/userController.js'

const router = Router()

router.get('/me', auth, returnMyUserInfo)
router.get('/:id/username', returnUsername)
router.post('/signup', signUp)
router.post('/signin', signIn)
router.post('/delete', auth, deleteUser)
router.post('/changepw', auth, changePassword)

export default router