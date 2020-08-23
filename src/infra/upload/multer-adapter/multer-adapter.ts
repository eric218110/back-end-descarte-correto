import { ImageFileUploader, FileUploadProps } from '@data/protocols/upload/image-file-uploader'
import multer from 'multer'
import { MulterHelper } from '../helper/multer-helper'
export class MulterAdapter implements ImageFileUploader {
  async imageUpload (file: FileUploadProps): Promise<void> {
    const { request, response } = file
    const config = {
      uploadsFolder: MulterHelper.uploadDir(),
      storage: multer.diskStorage({
        destination: MulterHelper.uploadDir(),
        filename (request, file, callback) {
          return callback(null, MulterHelper.generateFileName(file.originalname))
        }
      }),
      limits: MulterHelper.limitImageUpload(),
      fileFilter: MulterHelper.fileFilter
    }

    const upload = multer(config).single('file')

    upload(request, response, (error: any) => {
      if (!error) {
        if (MulterHelper.fileExist(request)) {
          request.body.file = request.file.filename
        }
      }
    })
  }
}
