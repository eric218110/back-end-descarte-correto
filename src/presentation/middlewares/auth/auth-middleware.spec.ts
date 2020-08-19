import { forbidden } from '@presentation/helper/http/http-helper'
import { AccessDeniedError } from '@presentation/errors/access-denied-error copy'
import { AuthMiddleware } from './auth-middleware'
import { HttpRequest } from '@presentation/protocols'
import { LoadAccountByToken } from '@domain/usecases/load-accout-by-token'
import { AccountModel } from '@domain/models/account'

describe('AuthMiddleware', () => {
  test('should return 403 if no x-access-token is exist in headers', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (accessToken: string): Promise<AccountModel> {
        return new Promise(resolve => resolve({
          id: 'any_id',
          email: 'any_email',
          name: 'any_name',
          password: 'any_password'
        }))
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct accessToken', async () => {
    class LoadAccountByTokenStub implements LoadAccountByToken {
      async load (accessToken: string): Promise<AccountModel> {
        return new Promise(resolve => resolve({
          id: 'any_id',
          email: 'any_email',
          name: 'any_name',
          password: 'any_password'
        }))
      }
    }
    const loadAccountByTokenStub = new LoadAccountByTokenStub()
    const sut = new AuthMiddleware(loadAccountByTokenStub)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    const fakeHttpRequest: HttpRequest = {
      headers: {
        'x-access-token': 'any_token'
      }
    }
    await sut.handle(fakeHttpRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
