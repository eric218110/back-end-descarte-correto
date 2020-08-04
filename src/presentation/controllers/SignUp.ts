import { IHttpRequest, IHttpResponse } from '../protocols/IHttp'
import { MissingParamsError } from '../errors/MissingParamsError'
import { badRequest } from '../helper/httpHelper'
import { IController } from '../protocols/IController'

export class SignUpController implements IController {
  public handle (httpRequest: IHttpRequest): IHttpResponse {
    const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamsError(field))
      }
    }
  }
}
