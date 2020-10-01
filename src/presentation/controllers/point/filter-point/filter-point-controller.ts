import { FilterPoint } from '@domain/usecases/point/filter-point'
import { Controller } from '@presentation/protocols/controller'
import { HttpRequest, HttpResponse } from '@presentation/protocols/http'

export class FilterPointController implements Controller {
  constructor(private readonly filterPoint: FilterPoint) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    // if (httpRequest.params)
    const itemsParams: string = httpRequest.params.items
    const itemsId = itemsParams.replace(' ', '').trim().split(',')
    await this.filterPoint.filter(itemsId)
    return new Promise(resolve => resolve(null))
  }
}
