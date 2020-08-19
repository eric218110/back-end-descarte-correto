import { forbidden } from '@presentation/helper/http/http-helper'
import { AccessDeniedError } from '@presentation/errors/access-denied-error copy'
import { AuthMiddleware } from './auth-middleware'
import { HttpRequest } from '@presentation/protocols'
import { LoadAccountByToken } from '@domain/usecases/load-accout-by-token'
import { AccountModel } from '@domain/models/account'

type SutTypes = {
  sut: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
  fakeHttpRequest: HttpRequest
  fakeAccountModel: AccountModel
}

const makeFakeAccountModel = (): AccountModel => ({
  id: 'any_id',
  email: 'any_email',
  name: 'any_name',
  password: 'any_password'
})

const makeFakeHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

const makeLoadAccountByTokenStub = (fakeAccountModel: AccountModel): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(fakeAccountModel))
    }
  }
  return new LoadAccountByTokenStub()
}

const makeSut = (): SutTypes => {
  const fakeHttpRequest = makeFakeHttpRequest()
  const fakeAccountModel = makeFakeAccountModel()
  const loadAccountByTokenStub = makeLoadAccountByTokenStub(fakeAccountModel)
  const sut = new AuthMiddleware(loadAccountByTokenStub)
  return {
    sut,
    loadAccountByTokenStub,
    fakeAccountModel,
    fakeHttpRequest
  }
}

describe('AuthMiddleware', () => {
  test('should return 403 if no x-access-token is exist in headers', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct accessToken', async () => {
    const { sut, loadAccountByTokenStub, fakeHttpRequest } = makeSut()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(fakeHttpRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
