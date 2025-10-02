import express from 'express'
import { apiRouter } from './routes/apiRouter.js'

const app = express()

app.use('/api', apiRouter)

app.use((req, res) => {
  res.status(404).json({message: 'Route not found'})
})

app.listen(8000, () => console.log('listening 8000'))