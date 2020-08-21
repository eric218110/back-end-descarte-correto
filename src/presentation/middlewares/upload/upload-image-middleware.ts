import {
  Middleware,
  HttpRequest,
  HttpResponse,
  UploadImage,
  serverError,
  ok,
  badRequest,
  UploadFileError
} from './upload-image-middleware-protocols'

export class UploadImageMiddleware implements Middleware {
  constructor (
    private readonly uploadImage: UploadImage
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const imageUrl = await this.uploadImage.upload(httpRequest.file)
      if (imageUrl) {
        return ok({ imageUrl })
      }
      return badRequest(new UploadFileError())
    } catch (error) {
      return serverError(error)
    }
  }
}
