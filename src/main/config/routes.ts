import { Express, Router } from 'express'
import { readdirSync } from 'fs'
import { resolve } from 'path'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  readdirSync(`${resolve(__dirname, '..', 'routes')}`).map(async file => {
    if (
      !file.includes('.test.') &&
      !file.includes('.spec.') &&
      !file.endsWith('.map')
    ) {
      ;(await import(resolve(__dirname, '..', 'routes', file))).default(router)
    }
  })
}
