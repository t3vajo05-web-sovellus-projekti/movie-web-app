import { pool } from '../helper/db.js'
import { ApiError } from "../helper/apiError.js"

/* File contains following models (should be in order):
- create your own group
- add owner as member
- get all groups
- get group by id
- get groups by owner
- get groups by member
- get group by groupname
- get membercount
- get owner's username 
- delete group by id 
- group invites
- leaving group */

//TODO: Amount of groups I'm a owner of, amount of groups I'm a member of.


// Create your own group 
const modelCreateGroup = (name, description, owner) => 
{
    return pool.query(
        'INSERT INTO groups (name, created, owner, description) VALUES  ($1, NOW(), $2, $3) RETURNING *', [name, owner, description] // $1 --> name, $2 --> owner, $3 --> description
    )
}

// Add owner as member
const addOwnerAsMember = (userId, groupId) =>
{
    return pool.query(
        'INSERT INTO group_members (user_id, memberof, joined) VALUES ($1, $2, NOW()) RETURNING * ',[userId, groupId] // $1 --> user id, $2 --> group id
    )
}

// Get all groups
const getAllGroups = async () =>
{
    const result = await pool.query('SELECT * FROM groups') // await --> wait for db query before moving on
    return result.rows
}


// Get group by id
const getGroupById = async (id) =>
{
    const result = await pool.query('SELECT * FROM groups WHERE id = $1', [id])
    return result.rows[0] || null
}

// Get group(s) by owner
const getGroupByOwner = async (ownerId) =>
{
    const result = await pool.query('SELECT * FROM groups WHERE owner = $1', [ownerId]) // Get all the groups from db where "owner" matches with ownerId
    return result.rows
}


// Get group(s) by member
const getGroupByMember = async (memberId) =>
{
    const result = await pool.query
    (
        `SELECT groups.*
        FROM groups
        JOIN group_members ON groups.id = group_members.memberof
        WHERE group_members.user_id = $1`, [memberId]
    )
    return result.rows
}


// Get group by groupname
const getGroupByName = async (name) =>
{
    const result = await pool.query('SELECT * FROM groups WHERE name = $1', [name])
    return result.rows[0] || null
}

// Get group member count
const getGroupMemberCount = async (groupId) =>
{
    const result = await pool.query
    (
        `SELECT COUNT(*) AS count
            FROM group_members
            WHERE memberof = $1`,
        [groupId]
    );
    return parseInt(result.rows[0].count, 10);
}

// get group owner's username
const getGroupOwnerNickname = async (groupId) =>
{
    // Gets group by id
    const group = await getGroupById(groupId);
    if (!group) return null;

    // Uses groups owner id to get the owners info
    const result = await pool.query(
        `SELECT username
            FROM users
            WHERE id = $1`,
        [group.owner]
    );

    return result.rows[0]?.username || null;
}    

// Delete group by id
const deleteGroupById = async (id) =>
{
    const result = await pool.query('DELETE FROM groups WHERE id = $1 RETURNING *', [id])
    return result.rows[0] || null
}



//GROUP INVITES:

/*
- create new group invite
- get pending invite by group id
- get pending invite by invite id
- accept invite
- decline invite
 */


//create new group invite
const createGroupInvite = async (groupId, userId) =>
{
    const result = await pool.query
    (
        `INSERT INTO group_invites (groupid, user_id, created) 
         VALUES ($1,$2,NOW()) 
         RETURNING * `, [groupId, userId]
    )
    return result.rows[0] || null
}

//get pending group invite by group id
const getPendingInviteByGroupId = async (groupId) =>
{
    const result = await pool.query
    (
        `SELECT *
        FROM group_invites
        WHERE groupid = $1`, [groupId]
    )
    return result.rows // return a list of pending invites
}

// get pending group invite by invite id
const getPendingInviteByInviteId = async (inviteId) =>
{
    const result = await pool.query('SELECT * FROM group_invites WHERE id = $1', [inviteId])
    return result.rows[0] || null
}

// check if user is already a member of a group
const isUserMemberOfGroup = async (userId, groupId) =>
{
    const result = await pool.query(
        `SELECT * 
        FROM group_members 
        WHERE user_id = $1 AND memberof = $2`, [userId, groupId])
        return result.rows.length > 0 // true if already a member
}

//check if user already has a pending invite for a group
const hasPendingInvite = async (userId, groupId) =>
{
    const result = await pool.query
    (
        `SELECT *
        FROM group_invites
        WHERE user_id = $1 AND groupid = $2`, [userId, groupId]
    )
    return result.rows.length>0 // true if invite exists
}


//accept invite (insert member to group_members and delete invite)
const acceptGroupInvite = async (inviteId) =>
{

    const client = await pool.connect() // connect to database and return a client
    try 
    {
        await client.query('BEGIN') // start a transaction

        // fetch invite
        const inviteResult = await client.query(
            `SELECT * FROM group_invites WHERE id = $1`, [inviteId]
        )
        const invite = inviteResult.rows[0]

        //insert user into group_members
        const memberResult = await client.query(
            `INSERT INTO group_members (user_id, memberof, joined)
            VALUES ($1, $2, NOW()) RETURNING *`, [invite.user_id, invite.groupid]
        )
        // delete invite from group_invites now that it has been accepted (member inserted)
        await client.query('DELETE FROM group_invites WHERE id = $1', [inviteId])

        await client.query('COMMIT') // commit the transaction

        return memberResult.rows[0] // return all info about added member
    } catch (err) {
        await client.query ('ROLLBACK') // if any steps fails, undo all changes
        throw err
    } finally {
        client.release() // release the client back to pool
    }
}




//decline invite
const declineGroupInvite = async (inviteId) =>
{
    const result = await pool.query
    (
        'DELETE FROM group_invites WHERE id = $1 RETURNING *', [inviteId]
    )
    return result.rows[0] || null
}


// LEAVING GROUP

//Leave group (remove user from group_members)
const leaveGroup = async (userId, groupId) => {
    const result = await pool.query
    (
        `DELETE FROM group_members
        WHERE user_id = $1 AND memberof = $2 RETURNING *`, [userId, groupId]
    )
    return result.rows[0] || null
}



export {
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
    getPendingInviteByGroupId,
    getPendingInviteByInviteId,
    isUserMemberOfGroup,
    hasPendingInvite,
    acceptGroupInvite,
    declineGroupInvite,
    //leaving group:
    leaveGroup
}
