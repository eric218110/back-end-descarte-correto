import { SavedFileStorage } from '@data/protocols/upload/storage/saved-file-storage'
import { StorageSaveFile } from '@domain/usecases/upload/storage/storage-save-file'

export class SavedImageStorage implements StorageSaveFile {
  constructor (
    private readonly savedFileStorage: SavedFileStorage
  ) {}

  async save (request: any): Promise<void> {
    await this.savedFileStorage.saveFile(request)
  }
}
