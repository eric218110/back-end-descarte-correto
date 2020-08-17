import { Router } from 'express'
import { addpterRoute } from '@main/adapters/express/express-route-adapter'
import { makeLoadItemController } from '@main/factories/controllers/item/load-items-controller'

export default (router: Router): void => {
  router.get('/item', addpterRoute(makeLoadItemController()))
}
