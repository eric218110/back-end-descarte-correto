import { Router } from 'express'
import { addpterRoute } from '@main/adapters/express/express-route-adapter'
import { makeLoadItemController } from '@main/factories/controllers/item/load-item/load-items-controller'
import { makeAddItemController } from '@main/factories/controllers/item/add-item/add-item-controller-factory'
import { adaptMiddleware } from '@main/adapters/express/express-middleware-adapter'
import { makeAuthMiddleware } from '@main/factories/middlewares/auth/auth-middleware-factory'

export default (router: Router): void => {
  const adminAuthRouter = adaptMiddleware(makeAuthMiddleware('admin'))
  router.get('/item', addpterRoute(makeLoadItemController()))
  router.post('/item', adminAuthRouter, addpterRoute(makeAddItemController()))
}
