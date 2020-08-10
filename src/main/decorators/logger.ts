import { Controller, HttpResponse, HttpRequest } from '../../presentation/protocols'

export class LoggerControllerDecorator implements Controller {
  constructor (private readonly controller: Controller) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    // const httpResponse = await this.controller.handle(httpRequest)
    // if (httpResponse.statusCode === 500) {

    // }
    // return httpResponse
    await this.controller.handle(httpRequest)
    return new Promise(resolve => resolve(null))
  }
}
