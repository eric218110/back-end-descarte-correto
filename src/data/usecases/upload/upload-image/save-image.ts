import { UploadImage, ImageFileUploader, FileProps } from './save-image-protocols'
import { SavedFileStorage } from '@data/protocols/upload/storage/saved-file-storage'

export class SaveImage implements UploadImage {
  constructor (
    private readonly imageFileUploader: ImageFileUploader,
    private readonly saveFileStorage: SavedFileStorage
  ) {}

  async upload (requestFile: FileProps): Promise<void> {
    await this.imageFileUploader.imageUpload(requestFile, this.saveFileStorage)
  }
}
