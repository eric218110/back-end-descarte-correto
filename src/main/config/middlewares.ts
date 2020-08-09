import { Express } from 'express'
import { bodyParser } from '../middlewares/body-parser'
import { cors } from '../middlewares/cors'
import { contentTypeAsJson } from '../middlewares/content-type-json'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(cors)
  app.use(contentTypeAsJson)
}
