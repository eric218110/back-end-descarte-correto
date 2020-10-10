import { Router } from 'express'
import { addpterRoute } from '@main/adapters/express/express-route-adapter'
import { adaptMiddleware } from '@main/adapters/express/express-middleware-adapter'
import { makeAuthMiddleware } from '@main/factories/middlewares/auth/auth-middleware-factory'
import { makeFileImageUploadMiddleware } from '@main/factories/middlewares/upload/upload-image-middleware'
import { makeAddPointController } from '@main/factories/controllers/point/add-point/add-point-controller-factory'
import { makeLoadPointByIdController } from '@main/factories/controllers/point/load-point-by-id/load-point.by-id-controlle-factory'
import { makeLoadPointsController } from '@main/factories/controllers/point/load-points/load-points-controller-factory'
import { makeFilterPointsController } from '@main/factories/controllers/point/filter-points/filter-points-controller-factory'

export default (router: Router): void => {
  const activeUserAuthRouter = adaptMiddleware(makeAuthMiddleware('user'))
  const uploadImage = adaptMiddleware(makeFileImageUploadMiddleware())
  router.post(
    '/point',
    uploadImage,
    activeUserAuthRouter,
    addpterRoute(makeAddPointController())
  )

  router.get('/point/:id', addpterRoute(makeLoadPointByIdController()))

  router.get('/points', addpterRoute(makeLoadPointsController()))

  router.get(
    '/points/filter/:items',
    addpterRoute(makeFilterPointsController())
  )
}
