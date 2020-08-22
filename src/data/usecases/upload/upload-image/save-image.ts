import { UploadImage, ImageFileUploader, FileProps } from './save-image-protocols'
import { Encrypter } from '@data/protocols/criptography/encrypter'

export class SaveImage implements UploadImage {
  constructor (
    private readonly imageFileUploader: ImageFileUploader,
    private readonly encrypter: Encrypter
  ) {}

  async upload (requestFile: FileProps): Promise<string> {
    const { originalname } = requestFile.request.file
    const index = originalname.lastIndexOf('.')
    const extensionName: string = (index < 0) ? '' : originalname.substr(index)
    const name = `${await this.encrypter.encrypt(originalname)}${extensionName}`
    const imageUrl = await this.imageFileUploader.imageUpload(requestFile, name)
    return (imageUrl) || null
  }
}
