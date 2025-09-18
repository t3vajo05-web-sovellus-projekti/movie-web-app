import { getWatchlist, addToWatchlist, deleteFromWatchlist, toggleFavoriteById, setStatus } from "../models/watchlistActions.js"

const getMyWatchlist = async (req, res, next) => {
    try 
    {
        const userId = req.user.id
        const rows = await getWatchlist(userId)
        return res.status(200).json(rows)
    }
    catch(err)
    {
        next(err)
    }
}

const addWatchlistItem = async (req, res, next) => {
    try
    {
        const userId = req.user.id
        const movieId = String(req.params.movieId || req.body.movieId)
        const item = await addToWatchlist(userId, movieId)
        return res.status(201).json(item)
    }
    catch(err)
    {
        next(err)
    }
}

const deleteWatchlistItem = async (req, res, next) => {
    try
    {
        const movieId = String(req.params.movieId || req.body.movieId)
        const item = await deleteFromWatchlist(movieId)
        return res.status(201).json(item)
    }
    catch(err)
    {
        next(err)
    }
}

const toggleFavoriteItem = async (req, res, next) => {
    try
    {
        const id = Number(req.params.id)
        const item = await toggleFavoriteById(id)
        return res.status(200).json(item)
    }
    catch(err)
    {
        next(err)
    }
}

const setStatusItem = async (req, res, next) => {
    try
    {
    const id = Number(req.params.id)
    const { status } = req.body
    const item = await setStatus(id, status)
    return res.status(200).json(item)
    } catch (err)
    {
        next(err)
    }
}

export { getMyWatchlist, addWatchlistItem, deleteWatchlistItem, toggleFavoriteItem, setStatusItem }