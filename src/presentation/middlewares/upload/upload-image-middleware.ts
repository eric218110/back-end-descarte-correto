import {
  Middleware,
  HttpRequest,
  HttpResponse,
  UploadImage,
  serverError
} from './upload-image-middleware-protocols'

export class UploadImageMiddleware implements Middleware {
  constructor (
    private readonly uploadImage: UploadImage
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      await this.uploadImage.upload(httpRequest.file)
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
