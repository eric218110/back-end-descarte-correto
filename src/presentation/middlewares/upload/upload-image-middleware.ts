import {
  Middleware,
  HttpRequest,
  HttpResponse,
  UploadImage,
  serverError,
  ok
} from './upload-image-middleware-protocols'

export class UploadImageMiddleware implements Middleware {
  constructor (
    private readonly uploadImage: UploadImage
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const imageUrl = await this.uploadImage.upload(httpRequest.file)
      return ok({ imageUrl })
    } catch (error) {
      return serverError(error)
    }
  }
}
