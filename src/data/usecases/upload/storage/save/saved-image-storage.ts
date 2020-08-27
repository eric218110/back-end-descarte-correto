import { SavedImageStorage } from '@data/protocols/upload/storage/saved-image-storage'
import { StorageSaveFile } from '@domain/usecases/upload/storage/storage-save-file'

export class SaveImageStorage implements StorageSaveFile {
  constructor (
    private readonly savedImageStorage: SavedImageStorage
  ) {}

  async save (request: any): Promise<void> {
    await this.savedImageStorage.saveImage(request)
  }
}
