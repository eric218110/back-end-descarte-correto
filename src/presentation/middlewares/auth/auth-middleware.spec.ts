import { AuthMiddleware } from './auth-middleware'
import {
  HttpRequest,
  LoadAccountByToken,
  forbidden,
  ok,
  serverError,
  AccessDeniedError,
  AccountModel
} from './auth-middleware-protocols'

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

const makeSut = (role?: string): SutTypes => {
  const fakeHttpRequest = makeFakeHttpRequest()
  const fakeAccountModel = makeFakeAccountModel()
  const loadAccountByTokenStub = makeLoadAccountByTokenStub(fakeAccountModel)
  const sut = new AuthMiddleware(loadAccountByTokenStub, role)
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

  test('should return 403 if LoadAccountByToken return null', async () => {
    const { sut, loadAccountByTokenStub, fakeHttpRequest } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load').mockReturnValueOnce(
      new Promise(resolve => resolve(null))
    )
    const httpResponse = await sut.handle(fakeHttpRequest)
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('should call LoadAccountByToken with correct accessToken', async () => {
    const role: string = 'any_role'
    const { sut, loadAccountByTokenStub, fakeHttpRequest } = makeSut(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await sut.handle(fakeHttpRequest)
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('should return 200 and object with accountId if LoadAccountByToken return an account', async () => {
    const { sut, fakeHttpRequest, fakeAccountModel } = makeSut()
    const httpResponse = await sut.handle(fakeHttpRequest)
    expect(httpResponse).toEqual(ok({ accountId: fakeAccountModel.id }))
  })

  test('should return 500 if LoadAccountByToken throws', async () => {
    const { sut, fakeHttpRequest, loadAccountByTokenStub } = makeSut()
    jest.spyOn(loadAccountByTokenStub, 'load')
      .mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })
    const httpResponse = await sut.handle(fakeHttpRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
