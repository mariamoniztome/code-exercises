import express from 'express'
import { productsController } from '../controllers/products.js'
import { servicesController } from '../controllers/services.js'

export const apiRouter = express.Router()

apiRouter.get('/products', productsController)

apiRouter.get('/service', servicesController)