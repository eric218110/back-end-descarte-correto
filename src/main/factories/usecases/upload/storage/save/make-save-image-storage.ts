import { makeStorageTypeProxy } from '../storage-type-proxy'
import { SaveImage } from '@data/usecases/upload/upload-image/save-image'
import { MulterAdapter } from '@infra/upload/multer-adapter/multer-adapter'

export const makeSaveImage = (): SaveImage => {
  const multerAdapter = new MulterAdapter()
  return new SaveImage(multerAdapter, makeStorageTypeProxy())
}
