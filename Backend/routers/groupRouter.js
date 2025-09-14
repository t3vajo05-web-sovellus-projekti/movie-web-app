import { Router } from 'express'
import { returnAllGroups, createGroup } from '../controllers/groupController.js'
import { auth } from '../helper/auth.js'

const router = Router()

router.get('/', returnAllGroups)
router.post('/create', auth, createGroup) // muokattu lisäämällä: auth

export default router