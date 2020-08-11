import { LoginController } from './login-controller'
import { badRequest } from '../../helper/http-helper'
import { MissingParamsError } from '../../errors'
import { EmailValidator } from '../signup/signup-protocols'

interface SutTypes {
  sut: LoginController
  emailValidateStub: EmailValidator
}

const makeEmailValidateStub = (): EmailValidator => {
  class EmailValidateStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidateStub()
}

const makeSut = (): SutTypes => {
  const emailValidateStub = makeEmailValidateStub()
  const sut = new LoginController(emailValidateStub)
  return {
    sut,
    emailValidateStub
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

  test('should call EmailValidator to a valid email', async () => {
    const { sut, emailValidateStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidateStub, 'isValid')
    const httpRequest = makeFakeHttpRequest()
    await sut.handle(httpRequest)
    expect(isValidSpy).toHaveBeenLastCalledWith(httpRequest.body.email)
  })
})
