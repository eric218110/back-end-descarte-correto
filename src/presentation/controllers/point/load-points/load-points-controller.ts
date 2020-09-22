import { noContent } from '../add-point/add-point-controller-protocols'
import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadPoints,
  serverError,
  ok
} from './load-points-controller-protocols'

export class LoadPointsController implements Controller {
  constructor(private readonly loadPoints: LoadPoints) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const points = await this.loadPoints.load()
      if (points.length === 0) return noContent([])
      return ok(points)
    } catch (error) {
      return serverError(error)
    }
  }
}
