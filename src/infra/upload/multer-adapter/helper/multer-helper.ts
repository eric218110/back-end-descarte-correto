import { resolve } from 'path'

export const MulterHelper = {

  limitImageUpload (): { fileSize: number } {
    return {
      fileSize: 2 * 1024 * 1024
    }
  },

  generateFileName (originalname: string): string {
    const hash = Date.now()
    const fileName = `${hash}-${originalname}`
    return fileName
  },

  uploadDir (): string {
    return resolve('temp', 'uploads')
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
      cb(new Error('File not supported'), false)
    }
  },

  setConfig: (multer: any): {} => {
    return {
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
  }

}
