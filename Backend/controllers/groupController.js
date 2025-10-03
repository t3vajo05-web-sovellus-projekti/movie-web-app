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
    getMemberOfGroupsCount, 
    getOwnerOfGroupsCount,
    getGroupMembers,
    addShowtimeToGroup,
    getShowtimesForGroup,
    deleteShowtimeFromGroup,
    //group invites:
    createGroupInvite,
    getPendingInviteByGroupId,
    getPendingInviteByInviteId,
    isUserMemberOfGroup,
    hasPendingInvite,
    acceptGroupInvite,
    declineGroupInvite,
    changeGroupDescription,
    // leaving group:
    leaveGroup
    } from "../models/groupActions.js"


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
- leaving group
- removing user from group (as owner)
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
        return res.status(500).json({error:err.message})
    }
}


// Return group(s) where user is the owner
const returnGroupByOwner = async (req, res, next) =>
{
    try
    {
        // Use :id if provided, else fallback to logged in user
        const ownerId = req.params.id || req.user.id;

        const groups = await getGroupByOwner(ownerId);

        if (!groups || groups.length === 0)
        {
            return res.status(404).json({ message: 'No groups owned by this user' });
        }

        return res.status(200).json(groups);
    }
    catch (err)
    {
        console.error('returnGroupsByOwner error:', err);
        return res.status(500).json({ error: err.message });
    }
};
    


// Return groups where the user is a member
const returnGroupByMember = async (req, res, next) =>
    {
        try
        {
            // Use :id if provided in params, otherwise fallback to logged in user
            const memberId = req.params.id || req.user.id;
    
            const groups = await getGroupByMember(memberId);
    
            return res.status(200).json(groups);
        }
        catch (err)
        {
            console.error('returnGroupByMember error:', err);
            return res.status(500).json({ error: err.message });
        }
    };
    


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

// Returns group members from given group id
const returnGroupMembers = async (req,res,next) =>
{
    try
    {
        const groupId = req.params.id
        const members = await getGroupMembers(groupId)
        return res.status(200).json(members)
    } catch (err) {
        console.error('returnGroupMembers error:', err)
        return res.status(500).json({error:err.message})
    }
}

// GROUP INVITES:

// Send a join request (create a new group invite)
const sendJoinRequest = async (req, res, next) => 
{
    try
    {
        const userId = req.user.id // logged in user
        const groupId = req.body.id // the group user wants to join

        // join request requires a group id
        if (!groupId) 
        {
            return next(new ApiError('Group ID is required to send a join request', 400))
        }
        // check if the group exists. you can only join an existing group
        const group = await getGroupById(groupId)
        if (!group)
        {
            return next(new ApiError('Group not found', 404))
        }

        // prevent owner from sending a join request to their own group
        if (group.owner === userId)
        {
            return next(new ApiError('Owner is already a member of the group', 400))
        }

        //check if user is already a member of this group
        const isMember = await isUserMemberOfGroup(userId, groupId)
        if (isMember) 
        {
            return next(new ApiError('You are already a member of this group', 400))
        }

        // check if user already has a pending invite for this group
        const hasInvite = await hasPendingInvite (userId, groupId)
        if (hasInvite)
        {
            return next(new ApiError('You already have a pending join request for this group', 400))
        }

        // if everything is ok, create the invite
        const newInvite = await createGroupInvite (groupId, userId)
        console.log(`Creating a group invite (sending a join request)`)

        return res.status(201).json({
            message:"Join request sent", 
            id: newInvite.id,
            groupid: newInvite.groupid,
            user_id: newInvite.user_id,
            created: newInvite.created
        })
    }
    catch (err)
    {
        console.error("sendJoinRequest error:", err)
        return next(new ApiError(err.message, 500))
    }
}


const modifyGroupDescription = async (req,res,next) =>
{
    try
    {
        const ownerId = req.user.id
        const { groupId, newDescription } = req.body

        if (!groupId) return next(new ApiError("Group ID required", 400))
        if (newDescription === undefined) return next(new ApiError("New description required", 400))

        // make sure that group exists
        const group = await getGroupById(groupId)
        if (!group) return next(new ApiError("Group not found", 404))

        // check if the logged in user is the group owner
        if (group.owner !== ownerId) return next(new ApiError("Only group owner can modify group description", 403))

        // if previous checks are ok, continue with the modification:
        console.log(`Owner ${ownerId} is modifying description of group ${groupId}`)

        const result = await changeGroupDescription (groupId, newDescription)
        if (!result) return next(new ApiError("Failed to modify group description", 500))

        const modifiedGroup = result.rows[0]

        return res.status(200).json({
            message: "Group description modified",
            id: modifiedGroup.id,
            description: modifiedGroup.description
        })
    } catch (err) {
        console.error("modifyGroupDescription error:", err)
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
          return next(new ApiError('Group not found', 404))
        }

        //check if logged in user is the group owner
        if (group.owner !== ownerId)
        {
            return next(new ApiError('Only group owner can view pending invites', 403))
        }

        //get pending invites
        console.log(`Getting pending invites for group ${groupId} by owner ${ownerId}`);
        const invites = await getPendingInviteByGroupId (groupId)

        return res.status(200).json(invites)
    } catch (err) {
        console.error("returnPendingInvites error:", err)
        return res.status(500).json({error:err.message})
    }
}

const hasPendingInviteForUserAndGroup = async (req,res,next) =>
{
    try
    {
        const userId = req.user.id;
        const groupId = req.params.groupId;
        
        //check if group exists
        const group = await getGroupById(groupId)
        if (!group) 
        {
          return next(new ApiError('Group not found', 404))
        }

        const exists = await hasPendingInvite(userId, groupId)
        res.json({pending: exists})
    } catch (err)
    {
        console.error("hasPendingInviteForUserAndGroup error:",err)
        return res.status(500).json({error:err.message})
    }
}

// Accept the pending invite
const acceptInvite = async (req,res,next) =>
{
    try 
    {
        const ownerId = req.user.id
        const { inviteId } = req.body

        // check that invite exists
        const invite = await getPendingInviteByInviteId(inviteId)
        if (!invite) return next(new ApiError("Invite not found", 404))

        // check that group exists
        const group = await getGroupById(invite.groupid)
        if (!group) return next (new ApiError("Group not found", 404))

        // check if the logged in user is the group owner
        if (group.owner !== ownerId) return next(new ApiError('Only group owner can accept invites', 403))

        // accept invite
        const member = await acceptGroupInvite(inviteId)

        //if everything goes ok:
        console.log(`Invite (id: ${inviteId}) accepted for group "${group.name}"`)
        return res.status(200).json({
            message: `Invite accepted. User has been added to group.`,
            groupId: group.id,
            groupName: group.name,
            userId: member.user_id
        })
    } catch (err) {
        console.error ("acceptInvite error:", err)
        return next(err)
    }
}


//Decline invite
const declineInvite = async (req,res,next) =>
{
    try
    {
        const ownerId = req.user.id
        const { inviteId } = req.body

        // check that invite exists
        const invite = await getPendingInviteByInviteId(inviteId)
        if (!invite) return next(new ApiError("Invite not found", 404))

        // check that group exists
        const group = await getGroupById(invite.groupid)
        if (!group) return next(new ApiError("Group not found", 404))

        //only owner can decline
        if (group.owner !== ownerId)
        {
            return next(new ApiError("Only group owner can decline invites", 403))
        }

        // delete invite after previous checks
        const declined = await declineGroupInvite(inviteId)

        console.log(`Invite (id: ${inviteId}) declined for group "${group.name}"`)
        return res.status(200).json
        ({
            message: `Invite declined`,
            groupId: group.id,
            groupName: group.name,
            userId: invite.user_id,
            group_invite: declined
        })
    } catch (err) {
        console.error("declinedInvite error:",err)
        return res.status(500).json({error:err.message})
    }
}

// LEAVING GROUP
// ...and removing member

const leaveGroupController = async (req,res,next) => 
    {
        try 
        {
            const userId = req.user.id
            const { groupId } = req.body
            console.log(`User ${userId} requested to leave group ${groupId}`)
            
            if (!groupId)
            {
                return res.status(400).json({message:"Group ID required"})
            }

            //make sure that group exists
            const group = await getGroupById(groupId)
            if (!group) return next(new ApiError("Group not found", 404))
            
            // owner cannot leave their own group
            if (group.owner === userId)
            {
                return next(new ApiError("Group owner cannot leave their own group", 400))
            }

            // check if user is a member
            const isMember = await isUserMemberOfGroup (userId, groupId)
            if (!isMember)
            {
                return next(new ApiError("You are not a member of this group", 400))
            }

            // check if the row was actually deleted
            // if "left" is null, leaving failed
            // if "left" contains a row, deletion succeeded and user left the group
            const left = await leaveGroup (userId, groupId)
            if (!left)
            {
                return next(new ApiError("Failed to leave group", 500))
            }

            // if everything goes ok, leave group:
            return res.status(200).json
            ({
                message: `You have left the group.`,
                groupId: group.id,
                groupName: group.name,
                userId: userId
            })
        } catch (err) {
            console.error("leaveGroupController error:",err)
            return res.status(500).json({error:err.message})
        }
    }


// Remove user from group (as group owner)
const removeUserFromGroup = async (req,res,next) =>
{
    try
    {
        const ownerId = req.user.id
        const {userId, groupId} = req.body

        if (!groupId) return next(new ApiError("Group ID required", 400))
        if (!userId) return next(new ApiError("Member's user ID required", 400))

        // make sure that group exists
        const group = await getGroupById(groupId)
        if (!group) return next(new ApiError("Group not found", 404))

        // check if the logged in user is the group owner
        if (group.owner !== ownerId) return next(new ApiError("Only group owner can remove users from group", 403))

        // owner cannot remove themselves from the group
        if (group.owner === userId) return next(new ApiError("Group owner cannot remove themselves from group", 400))
        
        // check if user is a member
        const isMember = await isUserMemberOfGroup (userId, groupId)
        if (!isMember) return next(new ApiError("User you want to remove is not a member of this group", 400))

        // if previous checks are ok, continue with the removal:
        // reusing the model from leaving group, because functionality is the same
        console.log(`Owner ${ownerId} is removing user ${userId} from group ${groupId}`)
        const removed = await leaveGroup (userId, groupId)
        if (!removed) return next(new ApiError("Failed to remove user from group", 500))

        return res.status(200).json({
            message: `User has been removed from group`,
            groupId: group.id,
            groupName: group.name,
            userId: userId
        })

    } catch (err) {
        console.error("removeUserFromGroup error:", err)
        return res.status(500).json({error:err.message})
    }
} 

// COUNTS:

const returnMemberOfGroupsCount = async (req, res, next) => {
    try {
        const userId = req.params.id

        const count = await getMemberOfGroupsCount(userId)

        return res.status(200).json({count})
    } catch (err) {
        console.error('returnGroupMemberStats error:', err)
        return res.status(500).json({error:err.message})
    }
}

const returnOwnerOfGroupsCount = async (req, res, next) => {
    try {
        const userId = req.params.id

        const count = await getOwnerOfGroupsCount(userId)

        return res.status(200).json({count})
    } catch (err) {
        console.error('returnGroupOwnerStats error:', err)
        return res.status(500).json({error:err.message})
    }
}

const showtimeToGroup = async (req,res,next) =>
{
    try
    {
        const groupId = req.params.id
        const { showtimeArray } = req.body

        if (!groupId) return next(new ApiError("Group ID required", 400))

        if (!showtimeArray || !Array.isArray(showtimeArray) || showtimeArray.length === 0)
        {
            return next(new ApiError("showtimeArray is required and must be a non-empty array", 400))
        }

        // showtimeArray can include:
        // theatername, auditoriumname, title, show_start_time, runtime, year, finnkinourl, imageurl
        // mandatory values in showtimeArray: theatername, title, show_start_time
        if (!showtimeArray.every(showtime => showtime.theatername && showtime.title && showtime.show_start_time)) {
            return next(new ApiError("Each showtime must include theatername, title, and show_start_time", 400));
        }

        // make sure that group exists
        const group = await getGroupById(groupId)
        if (!group) return next(new ApiError("Group not found", 404))

        // if previous checks are ok, continue with adding showtime to group:
        console.log(`Adding showtime to group ${groupId}`)

        const added = await addShowtimeToGroup (groupId, showtimeArray)
        if (!added)
        {
            return next(new ApiError("Failed to add showtime to group", 500))
        }
        return res.status(200).json({message:"Showtime added to group", added})
    }
    
    catch (err) {
        console.error('returnGroupOwnerStats error:', err)
        return res.status(500).json({error:err.message})
    }
}

const returnShowtimesForGroup = async (req,res,next) =>
{
    try
    {
        const groupId = req.params.id

        if (!groupId) return next(new ApiError("Group ID required", 400))

        const group = await getGroupById(groupId)
        if (!group) return next(new ApiError("Group not found", 404))

        const showtimes = await getShowtimesForGroup (groupId)
        return res.status(200).json(showtimes)
    }
    catch (err) {
        console.error('returnShowtimesForGroup error:', err)
        return res.status(500).json({error:err.message})
    }
}

const removeShowtimeFromGroup = async (req,res,next) =>
{
    try
    {
        const groupId = req.params.id
        const { showtimeId } = req.body

        const removed = await deleteShowtimeFromGroup (groupId, showtimeId)
        if (!removed) return next(new ApiError("Failed to remove showtime from group", 500))
        return res.status(200).json({message:"Showtime removed from group", removed})
    } 
    catch (err) {
        console.error('removeShowtimeFromGroup error:', err)
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
    returnGroupMembers,
    modifyGroupDescription,
    showtimeToGroup,
    returnShowtimesForGroup,
    removeShowtimeFromGroup,
    //group invites:
    sendJoinRequest,
    returnPendingInvite,
    hasPendingInviteForUserAndGroup,
    acceptInvite,
    declineInvite,
    //leaving group:
    leaveGroupController,
    removeUserFromGroup,
    //counts:
    returnMemberOfGroupsCount,
    returnOwnerOfGroupsCount
}