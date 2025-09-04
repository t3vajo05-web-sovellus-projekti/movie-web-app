import express from 'express'
import cors from 'cors'
import { pool } from './helper/db.js'

const port = 3001
const app = express()

app.use(cors())

app.get('/', (req, res) => {
    res.status(200).json({result: "Success"})
})

app.get('/users', (req, res) => {
    pool.query('SELECT * FROM users', (err, result) => {
        console.log("Getting users")
        if (err) {
            console.error("Query error:", err)
            return res.status(500).json({error: err.message})
        }
        console.log("Query result:", result.rows)
        res.status(200).json(result.rows || [])
        })
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})