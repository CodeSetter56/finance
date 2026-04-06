import express from 'express'
import { db } from './db/db.js'
import { Users } from './db/schema.js'

const app = express()
const PORT = process.env.PORT || 3000

async function checkConnection() {
  try {
    await db.select().from(Users).limit(1)
    console.log('Database connected successfully')
  } catch (err) {
    console.error('Database connection failed:', err)
  }
}

app.get('/', (req, res) => {
  res.send('Finance API')
})

app.listen(PORT, () => {
  console.log(`\n Server running at http://localhost:${PORT}`)
  checkConnection()
})
