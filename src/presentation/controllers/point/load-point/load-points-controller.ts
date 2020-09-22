import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadPoints
} from './load-points-controller-protocols'

export class LoadPointsController implements Controller {
  constructor(private readonly loadPoints: LoadPoints) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadPoints.load()
    return new Promise(resolve => resolve(null))
  }
}
