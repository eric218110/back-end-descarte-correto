import { Middleware, HttpRequest, HttpResponse } from '@presentation/protocols'
import { forbidden, ok, serverError } from '@presentation/helper/http/http-helper'
import { AccessDeniedError } from '@presentation/errors/access-denied-error copy'
import { LoadAccountByToken } from '@domain/usecases/load-accout-by-token'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = await httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken)
        if (account) {
          return ok({ accountId: account.id })
        }
      }
      return new Promise(resolve => resolve(forbidden(new AccessDeniedError())))
    } catch (error) {
      return serverError(error)
    }
  }
}
