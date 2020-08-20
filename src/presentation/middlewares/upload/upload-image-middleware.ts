import {
  Middleware,
  HttpRequest,
  HttpResponse,
  UploadImage
} from './upload-image-middleware-protocols'

export class UploadImageMiddleware implements Middleware {
  constructor (
    private readonly uploadImage: UploadImage
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.uploadImage.upload(httpRequest.file)
    return new Promise(resolve => resolve(null))
  }
}
