import { FilterPoint } from '@domain/usecases/point/filter-point'
import { Controller } from '@presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '@presentation/protocols/http'
import {
  badRequest,
  noContent,
  ok
} from '@presentation/helper/http/http-helper'
import {
  serverError,
  Validator
} from '../add-point/add-point-controller-protocols'

export class FilterPointController implements Controller {
  constructor(
    private readonly filterPoint: FilterPoint,
    private readonly validator: Validator
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isError = this.validator.isValid(httpRequest.params)
      if (isError) {
        return badRequest(isError)
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
