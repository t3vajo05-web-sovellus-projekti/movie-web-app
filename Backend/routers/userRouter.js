import { Router } from 'express'
import { returnAllUsers } from '../controllers/userController.js'

const router = Router()

router.get('/', returnAllUsers)

export default router