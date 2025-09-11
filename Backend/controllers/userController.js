import { hash, compare } from 'bcrypt'
import { getAllUsers, addUser, getUserByEmail, getUserByUsername, actionSignInByEmail, actionSignInByUsername, actionDeleteUserById } from "../models/userActions.js";
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

const signIn = async (req, res, next) =>
{
    try
    {
        const { user } = req.body

        console.log(user)

        if(!user || !user.identifier || !user.password) // Use identifier and password fields in body to log in
        {
            return next(new ApiError('Email or username and password are required', 400))
        }

        console.log('User is logging in')

        // Checks if identified is email or not
        let result

        const emailRegex = /^.+@.+\..+$/

        if(emailRegex.test(user.identifier))
        {
            // Tries to log in using email
            result = await actionSignInByEmail(user.identifier)
        }
        else
        {
            // Tries to log in using username
            result = await actionSignInByUsername(user.identifier)
        }

        if(result.rows.length === 0)
        {
            console.log('User not found')
            return next(new ApiError('User not found', 404))
        }

        const dbUser = result.rows[0] // Data from user table
        console.log('dbUser:', dbUser)

        const isMatch = await compare(user.password, dbUser.hashed_password)

        if(!isMatch)
        {
            console.log('Invalid password')
            return next(new ApiError('Invalid password', 401))
        }

        // User infos for the token
        const payload = 
        {
            id: dbUser.id,
            uuid: dbUser.user_uuid,
            email: dbUser.email,
            username: dbUser.username
        }


        const token = sign(payload, process.env.JWT_SECRET_KEY) // Signs the token with all the user info from db

        console.log(`User logged in: ${dbUser.username}`)
        return res.status(200).json({
            token
        })
    }
    catch(err)
    {
        console.error('SignIn error:', err)
        return res.status(500).json({ error: err.message })
    }
}

const deleteUser = async (req, res, next) => {
    // deletes user from users table, using id in generated token
    try {
        const userId = req.user.id

        if(!userId) {
            return next(new ApiError('User ID is missing from token', 400))
        }

        const deletedUser = await actionDeleteUserById(userId)

        if(!deletedUser) {
            return next(new ApiError('User not found', 404))
        }

        return res.status(200).json({
            message: `User ${deletedUser.username} deleted successfully`, deletedUser
        })
    } catch (err) {
        console.error('deleteUser error:', err)
        return res.status(500).json({ error: err.message })
    }
}

export { returnAllUsers, signUp, signIn, deleteUser }