import { HttpRequest, HttpResponse } from '@presentation/protocols/http'
import { Controller } from '@presentation/protocols/controller'
import { LoadPointById } from '@domain/usecases/point/load-point-by-id'
import {
  Validator,
  badRequest,
  serverError
} from '../add-point/add-point-controller-protocols'

export class LoadPointByIdController implements Controller {
  constructor(
    private readonly loadPointById: LoadPointById,
    private readonly validator: Validator
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isError = this.validator.isValid(httpRequest.params)
      if (isError) {
        return badRequest(isError)
      }
      await this.loadPointById.load(httpRequest.params.id)
      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
