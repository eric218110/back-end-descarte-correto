import { forbidden } from '@presentation/helper/http/http-helper'
import { AccessDeniedError } from '@presentation/errors/access-denied-error copy'
import { AuthMiddleware } from './auth-middleware'

describe('AuthMiddleware', () => {
  test('should return 403 if no x-access-token is exist in headers', async () => {
    const sut = new AuthMiddleware()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
