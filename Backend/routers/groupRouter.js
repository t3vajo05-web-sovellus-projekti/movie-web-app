import { Router } from 'express'
import { auth } from '../helper/auth.js'
import { 
    createGroup,
    returnAllGroups,
    returnGroupById,
    returnGroupByOwner,
    returnGroupByMember,
    returnGroupByName,
    returnGroupMemberCount,
    returnGroupOwner,
    removeGroupById } from '../controllers/groupController.js'

const router = Router()

router.post('/create', auth, createGroup)

router.get('/', returnAllGroups)

router.get('/membercount/:id', returnGroupMemberCount)
router.get('/owner/:id', returnGroupOwner)
router.get('/owned', auth, returnGroupByOwner)
router.get('/member',auth, returnGroupByMember) 
router.get('/groupname/:name', returnGroupByName) 

router.get('/:id', returnGroupById) // keep this on the bottom of all the router.gets.

router.delete('/:id', auth, removeGroupById)

export default router