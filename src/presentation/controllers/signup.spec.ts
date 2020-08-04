import { SignUpController } from './SignUp'
import { MissingParamsError } from '../errors/MissingParamsError'

const mageSut = (): SignUpController => {
  return new SignUpController()
}

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = mageSut()
    const httpRequest = {
      body: {
        email: 'any_email@any.com',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('name'))
  })

  test('Should return 400 if no name is provided', () => {
    const sut = mageSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('email'))
  })

  test('Should return 400 if no password is provided', () => {
    const sut = mageSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@any.com',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('password'))
  })

  test('Should return 400 if no password is provided', () => {
    const sut = mageSut()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@any.com',
        password: 'any_password'
      }
    }
    const httpResponse = sut.handle(httpRequest)
    expect(httpResponse.statusCode).toBe(400)
    expect(httpResponse.body).toEqual(new MissingParamsError('passwordConfirmation'))
  })
})
