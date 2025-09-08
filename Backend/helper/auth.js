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

export { auth }
