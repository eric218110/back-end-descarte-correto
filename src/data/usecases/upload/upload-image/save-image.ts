import { UploadImage, ImageFileUploader, FileProps } from './save-image-protocols'

export class SaveImage implements UploadImage {
  constructor (
    private readonly imageFileUploader: ImageFileUploader,
    private readonly storageType: 'LOCAL' | 'ONLINE'
  ) {}

  async upload (requestFile: FileProps): Promise<void> {
    await this.imageFileUploader.imageUpload(requestFile, this.storageType)
  }
}
