import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest } from '../../helper/http-helper'
import { MissingParamsError, InvalidParamError } from '../../errors'
import { EmailValidator } from '../signup/signup-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly emailValidator: EmailValidator
  ) {}

  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamsError(field))
      }
    }
    const { email } = httpRequest.body
    const isValid = this.emailValidator.isValid(email)
    if (!isValid) {
      return badRequest(new InvalidParamError('email'))
    }
    return new Promise(resolve => resolve(badRequest(new MissingParamsError('email'))))
  }
}
