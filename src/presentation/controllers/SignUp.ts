import { IHttpRequest, IHttpResponse } from '../protocols/IHttp'
import { MissingParamsError } from '../errors/MissingParamsError'

export class SignUpController {
  public handle (httpRequest: IHttpRequest): IHttpResponse {
    if (!httpRequest.body.name) {
      return {
        statusCode: 400,
        body: new MissingParamsError('name')
      }
    }
    if (!httpRequest.body.email) {
      return {
        statusCode: 400,
        body: new MissingParamsError('email')
      }
    }
  }
}
