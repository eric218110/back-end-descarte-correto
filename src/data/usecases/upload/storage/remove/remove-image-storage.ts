import { StorageRemoveFile } from '@domain/usecases/upload/storage/storage-remove-file'
import { RemovedImageStorage } from '@data/protocols/upload/storage/remove-image-storage'

export class RemoveImageStorage implements StorageRemoveFile {
  constructor(private readonly removedImageStorage: RemovedImageStorage) {}

  async remove(pathFile: string): Promise<void> {
    await this.removedImageStorage.removeImage(pathFile)
  }
}
