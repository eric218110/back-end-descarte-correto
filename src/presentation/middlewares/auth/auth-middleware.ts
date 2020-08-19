import { Middleware, HttpRequest, HttpResponse } from '@presentation/protocols'
import { forbidden } from '@presentation/helper/http/http-helper'
import { AccessDeniedError } from '@presentation/errors/access-denied-error copy'

export class AuthMiddleware implements Middleware {
  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    return new Promise(resolve => resolve(forbidden(new AccessDeniedError())))
  }
}
