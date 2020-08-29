import { Middleware } from '@presentation/protocols'
import { UploadImageMiddleware } from '@presentation/middlewares/upload/upload-image-middleware'
import { makeSaveImage } from '@main/factories/usecases/upload/storage/save/make-save-image-storage'

export const makeFileImageUploadMiddleware = (): Middleware => {
  return new UploadImageMiddleware(makeSaveImage())
}
