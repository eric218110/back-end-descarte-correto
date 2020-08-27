import { SavedImageStorage } from '@data/protocols/upload/storage/saved-image-storage'

export class StorageTypeLocalAdapter implements SavedImageStorage {
  constructor (
    private readonly staticPathFilesUrl: string
  ) {}

  async saveImage (request: any): Promise<string> {
    if (request === undefined) {
      throw TypeError('request is required')
    }
    if (request.file === undefined) {
      throw TypeError('file is required')
    }
    if (request.file.filename === undefined) {
      throw TypeError('field filename is required')
    }
    const filename: string = request.file.filename
    const pathUrlFile = `${this.staticPathFilesUrl}${filename}`
    return pathUrlFile
  }
}
