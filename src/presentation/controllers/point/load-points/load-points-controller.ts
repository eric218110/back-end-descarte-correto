import { noContent } from '../add-point/add-point-controller-protocols'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadPoints,
  serverError
} from './load-points-controller-protocols'

export class LoadPointsController implements Controller {
  constructor(private readonly loadPoints: LoadPoints) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const points = await this.loadPoints.load()
      if (points.length === 0) return noContent([])
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
