import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './connectDb/db.js'
import authRoute from './router/authRoute.js'
import movieRoute from './router/movieRoute.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const PORT = process.env.PORT || 2500

const app = express()

app.use(express.json())
app.use(cors())
// {origin: "http://localhost:8080/"}
app.use('/api/auth', authRoute)
app.use('/api/movie', movieRoute)


app.use(express.static(path.join(__dirname, '..', 'Frontend', 'dist')))
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'Frontend', 'dist', 'index.html'))
})


app.listen(PORT, () => {
    connectDB()
    console.log('server started ', PORT)
})