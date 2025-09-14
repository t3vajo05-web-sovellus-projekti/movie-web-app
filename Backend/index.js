import express from 'express'
import cors from 'cors'
import { pool } from './helper/db.js'
import userRouter from './routers/userRouter.js'
import groupRouter from './routers/groupRouter.js'
import finnkinoRouter from './routers/finnkinoRouter.js'


const port = 3001
const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: false}))

app.get('/', (req, res) => {
    res.status(200).json({result: "Success"})
})

app.use('/users',userRouter)
app.use('/groups', groupRouter)
app.use('/finnkinoapi',finnkinoRouter)


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})