import { ApiError } from "../helper/apiError.js"

import { 
    modelCreateGroup, 
    getAllGroups, 
    addOwnerAsMember, 
    getGroupById, 
    //getGroupByName, 
    deleteGroupById, 
    getGroupByMember, 
    getGroupByOwner } from "../models/groupActions.js"


/*
File contains following controllers (in the following order):
- create new group
- return all groups
- return group by id
- return groups where user is the owner
- return groups where the user is a member
- delete group by id
*/


// Create a new group --> Add group to groups table
const createGroup = async (req, res, next) =>
{
    try
    {   // get group data from request body
        const group = req.body
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
        const newGroup = result.rows[0] // data from group table?

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


// Return groups where user is the owner
const returnGroupByOwner = async (req, res,next) =>
{
    try
    {
        const ownerId = req.user.id // get id from the logged in user(owner)
        const groups = await getGroupByOwner(ownerId) // Get all the groups from db where "owner" matches with ownerId

        if (groups.length === 0) // if the return is no rows, that means that there is no groups where user is the owner
        {
            return res.status(404).json({message: 'No groups owned by this user'})
        }
        return res.status(200).json(result.rows) // if rows were found, user is the owner of some group(s), send status 200 (OK)
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

        if (result.rows.length === 0) // if no groups were found, return 404 (not found) 
        {
            return res.status(404).json({message:'No groups found for this member'})
        }
    }
    catch (err)
    {
        console.error('returnGroupByMember error:',err)
        return res.status(500).json({error:err.message})
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



/* some issues with this code and approach, will figure it out later
// Return group by name
const returnGroupByName = async (req,res,next) =>
{
    try 
    {
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
}*/



export {
    createGroup,
    returnAllGroups,
    returnGroupById,
    returnGroupByOwner,
    returnGroupByMember,
    //returnGroupByName,
    removeGroupById
}