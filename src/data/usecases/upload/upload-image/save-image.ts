import { UploadImage, ImageFileUploader, FileProps } from './save-image-protocols'

export class SaveImage implements UploadImage {
  constructor (
    private readonly imageFileUploader: ImageFileUploader
  ) {}

  async upload (requestFile: FileProps): Promise<string> {
    const imageUrl = await this.imageFileUploader.imageUpload(requestFile)
    return (imageUrl) || null
  }
}
