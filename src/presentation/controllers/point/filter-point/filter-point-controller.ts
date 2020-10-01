import { FilterPoint } from '@domain/usecases/point/filter-point'
import { Controller } from '@presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '@presentation/protocols/http'
import { serverError } from '../add-point/add-point-controller-protocols'

export class FilterPointController implements Controller {
  constructor(private readonly filterPoint: FilterPoint) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const itemsParams: string = httpRequest.params.items
      const itemsId = itemsParams.replace(' ', '').trim().split(',')
      await this.filterPoint.filter(itemsId)
      return new Promise(resolve => resolve(null))
    } catch (error) {
      return serverError(error)
    }
  }
}
