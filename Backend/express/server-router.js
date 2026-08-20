import express from 'express'
import { apiRouter } from './routes/apiRouter.js'
import cors from 'cors'

const app = express()

app.use(cors())

app.use('/api', apiRouter)

app.use((req, res) => {
  res.status(404).json({message: 'Route not found'})
})

app.listen(8000, () => console.log('listening 8000'))