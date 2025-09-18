import { pool } from '../helper/db.js'

/* 
TABLE: groups
Columns:
- id            [PK] integer
- name          character varying 255
- created       timestamp without time zone
- owner         integer --> linked to TABLE users with column: id
- description   text
 */


/*in controllers:
- create new group
- return all groups
- return group by id
- return groups where user is the owner
- return groups where the user is a member
- delete group by id
*/

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
    const result = await pool.query('SELECT * FROM groups WHERE owner = $1', [owner]) // Get all the groups from db where "owner" matches with ownerId
    return result.rows // return all groups as an array
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


/*
// Get group by name
const getGroupByName = async (name) =>
{
    const result = await pool.query('SELECT * FROM groups WHERE name = $1', [name])
    return result.rows[0] || null
}*/



// Delete group by id
const deleteGroupById = async (id) =>
{
    const result = await pool.query('DELETE FROM groups WHERE id = $1 RETURNING *', [id])
    return result.rows[0] || null
}





export {
    getAllGroups,
    modelCreateGroup,
    addOwnerAsMember,
    getGroupById,
    getGroupByOwner,
    getGroupByMember,
    //getGroupByName,
    deleteGroupById
}
