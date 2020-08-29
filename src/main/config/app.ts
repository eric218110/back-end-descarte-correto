import express from 'express'
import middlewares from './middlewares'
import routes from './routes'
import { resolve } from 'path'

const app = express()

app.use('/files/', express.static(resolve('temp', 'uploads')))
middlewares(app)
routes(app)

export default app
