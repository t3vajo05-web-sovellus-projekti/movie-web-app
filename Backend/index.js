import express from 'express'
import cors from 'cors'
import { ApiError } from './helper/apiError.js';
import { pool } from './helper/db.js'
import userRouter from './routers/userRouter.js'
import movieRouter from './routers/movieRouter.js'
import groupRouter from './routers/groupRouter.js'
import ratingRouter from './routers/ratingRouter.js'
import reviewRouter from './routers/reviewRouter.js'
import watchlistRouter from './routers/watchlistRouter.js'

const port = 3001
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.status(200).json({result: "Success"})
})

app.use('/users',userRouter)
app.use('/movies', movieRouter)
app.use('/groups', groupRouter)
app.use('/ratings', ratingRouter)
app.use('/reviews', reviewRouter)
app.use('/watchlist', watchlistRouter)

app.use((err, req, res, next) => {
    if (err instanceof ApiError) {
        // Our custom API error
        return res.status(err.status || 500).json({ error: err.message });
    }
    // Default: internal server error
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})