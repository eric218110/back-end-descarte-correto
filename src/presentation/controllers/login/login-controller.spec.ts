import { LoginController } from './login-controller'
import { badRequest, serverError, unauthorizedError, ok } from '../../helper/http-helper'
import { MissingParamsError, InvalidParamError } from '../../errors'
import { EmailValidator, Authentication } from './login-protocols'

interface SutTypes {
  sut: LoginController
  emailValidateStub: EmailValidator
  authenticationStub: Authentication
}

const makeEmailValidateStub = (): EmailValidator => {
  class EmailValidateStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidateStub()
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return new Promise(resolve => resolve('valid_token'))
    }
  }
  return new AuthenticationStub()
}

const makeSut = (): SutTypes => {
  const emailValidateStub = makeEmailValidateStub()
  const authenticationStub = makeAuthenticationStub()
  const sut = new LoginController(emailValidateStub, authenticationStub)
  return {
    sut,
    emailValidateStub,
    authenticationStub
  }
}
interface HttpRequestLogin {
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
  test('should return 400 if no email is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamsError('email')))
  })

  test('should return 400 if no password is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = {
      body: {
        email: 'any_mail@mail.com'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamsError('password')))
  })

  test('should return 400 if EmailValidator return false', async () => {
    const { sut, emailValidateStub } = makeSut()
    jest.spyOn(emailValidateStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await sut.handle(makeFakeHttpRequest())
    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')))
  })

  test('should call EmailValidator to a valid email', async () => {
    const { sut, emailValidateStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidateStub, 'isValid')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenLastCalledWith(httpRequest.body.email)
  })

  test('should return 500 if EmailValidator throws', async () => {
    const { sut, emailValidateStub } = makeSut()
    jest.spyOn(emailValidateStub, 'isValid')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const httpRequest = makeFakeHttpRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(serverError(new Error()))
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth')
      .mockImplementationOnce(async () => {
        throw new Error()
      })
    const httpRequest = makeFakeHttpRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(serverError(new Error()))
  })

  test('should call Authentication if values id valid', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(httpRequest.body.email, httpRequest.body.password)
  })

  test('should return 401 if invalid credential is provided', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpRequest = makeFakeHttpRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(unauthorizedError())
  })

  test('should return 200 if valid credentials is provided', async () => {
    const { sut } = makeSut()
    const httpRequest = makeFakeHttpRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(ok({
      accessToken: 'valid_token'
    }))
  })
})
