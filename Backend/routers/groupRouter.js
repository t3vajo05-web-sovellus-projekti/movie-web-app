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
    removeGroupById, 
    returnMemberOfGroupsCount,
    returnOwnerOfGroupsCount,
    returnGroupMembers,
    modifyGroupDescription,
    //group invites:
    sendJoinRequest,
    acceptInvite,
    declineInvite,
    returnPendingInvite,
    hasPendingInviteForUserAndGroup,
    //leaving group:
    leaveGroupController,
    removeUserFromGroup
     } from '../controllers/groupController.js'

const router = Router()

router.post('/create', auth, createGroup)
router.post('/invite/join',auth, sendJoinRequest)
router.post('/invite/accept',auth,acceptInvite)
router.post('/invite/decline', auth, declineInvite)
router.post('/leave', auth, leaveGroupController)
router.post('/remove-user', auth, removeUserFromGroup)
router.post('/modify-description', auth, modifyGroupDescription)

router.get('/', returnAllGroups)

router.get('/membercount/:id', returnGroupMemberCount)
router.get('/owner/:id', returnGroupOwner)
router.get('/owned', auth, returnGroupByOwner) // Gets all groups owned by the authenticated user
router.get('/owned/:id', auth, returnGroupByOwner) // Gets all groups owned by the user with the specified ID
router.get('/member',auth, returnGroupByMember)  // Gets all groups where the authenticated user is a member
router.get('/member/:id', returnGroupByMember)  // Gets all groups where the user with the specified ID is a member
router.get('/members/:id', returnGroupMembers) // Get all members of a group by group id
router.get('/groupname/:name', returnGroupByName)
router.get('/invite/pending/:id', auth, returnPendingInvite)
router.get('/invite/pending/:groupId/for-user', auth, hasPendingInviteForUserAndGroup)

router.get('/:id', returnGroupById) // keep this on the bottom of all the router.gets.

router.delete('/:id', auth, removeGroupById)
router.get('/member/:id/count', returnMemberOfGroupsCount)
router.get('/owner/:id/count', returnOwnerOfGroupsCount)

export default router