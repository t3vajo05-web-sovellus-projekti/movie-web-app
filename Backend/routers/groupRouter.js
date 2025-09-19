import { Router } from 'express'
import { auth } from '../helper/auth.js'
import { 
    createGroup,
    returnAllGroups,
    returnGroupById,
    returnGroupByOwner,
    returnGroupByMember,
    //returnGroupByName,
    removeGroupById, 
    returnGroupMemberCount,
    returnGroupOwner} from '../controllers/groupController.js'

const router = Router()

router.post('/create', auth, createGroup)
router.get('/', returnAllGroups)
router.get('/:id', returnGroupById)
router.get('/membercount/:id', returnGroupMemberCount)
router.get('/owner/:id', returnGroupOwner)
//router.get('/:owner', returnGroupByOwner) ISSUE WITH THIS, WILL FIX LATER
//router.get('/:member', returnGroupByMember) ISSUE WITH THIS, WILL FIX LATER
//router.get('/:name', returnGroupByName) ISSUE WITH THIS, WILL FIX LATER
router.delete('/:id', auth, removeGroupById)

export default router