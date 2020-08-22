import { UploadImage, FileProps } from '@domain/usecases/upload/upload-image'
import { ImageFileUploader } from '@data/protocols/upload/image-file-uploader'

export class SaveImage implements UploadImage {
  constructor (
    private readonly imageFileUploader: ImageFileUploader
  ) {}

  async upload (requestFile: FileProps): Promise<string> {
    const imageUrl = await this.imageFileUploader.imageUpload(requestFile)
    return (imageUrl) || null
  }
}
