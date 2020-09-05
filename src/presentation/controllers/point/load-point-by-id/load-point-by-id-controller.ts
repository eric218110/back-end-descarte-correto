import { HttpRequest, HttpResponse } from '@presentation/protocols/http'
import { Controller } from '@presentation/protocols/controller'
import { LoadPointById } from '@domain/usecases/point/load-point-by-id'

export class LoadPointByIdController implements Controller {
  constructor(private readonly loadPointById: LoadPointById) {}
  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadPointById.load(httpRequest.params.id)
    return new Promise(resolve => resolve(null))
  }
}
