import { hash, compare } from 'bcrypt'
import { getAllUsers, addUser, getUserByEmail, getUserByUsername } from "../models/userActions.js";
import { ApiError } from "../helper/apiError.js";
import pkg from 'jsonwebtoken'

const { sign } = pkg

const returnAllUsers = async (req, res, next) =>
{
    // Returns all rows from users table
    try
    {
        const rows = await getAllUsers()
        return res.status(200).json(rows)
    }
    catch (err)
    {
        console.error('returnAllUsers error:', err)
        return res.status(500).json({ error: err.message })
    }
}

const signUp = async (req, res, next) =>
{
    // Adds a new user to users table
    try
    {
        const { user } = req.body

        if (!user || !user.email || !user.password || !user.username)
        {
            return next(new ApiError('Email, username and password are required', 400))
        }

        // Password must be at least 8 chars, include a number and a capital letter
        const pwRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/
        if (!pwRegex.test(user.password))
        {
            return next(new ApiError('Password requirements were not met', 400))
        }

        // Check existing
        if (await getUserByEmail(user.email))
        {
            return next(new ApiError('Email already in use', 400))
        }
        if (await getUserByUsername(user.username))
        {
            return next(new ApiError('Username already in use', 400))
        }

        console.log(`Creating a new user`)

        const hashedPassword = await hash(user.password, 10)
        const result = await addUser(user.username, user.email, hashedPassword)

        return res.status(201).json({
            id: result.rows[0].id,
            email: user.email,
            username: user.username
        })
    }
    catch (err)
    {
        console.error('SignUp error:', err)
        return res.status(500).json({ error: err.message })
    }
    
}

export { returnAllUsers, signUp }