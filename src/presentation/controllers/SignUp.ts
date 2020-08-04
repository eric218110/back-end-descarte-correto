import { IHttpRequest, IHttpResponse } from '../protocols/IHttp'
import { MissingParamsError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helper/httpHelper'
import { IController } from '../protocols/IController'
import { IEmailValidator } from '../protocols/IEmailValidator'

export class SignUpController implements IController {
  private readonly emailValidator: IEmailValidator;

  constructor (emailValidator: IEmailValidator) {
    this.emailValidator = emailValidator
  }

  public handle (httpRequest: IHttpRequest): IHttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']

      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamsError(field))
        }
      }

      const isValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isValid) {
        return badRequest(new InvalidParamError('email'))
      }
    } catch (error) {
      return serverError()
    }
  }
}
