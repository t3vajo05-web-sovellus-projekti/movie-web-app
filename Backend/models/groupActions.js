import { pool } from '../helper/db.js'

/* 
DELETE THIS LATER!
TABLE: groups
Columns:
- id            [PK] integer
- name          character varying 255
- created       timestamp without time zone
- owner         integer --> linked to TABLE users with column: id
- description   text
 */


// Get all groups
const getAllGroups = async () =>
{
    const result = await pool.query('SELECT * FROM groups') // await --> wait for db query before moving on
    return result.rows
}

// Create your own group 
// TIIMIN JÄSENET: Onko tämä ok nimi tälle funktiolle vai olisiko jotenkin parempi tapa nimetä?
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

// Get group by id
const getGroupById = async (id) =>
{
    const result = await pool.query('SELECT * FROM groups WHERE id = $1', [id])
    return result.rows[0] || null
}

// Get group by name
const getGroupByName = async (name) =>
{
    const result = await pool.query('SELECT * FROM groups WHERE name = $1', [name])
    return result.rows[0] || null
}

// Delete group by id
const deleteGroupById = async (id) =>
{
    const result = await pool.query('DELETE FROM groups WHERE id = $1 RETURNING *', [id])
    return result.rows[0] || null
}

const getMemberOfGroupsCount = async (user_id) => {
    const result = await pool.query(
        'SELECT COUNT (*) AS member_count FROM group_members WHERE user_id = $1', [user_id]
    )
    return parseInt(result.rows[0].member_count, 10)
}

const getOwnerOfGroupsCount = async (user_id) => {
    const result = await pool.query(
        'SELECT COUNT (*) AS owned_count FROM groups WHERE owner = $1', [user_id]
    )
    return parseInt(result.rows[0].owned_count, 10)
}





export {
    getAllGroups,
    modelCreateGroup,
    addOwnerAsMember,
    getGroupById,
    getGroupByName,
    deleteGroupById,
    getMemberOfGroupsCount,
    getOwnerOfGroupsCount
}
