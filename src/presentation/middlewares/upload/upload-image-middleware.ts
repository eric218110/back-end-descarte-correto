import {
  Middleware,
  HttpRequest,
  HttpResponse,
  UploadImage,
  serverError
} from './upload-image-middleware-protocols'
import { ok } from '../auth/auth-middleware-protocols'

export class UploadImageMiddleware implements Middleware {
  constructor (
    private readonly uploadImage: UploadImage
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const fileUpload = await this.uploadImage.upload(httpRequest.file)
      return ok({ image: fileUpload })
    } catch (error) {
      return serverError(error)
    }
  }
}
