import express, { Express } from 'express'
import middlewares from './middlewares'
import routes from './routes'
import { resolve } from 'path'

const appExpress = express()

export default (): Express => {
  appExpress.use('/files/', express.static(resolve('temp', 'uploads')))
  middlewares(appExpress)
  routes(appExpress)
  return appExpress
}
