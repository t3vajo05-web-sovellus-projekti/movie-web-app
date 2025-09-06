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

export { getAllUsers, addUser, getUserByEmail, getUserByUsername }