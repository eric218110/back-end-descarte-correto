import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddItem,
  Validator
} from './add-item-controller-protocols'
import { serverError, onCreated, badRequest, alreadyExist } from '@presentation/helper/http/http-helper'
import { AlreadyExistError } from '@presentation/errors/already-exists-error'

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
      if (item) {
        return onCreated(item)
      }
      return alreadyExist(new AlreadyExistError(title))
    } catch (error) {
      return serverError(error)
    }
  }
}
