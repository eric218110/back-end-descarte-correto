import { SavedFileStorage } from '@data/protocols/upload/storage/saved-file-storage'

export class StorageTypeLocalAdapter implements SavedFileStorage {
  constructor (
    private readonly staticPathFilesUrl: string
  ) {}

  async saveFile (request: any): Promise<string> {
    const filename: string = request.file.filename
    const pathUrlFile = `${this.staticPathFilesUrl}${filename}`
    return pathUrlFile
  }
}
