import { pool } from '../helper/db.js'
import { v4 as uuidv4 } from 'uuid'

const getAllUsers = async () =>
{
    const result = await pool.query('SELECT * FROM users')
    return result.rows
}

const addUser = (username, email, pw) =>
{
    const user_uuid = uuidv4()
    return pool.query(
        'INSERT INTO users (user_uuid, username, email, hashed_password) VALUES ($1, $2, $3, $4) RETURNING *', [user_uuid, username, email, pw]
    )
}

const getUserByEmail = async (email) =>
{
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email])
    return result.rows[0] || null
}

const getUserByUsername = async (username) =>
{
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username])
    return result.rows[0] || null
}

const getUsernameById = async (id) => {
    const result = await pool.query('SELECT username FROM users WHERE id = $1', [id])
    return result.rows[0] || null
}

const getUserById = async (id) => {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [id])
    return result.rows[0] || null
}

const actionSignInByEmail = (email) =>
{
    return pool.query('SELECT * FROM users WHERE email = $1', [email])
}

const actionSignInByUsername = (username) =>
{
    return pool.query('SELECT * FROM users WHERE username = $1', [username])
}

const actionDeleteUserById = async (id) => {
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id])
    return result.rows[0] || null
}

const changeMyPassword = async (id, newHashedPassword) => {
    const result = await pool.query('UPDATE users SET hashed_password = $1 WHERE id = $2 RETURNING *', [newHashedPassword, id])
    return result.rows[0] || null
}

export { 
    getAllUsers, 
    addUser, 
    getUserByEmail, 
    getUserByUsername, 
    getUsernameById,
    getUserById,
    actionSignInByEmail, 
    actionSignInByUsername, 
    actionDeleteUserById,
    changeMyPassword
}