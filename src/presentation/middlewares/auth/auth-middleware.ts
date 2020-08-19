import {
  Middleware,
  HttpRequest,
  HttpResponse,
  LoadAccountByToken,
  forbidden,
  ok,
  serverError,
  AccessDeniedError
} from './auth-middleware-protocols'

export class AuthMiddleware implements Middleware {
  constructor (
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly role?: string
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const accessToken = await httpRequest.headers?.['x-access-token']
      if (accessToken) {
        const account = await this.loadAccountByToken.load(accessToken, this.role)
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