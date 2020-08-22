import { ImageFileUploader } from '@data/protocols/upload/image-file-uploader'

export class MulterAdapter implements ImageFileUploader {
  async imageUpload (file: { request: any, response: any }): Promise<string> {
    return new Promise(resolve => resolve('http://image_url.com'))
  }
}
