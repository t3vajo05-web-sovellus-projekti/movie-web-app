import jwt from 'jsonwebtoken'

const { verify } = jwt

const auth = (req, res, next) =>
{
    const authHeader = req.headers['authorization']
    if(!authHeader)
    {
        return res.status(401).json({ message: 'No token provided' })
    }

    const token = authHeader.split(' ')[1] // Bearer <token>
    if(!token)
    {
        return res.status(401).json({ message: 'No token provided' })
    }

    verify(token, process.env.JWT_SECRET_KEY, (err, decoded) =>
    {
        if(err)
        {
            return res.status(401).json({ message: 'Failed to authenticate token' })
        }

        req.user = decoded  // Attaches the decoded payload to req.user
        next()
    })
}
/*
Example route showing how to use `req.user` after JWT authentication:

- `auth` middleware verifies the token and attaches the decoded payload to `req.user`.
- Inside the route, you can access `req.user` to get the user's info (id, username, email, etc.).
- This pattern ensures the server knows which user is making the request without trusting the client.
- DO NOT bypass the `auth` middleware in other routes if you need authenticated access.
- Any sensitive user-specific operation should always check `req.user`.

Example:

app.get('/profile', auth, (req, res) =>
{
    res.json({ message: `Hello ${req.user.username}`, id: req.user.id })
})
    
--chatgpt 2025*/

export { auth }
