import { FilterPoint } from '@domain/usecases/point/filter-point'
import { Controller } from '@presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '@presentation/protocols/http'
import {
  badRequest,
  noContent,
  ok
} from '@presentation/helper/http/http-helper'
import {
  InvalidParamError,
  serverError
} from '../add-point/add-point-controller-protocols'

export class FilterPointController implements Controller {
  constructor(private readonly filterPoint: FilterPoint) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.params) {
        return badRequest(new InvalidParamError('items'))
      }
      const itemsParams: string = httpRequest.params.items
      const itemsId = itemsParams.replace(' ', '').trim().split(',')
      const filterPoints = await this.filterPoint.filter(itemsId)
      if (filterPoints.length > 0) return ok(filterPoints)
      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
