import {
  HttpRequest,
  HttpResponse,
  Controller,
  AddAccount,
  Validator
} from './signup-controller-protocols'
import {
  badRequest,
  serverError,
  ok,
  forbidden
} from '@presentation/helper/http/http-helper'
import { Authentication } from '../login/login-controller-protocols'
import { EmailInUserError } from '@presentation/errors'

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validator: Validator,
    private readonly authentication: Authentication
  ) {}

  public async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isError = this.validator.isValid(httpRequest.body)
      if (isError) {
        return badRequest(isError)
      }
      const { name, email, password } = httpRequest.body

      const account = await this.addAccount.add({
        name,
        email,
        password
      })
      if (!account) {
        return forbidden(new EmailInUserError())
      }
      const accountResponse = await this.authentication.auth({
        email,
        password
      })
      return ok(accountResponse)
    } catch (error) {
      return serverError(error)
    }
  }
}
