import { ApiError } from "../helper/apiError.js"

import { 
    getAllGroups,
    modelCreateGroup,
    addOwnerAsMember,
    getGroupById,
    getGroupByOwner,
    getGroupByMember,
    getGroupByName,
    getGroupMemberCount,
    getGroupOwnerNickname,
    deleteGroupById,
    //group invites:
    createGroupInvite,
    getPendingInvite,
    isUserMemberOfGroup,
    hasPendingInvite,
    acceptGroupInvite,
    declineGroupInvite} from "../models/groupActions.js"


/*
File contains following controllers (in the following order):
- create new group
- return all groups
- return group by id
- return groups where user is the owner
- return groups where the user is a member
- return group member count
- return group owner username
- delete group by id
- group invites
*/


// Create a new group --> Add group to groups table
const createGroup = async (req, res, next) =>
{
    try
    {   // get group data from request body
        const {group} = req.body
        console.log(req.body)

        if (!group || !group.name)  // the group must have at least a name. Description will be optional.
        {   
            return next (new ApiError('Group name is required', 400))   // if no name, send error with status 400 (bad request)
        }

        // Get user id from the currently logged-in user that will become the owner
        const ownerId = req.user.id

        // Check if the group name already exists. We can't have two groups with the same name.
        const existingGroup = await getGroupByName(group.name)
        if (existingGroup)
        {
            return next (new ApiError('Group name already taken', 400))
        }

        // call model function to create group --> add a new group into the database
        const result = await modelCreateGroup (group.name, group.description || "", ownerId )
        const newGroup = result.rows[0]

        console.log('Creating a new group')

        // Add group owner as a member in the group_members table
        await addOwnerAsMember (ownerId, newGroup.id)

        return res.status(201).json({
            id: newGroup.id,
            name: newGroup.name,
            created:newGroup.created, 
            owner: newGroup.owner,
            description: newGroup.description,
        })

    }
    catch (err)
    {
        console.error('createGroup error:', err)
        return res.status(500).json({error:err.message})
    }
}


// Return all groups from groups table / return all rows from groups table
const returnAllGroups = async (req, res, next) =>
{
    try
    {
        const rows = await getAllGroups() // call model function, fetch groups from database
        return res.status(200).json(rows) // respond with an array of groups
    }
    catch (err)
    {
        console.error('returnAllGroups error', err)
        return res.status(500).json({error:err.message}) // return HTTP 500 error if database fetch fails
    }
}



// Return group by ID
const returnGroupById = async (req, res, next) =>
{
    try
    {
        const group = await getGroupById(req.params.id) // required parameters come from the URL --> /groups/1 --> in which case the required parameter id is "1"
        
        if (!group)
        {
            return res.status(404).json({message: 'Group not found'}) // if no group is found with that id, send 404 (not found)
        }

        return res.status(200).json(group) // return group if it is found
    }
    catch (err)
    {
        console.error('returnGroupById error', err)
        return res.status(500).json({error:err.message}) // 500 server error
    }
}


// Return group(s) where user is the owner
const returnGroupByOwner = async (req, res,next) =>
{
    try
    {
        const ownerId = req.user.id // get id from the logged in user(owner)
        const group = await getGroupByOwner(ownerId) // Get all the groups from db where "owner" matches with ownerId

        if (group.length === 0) // if the return is no rows, that means that there is no groups where user is the owner
        {
            return res.status(404).json({message: 'No groups owned by this user'})
        }
        return res.status(200).json(group) // if rows were found, user is the owner of some group(s), send status 200 (OK)
    }
    catch (err)
    {
        console.error('returnGroupsByOwner error:', err)
        return res.status(500).json({error:err.message})
    }
}



// Return groups where the user is a member
const returnGroupByMember = async (req,res,next) =>
{
    try
    {
        const memberId = req.user.id //get id from the logged in user(member)
        const groups = await getGroupByMember(memberId)

        if (groups.length === 0) // if no groups were found, return 404 (not found) 
        {
            return res.status(404).json({message:'No groups found for this member'})
        }
        return res.status(200).json(groups)
    }
    catch (err)
    {
        console.error('returnGroupByMember error:',err)
        return res.status(500).json({error:err.message})
    }
}


// Return group by name
const returnGroupByName = async (req,res,next) =>
{
    try 
    { // AI suggested that I add here: const name = req.params.name 
        const group = await getGroupByName(req.params.name)

        if (!group)
        {
            return res.status(404).json({message: 'Group not found'})
        }
        return res.status(200).json(group) // return group if it is found
    }
    catch (err)
    {
        console.error('returnGroupByName error', err)
        return res.status(500).json({error:err.message}) // 500 server error
    }
}


// Return the number of members in a group
const returnGroupMemberCount = async (req, res, next) =>
{
    try
    {
        const groupId = parseInt(req.params.id, 10);

        if (isNaN(groupId)) {
            return res.status(400).json({ message: "Invalid group ID" });
        }

        const count = await getGroupMemberCount(groupId);

        return res.status(200).json({ groupId, memberCount: count });
    }
    catch (err)
    {
        console.error('returnGroupMemberCount error:', err);
        return res.status(500).json({ error: err.message });
    }
}

// Return the username of the group owner
const returnGroupOwner = async (req, res, next) =>
{
    try
    {
        const groupId = parseInt(req.params.id, 10);

        if (isNaN(groupId)) {
            return res.status(400).json({ message: "Invalid group ID" });
        }

        const username = await getGroupOwnerNickname(groupId);

        if (!username) {
            return res.status(404).json({ message: "Group or owner not found" });
        }

        return res.status(200).json({ groupId, owner: username });
    }
    catch (err)
    {
        console.error('returnGroupOwner error:', err);
        return res.status(500).json({ error: err.message });
    }
}

 
// Delete group by ID
const removeGroupById = async (req, res, next) =>
{
    try{
        const groupId = req.params.id
        const userId = req.user.id

        const group = await getGroupById(groupId)

        if (!group) // if no group found with this id, return 404
        {
            return res.status(404).json({message: 'Group not found'})
        }
        // Check to see if the logged-in user is the group owner
        if (group.owner !== userId)
        {
            return res.status(403).json({message: 'Only group owner can delete this group'})
        }
        // if the logged-in user is the owner, continue with the deletion:
        const deletedGroup = await deleteGroupById(groupId) // call model to delete the group

        return res.status(200).json({message: 'Group deleted succesfully', deleted: deletedGroup})
    }
    catch (err)
    {
        console.error('removeGroupById error:', err)
        return res.status(500).json({error: err.message})
    }
}   

// GROUP INVITES:

// Send a join request (create a new group invite)
const sendJoinRequest = async (req, res, next) => 
{
    try
    {
        const userId = req.user.id // logged in user
        const {groupId} = req.body // the group user wants to join

        // join request requires a group id
        if (!groupId) 
        {
            return next(new ApiError("Group ID is required to send a join request"))
        }
        // check if the group exists. you can only join an existing group
        const group = await getGroupById(groupId)
        if (!group)
        {
            return res.status(404).json({message: "Group not found"})
        }

        // prevent owner from sending a join request to their own group
        if (group.owner === userId)
        {
            return res.status(400).json({message: "Owner is already a member of the group"})
        }

        //check if user is already a member of this group
        const isMember = await isUserMemberOfGroup(userId, groupId)
        if (isMember) 
        {
            return res.status(400).json({message: "you are already a member of this group"})
        }

        // check if user already has a pending invite for this group
        const hasInvite = await hasPendingInvite (userId, groupId)
        if (hasInvite)
        {
            return res.status(400).json({message:"You already have a pending invite for this group"})
        }

        // if everything is ok, create the invite
        const newInvite = await createGroupInvite (groupId, userId)
        return res.status(201).json({message:"Join request sent", invite: newInvite})
    }
    catch (err)
    {
        console.error("sendJoinRequest error:", err)
        return res.status(500).json({error:err.message})
    }
}

//Get pending invites for a group (only owner can see)
const returnPendingInvite = async (req,res,next) =>
{
    try
    {
        const ownerId = req.user.id
        const groupId = req.params.id

        //check if group exists
        const group = await getGroupById(groupId)
        if (!group) 
        {
          return res.status(404).json({message:"Group not found"})
        }

        //check if logged in user is the group owner
        if (group.owner !== ownerId)
        {
            return res.status(403).json({message:"Only group owner can view pending invites"})
        }

        //get pending invites
        const invites = await getPendingInvite (groupId)
        if (invites.length === 0)
        {
            return res.status(404).json({message: "No pending invites for this group"})
        }
        return res.status(200).json(invites)
    } catch (err) {
        console.error("returnPendingInvites error:", err)
        return res.status(500).json({error:err.message})
    }
}


// Accept invite
const acceptInvite = async (req,res,next) =>
{
    try
    {
        const ownerId = req.user.id
        const {inviteId, groupId, userId } = req.body

        //make sure that group exists
        const group = await getGroupById(groupId)
        if (!group) return res.status(404).json({message:"Group not found"})
        
        //only owner can accept
        if (group.owner !== ownerId)
        {
            return res.status(403).json({message:"Only group owner can accept invites"})
        }

        const addedMember = await acceptGroupInvite(inviteId, groupId, userId)
        
        return res.status(200).json
        ({
            message: `Invite accepted. User has been added to group "${group.name}"`,
            groupId: group.id,
            groupName: group.name,
            member: addedMember
        })
    } catch (err) {
        console.error("acceptInvite error:",err)
        return res.status(500).json({error:err.message})
    }
}

//Decline invite
const declineInvite = async (req,res,next) =>
{
    try
    {
        const ownerId = req.user.id
        const { inviteId, groupId } = req.body

        //make sure that group exists
        const group = await getGroupById(groupId)
        if (!group) return res.status(404).json({message:"Group not found"})
        
        //only owner can decline
        if (group.owner !== ownerId)
        {
            return res.status(403).json({message:"Only group owner can decline invites"})
        }

        const declined = await declineGroupInvite(inviteId)

        return res.status(200).json
        ({
            message: `Invite declined for group "${group.name}"`,
            groupId: group.id,
            groupName: group.name,
            declinedInvite: declined
        })
    } catch (err) {
        console.error("declinedInvite error:",err)
        return res.status(500).json({error:err.message})
    }
}








export {
    createGroup,
    returnAllGroups,
    returnGroupById,
    returnGroupByOwner,
    returnGroupByMember,
    returnGroupByName,
    returnGroupMemberCount,
    returnGroupOwner,
    removeGroupById,
    //group invites:
    sendJoinRequest,
    returnPendingInvite,
    acceptInvite,
    declineInvite
}