import { Middleware } from '@presentation/protocols'
import { UploadImageMiddleware } from '@presentation/middlewares/upload/upload-image-middleware'
import { SaveImage } from '@data/usecases/upload/upload-image/save-image'
import { MulterAdapter } from '@infra/upload/multer-adapter/multer-adapter'
import env from '@main/config/env'
import { StorageTypeLocalAdapter } from '@infra/upload/storage/local/storage-type-local-adapter'

export const makeFileImageUploadMiddleware = (): Middleware => {
  const multerAdapter = new MulterAdapter()
  const storageType = new StorageTypeLocalAdapter(env.HOST_STATIC_PATH)
  const uploadImage = new SaveImage(multerAdapter, storageType)
  return new UploadImageMiddleware(uploadImage)
}
