import { LoggerControllerDecorator } from './logger-decorator'
import { HttpRequest, Controller, HttpResponse } from '../../presentation/protocols'
import { serverError, ok } from '../../presentation/helper/http/http-helper'
import { LoggerErrorRepository } from '../../data/protocols/data/logger/logger-error-repository'
import { AccountModel } from '../../domain/models/account'

type SutTypes = {
  sut: LoggerControllerDecorator
  controllerStub: Controller
  loggerErrorRepository: LoggerErrorRepository
}

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

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      return new Promise(resolve => resolve(ok(makeFakeAccount())))
    }
  }
  return new ControllerStub()
}

const makeLoggerErrorRepository = (): LoggerErrorRepository => {
  class LoggerErrorRepositoryStub implements LoggerErrorRepository {
    async logError (stack: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new LoggerErrorRepositoryStub()
}

const makeSut = (): SutTypes => {
  const controllerStub = makeControllerStub()
  const loggerErrorRepository = makeLoggerErrorRepository()
  const sut = new LoggerControllerDecorator(controllerStub, loggerErrorRepository)
  return { sut, controllerStub, loggerErrorRepository }
}

describe('Logger Controller Decorator', () => {
  test('should LoggerControllerDecorator call handler', async () => {
    const { sut, controllerStub } = makeSut()
    const handleSpy = jest.spyOn(controllerStub, 'handle')
    await sut.handle(makeFakeRequest())
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest())
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(makeFakeRequest())
    expect(httpResponse).toEqual(ok(makeFakeAccount()))
  })

  test('should call LoggerErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, loggerErrorRepository } = makeSut()
    const logSpy = jest.spyOn(loggerErrorRepository, 'logError')
    const fakeError = new Error()
    fakeError.stack = 'any_error'
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      new Promise(resolve => resolve(serverError(fakeError)))
    )
    await sut.handle(makeFakeRequest())
    expect(logSpy).toHaveBeenCalledWith('any_error')
  })
})
