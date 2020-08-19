import { Router } from 'express'
import { addpterRoute } from '@main/adapters/express/express-route-adapter'
import { makeLoadItemController } from '@main/factories/controllers/item/load-item/load-items-controller'
import { makeAddItemController } from '@main/factories/controllers/item/add-item/add-item-controller-factory'

export default (router: Router): void => {
  router.get('/item', addpterRoute(makeLoadItemController()))
  router.post('/item', addpterRoute(makeAddItemController()))
}
