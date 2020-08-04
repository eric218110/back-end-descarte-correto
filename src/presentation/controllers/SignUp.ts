import { IHttpRequest, IHttpResponse } from '../protocols/IHttp'
import { MissingParamsError } from '../errors/MissingParamsError'
import { badRequest } from '../helper/httpHelper'

export class SignUpController {
  public handle (httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ['name', 'email', 'password']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamsError(field))
      }
    }
  }
}
