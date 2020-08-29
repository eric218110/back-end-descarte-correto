import multer from 'multer'
import { ImageFileUploader, FileUploadProps } from '@data/protocols/upload/image-file-uploader'
import { MulterHelper } from '@infra/upload/multer-adapter/helper/multer-helper'
import { SavedImageStorage } from '@data/protocols/upload/storage/saved-image-storage'
import { promisify } from 'util'
export class MulterAdapter implements ImageFileUploader {
  async imageUpload (file: FileUploadProps, saveFileStorage: SavedImageStorage): Promise<void> {
    const { request, response } = file
    const upload = multer(MulterHelper.setConfig(multer)).single('file')
    await promisify(upload)(request, response).then(async () => {
      try {
        const imageUrl = await saveFileStorage.saveImage(request)
        request.body.file = imageUrl
      } catch (error) {
        request.body.error = error.message
      }
    }).catch((error) => {
      request.body.error = error.message
    })
  }
}
