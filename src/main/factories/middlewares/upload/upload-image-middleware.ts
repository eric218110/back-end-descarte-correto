import { Middleware } from '@presentation/protocols'
import { UploadImageMiddleware } from '@presentation/middlewares/upload/upload-image-middleware'
import { SaveImage } from '@data/usecases/upload/upload-image/save-image'
import { MulterAdapter } from '@infra/upload/multer-adapter/multer-adapter'

export const makeFileImageUploadMiddleware = (): Middleware => {
  const multerAdapter = new MulterAdapter()
  const uploadImage = new SaveImage(multerAdapter)
  return new UploadImageMiddleware(uploadImage)
}
