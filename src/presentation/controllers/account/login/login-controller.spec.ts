import { LoginController } from './login-controller'
import { MissingParamsError } from '@presentation/errors'
import { Authentication, Validator } from './login-controller-protocols'
import {
  AuthenticationModel,
  AuthenticationModelResponse
} from '@domain/usecases/account/authentication'
import {
  badRequest,
  serverError,
  unauthorizedError,
  ok
} from '@presentation/helper/http/http-helper'

type SutTypes = {
  sut: LoginController
  validatorStub: Validator
  authenticationStub: Authentication
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    isValid(input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth(
      authentication: AuthenticationModel
    ): Promise<AuthenticationModelResponse> {
      return new Promise(resolve =>
        resolve({
          accessToken: 'valid_token',
          email: 'any_mail@mail.com',
          name: 'any_name',
          role: 'any_role'
        })
      )
    }
  }
  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const authenticationStub = makeAuthenticationStub()
  const validatorStub = makeValidatorStub()
  const sut = new LoginController(authenticationStub, validatorStub)
  return {
    sut,
    authenticationStub,
    validatorStub
  }
}
type HttpRequestLogin = {
  body: {
    email: string
    password: string
  }
}

const makeFakeHttpRequest = (): HttpRequestLogin => ({
  body: {
    email: 'any_mail@mail.com',
    password: 'any_password'
  }
})

describe('LoginController', () => {
  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(async () => {
      throw new Error()
    })
    const httpRequest = makeFakeHttpRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(serverError(new Error()))
  })

  test('should call Authentication if values is valid', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('should return 401 if invalid credential is provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest = makeFakeHttpRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(unauthorizedError())
  })

  test('should return 200 if valid credentials is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(
      ok({
        accessToken: 'valid_token',
        email: 'any_mail@mail.com',
        name: 'any_name',
        role: 'any_role'
      })
    )
  })

  test('Should call Validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const addSpy = jest.spyOn(validatorStub, 'isValid')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if valid return Error', async () => {
    const { sut, validatorStub } = makeSut()
    jest
      .spyOn(validatorStub, 'isValid')
      .mockReturnValueOnce(new MissingParamsError('any_field'))
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(
      badRequest(new MissingParamsError('any_field'))
    )
  })
})
