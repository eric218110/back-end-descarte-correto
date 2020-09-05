import { Router } from 'express'
import { addpterRoute } from '@main/adapters/express/express-route-adapter'
import { adaptMiddleware } from '@main/adapters/express/express-middleware-adapter'
import { makeAuthMiddleware } from '@main/factories/middlewares/auth/auth-middleware-factory'
import { makeFileImageUploadMiddleware } from '@main/factories/middlewares/upload/upload-image-middleware'
import { makeAddPointController } from '@main/factories/controllers/point/add-point/add-point-controller-factory'

export default (router: Router): void => {
  const activeUserAuthRouter = adaptMiddleware(makeAuthMiddleware('user'))
  const uploadImage = adaptMiddleware(makeFileImageUploadMiddleware())
  router.post(
    '/point',
    uploadImage,
    activeUserAuthRouter,
    addpterRoute(makeAddPointController())
  )
}
