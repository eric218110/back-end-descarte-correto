import { LoggerControllerDecorator } from './logger'
import { HttpRequest, Controller, HttpResponse } from '../../presentation/protocols'
import { serverError } from '../../presentation/helper/http-helper'
import { LoggerErrorRepository } from '../../data/protocols/logger-error-repository'

interface SutTypes {
  sut: LoggerControllerDecorator
  controllerStub: Controller
  loggerErrorRepository: LoggerErrorRepository
}

const makeControllerStub = (): Controller => {
  class ControllerStub implements Controller {
    async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
      const httpResponse: HttpResponse = {
        body: {
          name: 'Eric Silva',
          email: 'ericsilvaccp@gmail.com'
        },
        statusCode: 200
      }
      return new Promise(resolve => resolve(httpResponse))
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
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(handleSpy).toHaveBeenCalledWith(httpRequest)
  })

  test('should return the same result of the controller', async () => {
    const { sut } = makeSut()
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual({
      body: {
        name: 'Eric Silva',
        email: 'ericsilvaccp@gmail.com'
      },
      statusCode: 200
    })
  })

  test('should call LoggerErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, loggerErrorRepository } = makeSut()
    const logSpy = jest.spyOn(loggerErrorRepository, 'logError')
    const fakeError = new Error()
    fakeError.stack = 'any_error'
    jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
      new Promise(resolve => resolve(serverError(fakeError)))
    )
    const httpRequest: HttpRequest = {
      body: {
        email: 'any_mail@mail.com',
        name: 'any_name',
        password: 'any_password',
        passwordConfirmation: 'any_password'
      }
    }
    await sut.handle(httpRequest)
    expect(logSpy).toHaveBeenCalledWith('any_error')
  })
})
