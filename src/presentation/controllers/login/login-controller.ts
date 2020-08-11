import { Controller, HttpRequest, HttpResponse } from '../../protocols'
import { badRequest } from '../../helper/http-helper'
import { MissingParamsError } from '../../errors'

export class LoginController implements Controller {
  public async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const requiredFields = ['email', 'password']
    for (const field of requiredFields) {
      if (!httpRequest.body[field]) {
        return badRequest(new MissingParamsError(field))
      }
    }

    return new Promise(resolve => resolve(badRequest(new MissingParamsError('email'))))
  }
}
