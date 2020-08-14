import { SignUpController } from './signup-controller'
import { MissingParamsError, ServerError } from '../../errors'
import {
  AddAccountModel,
  AccountModel,
  AddAccount,
  Validator,
  Authentication,
  AuthenticationModel
} from './signup-controller-protocols'
import { HttpRequest } from '../../protocols'
import { ok, badRequest, serverError } from '../../helper/http/http-helper'

const makeFakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@gmail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const makeFakeAccount = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

const makeAddAccount = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return await new Promise(resolve => resolve(makeFakeAccount()))
    }
  }
  return new AddAccountStub()
}

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    isValid (input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeAuthenticationStub = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return new Promise(resolve => resolve('valid_token'))
    }
  }
  return new AuthenticationStub()
}

interface ISutTypes {
  sut: SignUpController
  authenticationStub: Authentication
  addAccountStub: AddAccount
  validatorStub: Validator
}

const makeSut = (): ISutTypes => {
  const validatorStub = makeValidatorStub()
  const addAccountStub = makeAddAccount()
  const authenticationStub = makeAuthenticationStub()
  const sut = new SignUpController(addAccountStub, validatorStub, authenticationStub)
  return {
    sut,
    authenticationStub,
    addAccountStub,
    validatorStub
  }
}

describe('Signup Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(makeFakeRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@gmail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 is AddAccount throws', async () => {
    const { sut, addAccountStub } = makeSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return await new Promise((resolve, reject) => reject(new Error()))
    })
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse.statusCode).toBe(500)
    expect(httpResponse).toEqual(serverError(new ServerError(null)))
  })

  test('Should return 200 and accessToken in body if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok({
      accessToken: 'valid_token'
    }))
  })

  test('Should call Validator with correct value', async () => {
    const { sut, validatorStub } = makeSut()
    const addSpy = jest.spyOn(validatorStub, 'isValid')
    const httpRequest = makeFakeRequest()
    await sut.handle(httpRequest)
    expect(addSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if valid return Error', async () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'isValid').mockReturnValueOnce(new MissingParamsError('any_field'))
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamsError('any_field')))
  })

  test('should call function auth in Authentication if values is valid', async () => {
    const { sut, authenticationStub } = makeSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    const httpRequest = makeFakeRequest()
    const { email, password } = httpRequest.body
    const authenticationModelFake: AuthenticationModel = {
      email,
      password
    }
    await sut.handle(httpRequest)
    expect(authSpy).toHaveBeenCalledWith(authenticationModelFake)
  })

  test('should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = makeSut()
    jest.spyOn(authenticationStub, 'auth')
      .mockImplementationOnce(async () => {
        throw new Error()
      })
    const httpRequest = makeFakeRequest()
    const response = await sut.handle(httpRequest)
    expect(response).toEqual(serverError(new Error()))
  })
})
