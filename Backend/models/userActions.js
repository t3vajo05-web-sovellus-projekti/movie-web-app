import { pool } from '../helper/db.js'

const getAllUsers = async () =>
{
    const result = await pool.query('SELECT * FROM users')
    return result.rows
}

export { getAllUsers }