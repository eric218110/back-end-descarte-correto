import {
  badRequest,
  serverError,
  unauthorizedError,
  ok
} from '@presentation/helper/http/http-helper'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  Authentication,
  Validator
} from './login-controller-protocols'

export class LoginController implements Controller {
  constructor(
    private readonly authentication: Authentication,
    private readonly validator: Validator
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isError = this.validator.isValid(httpRequest.body)
      if (isError) {
        return badRequest(isError)
      }
      const { email, password } = httpRequest.body
      const account = await this.authentication.auth({
        email,
        password
      })
      if (!account) {
        return unauthorizedError()
      }
      return ok({
        accessToken: account.accessToken,
        email: account.email,
        name: account.name,
        role: account.role
      })
    } catch (error) {
      return serverError(error)
    }
  }
}
