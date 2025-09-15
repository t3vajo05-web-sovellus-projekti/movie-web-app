import { Router } from 'express'
import { returnAllGroups, createGroup, returnGroupById, removeGroupById } from '../controllers/groupController.js'
import { auth } from '../helper/auth.js'

const router = Router()

router.get('/', returnAllGroups)
router.post('/create', auth, createGroup)
router.get('/:id', returnGroupById)
//router.get('/:name', returnGroupByName) ISSUE WITH THIS, WILL FIX LATER
router.delete('/:id', auth, removeGroupById)

export default router