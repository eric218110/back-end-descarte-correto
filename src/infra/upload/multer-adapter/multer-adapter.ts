import multer from 'multer'
import { ImageFileUploader, FileUploadProps } from '@data/protocols/upload/image-file-uploader'
import { MulterHelper } from '@infra/upload/helper/multer-helper'
import { SavedFileStorage } from '@data/protocols/upload/storage/saved-file-storage'
export class MulterAdapter implements ImageFileUploader {
  async imageUpload (file: FileUploadProps, saveFileStorage: SavedFileStorage): Promise<void> {
    const { request, response } = file
    const upload = multer(MulterHelper.setConfig(multer)).single('file')
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    upload(request, response, async (errorMulter: any) => {
      try {
        if (errorMulter) {
          throw new Error(errorMulter.message)
        }
        const imageUrl = await saveFileStorage.saveFile(request)
        request.body.file = imageUrl
      } catch (error) {
        request.body.error = error.message
      }
    })
  }
}
