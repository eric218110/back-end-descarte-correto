import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddItem,
  Validator
} from './add-item-controller-protocols'
import { serverError, onCreated, badRequest } from '@presentation/helper/http/http-helper'

export class AddItemController implements Controller {
  constructor (
    private readonly addItem: AddItem,
    private readonly validator: Validator
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isError = this.validator.isValid(httpRequest.body)
      if (isError) {
        return badRequest(isError)
      }
      const { image, title } = httpRequest.body
      const item = await this.addItem.add({ image, title })
      return onCreated(item)
    } catch (error) {
      return serverError(error)
    }
  }
}
