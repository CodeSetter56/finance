import express from 'express'

const app = express()
const PORT = 3000

app.get('/', (req, res) => {
  res.send('Finance API')
})

app.listen(PORT, () => {
  console.log(`\n Server running at http://localhost:${PORT}`)
})
