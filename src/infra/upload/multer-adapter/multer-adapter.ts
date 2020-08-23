import { ImageFileUploader, FileUploadProps } from '@data/protocols/upload/image-file-uploader'
import multer from 'multer'
import { resolve } from 'path'

export class MulterAdapter implements ImageFileUploader {
  async imageUpload (file: FileUploadProps): Promise<string> {
    const { request, response } = file
    const config = {
      uploadsFolder: resolve('temp', 'uploads'),
      storage: multer.diskStorage({
        destination: resolve('temp', 'uploads'),
        filename (request, file, callback) {
          const hash = Date.now()
          const fileName = `${hash}-${file.originalname}`
          return callback(null, fileName)
        }
      }),
      limits: {
        fileSize: 2 * 1024 * 1024
      },
      fileFilter: (request: any, file: any, cb: any) => {
        const allowedMimes = [
          'image/jpeg',
          'image/pjpeg',
          'image/png'
        ]

        if (allowedMimes.includes(file.mimetype)) {
          cb(null, true)
        } else {
          cb(new Error('File not supported'))
        }
      }
    }

    const upload = multer(config).single('file')

    upload(request, response, function (error: any) {
      if (error) {
        return null
      }
    })
    return new Promise(resolve => resolve('void'))
  }
}
