import { getAllUsers } from "../models/userActions.js";
import { ApiError } from "../helper/apiError.js";

const returnAllUsers = async (req, res, next) =>
{
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

export { returnAllUsers }