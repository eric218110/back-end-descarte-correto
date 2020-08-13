import { Controller, HttpResponse, HttpRequest } from '../../presentation/protocols'
import { LoggerErrorRepository } from '../../data/protocols/data/logger/logger-error-repository'

export class LoggerControllerDecorator implements Controller {
  constructor (
    private readonly controller: Controller,
    private readonly loggerErrorRepository: LoggerErrorRepository
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const httpResponse = await this.controller.handle(httpRequest)
    if (httpResponse.statusCode === 500) {
      await this.loggerErrorRepository.logError(httpResponse.body.stack)
    }
    return httpResponse
  }
}
