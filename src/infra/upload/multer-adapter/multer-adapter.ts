import multer from 'multer'
import { ImageFileUploader, FileUploadProps } from '@data/protocols/upload/image-file-uploader'
import { MulterHelper } from '@infra/upload/helper/multer-helper'
import { SavedFileStorage } from '@data/protocols/upload/storage/saved-file-storage'
export class MulterAdapter implements ImageFileUploader {
  async imageUpload (file: FileUploadProps, saveFileStorage: SavedFileStorage): Promise<void> {
    const { request, response } = file
    const upload = multer(MulterHelper.setConfig(multer)).single('file')
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    upload(request, response, async (error: any) => {
      if (!error) {
        if (MulterHelper.fileExist(request)) {
          await saveFileStorage.saveFile(request, request.file.filename)
        }
      } else {
        request.body.error = error.message
      }
    })
  }
}
