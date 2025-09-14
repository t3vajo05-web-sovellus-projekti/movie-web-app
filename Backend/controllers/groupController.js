import { getAllGroups, modelCreateGroup, addOwnerAsMember, getGroupById, getGroupByName, deleteGroupById } from "../models/groupActions.js"
import { ApiError } from "../helper/apiError.js"


/****************************************************************
 * DELETE THIS LATER!
TABLE: groups
Columns:
- id            [PK] integer
- name          character varying 255
- created       timestamp without time zone
- owner         integer --> linked to TABLE users with column: id
- description   text
 ****************************************************************/


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
        const {group} = req.body

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



export {
    returnAllGroups,
    createGroup
}