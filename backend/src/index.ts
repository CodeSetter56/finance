import express from 'express'
import { checkConnection} from './db/db.js'
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import cors from 'cors'
import cookiesParser from 'cookie-parser'

const app = express()
const PORT = process.env.PORT

app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173', 
  credentials: true,
}))
app.use(express.urlencoded({ extended: true }))
app.use(cookiesParser())

app.use('/api/auth', authRoute)
app.use('/api/user', userRoute)

app.listen(PORT, async() => {
  console.log(`\n Server running at http://localhost:${PORT}`)
  await checkConnection()
})
