import { Middleware } from '@presentation/protocols'
import { UploadImageMiddleware } from '@presentation/middlewares/upload/upload-image-middleware'
import { SaveImage } from '@data/usecases/upload/upload-image/save-image'
import { MulterAdapter } from '@infra/upload/multer-adapter/multer-adapter'
import env from '@main/config/env'

export const makeFileImageUploadMiddleware = (): Middleware => {
  const multerAdapter = new MulterAdapter()
  const storageType = (env.MODE === 'development') ? 'LOCAL' : 'ONLINE'
  const uploadImage = new SaveImage(multerAdapter, storageType)
  return new UploadImageMiddleware(uploadImage)
}
