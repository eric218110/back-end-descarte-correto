import {
  UploadImage,
  ImageFileUploader,
  FileProps
} from './save-image-protocols'
import { SavedImageStorage } from '@data/protocols/upload/storage/saved-image-storage'

export class SaveImage implements UploadImage {
  constructor(
    private readonly imageFileUploader: ImageFileUploader,
    private readonly saveFileStorage: SavedImageStorage
  ) {}

  async upload(requestFile: FileProps): Promise<void> {
    await this.imageFileUploader.imageUpload(requestFile, this.saveFileStorage)
  }
}
