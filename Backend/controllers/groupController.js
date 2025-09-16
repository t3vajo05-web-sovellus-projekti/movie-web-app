import { getAllGroups, modelCreateGroup, addOwnerAsMember, getGroupById, getGroupByName, deleteGroupById } from "../models/groupActions.js"
import { ApiError } from "../helper/apiError.js"



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

        // Get user id from the currently logged-in user
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









export {
    returnAllGroups,
    createGroup,
    returnGroupById,
    //returnGroupByName,
    removeGroupById
}