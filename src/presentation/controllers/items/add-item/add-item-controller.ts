import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddItem,
  Validator
} from './add-item-controller-protocols'
import {
  serverError,
  badRequest,
  noContent
} from '@presentation/helper/http/http-helper'
import { TitleAlreadyExistError } from '@presentation/errors'
import { LoadItemByTitle } from '@domain/usecases/item/load-item-by-title'

export class AddItemController implements Controller {
  constructor(
    private readonly addItem: AddItem,
    private readonly validator: Validator,
    private readonly loadItemByTitle: LoadItemByTitle
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isError = this.validator.isValid(httpRequest.body)
      if (isError) {
        return badRequest(isError)
      }

      const { title, description, color, activeColor } = httpRequest.body
      const titleExist = await this.loadItemByTitle.load(title)
      if (titleExist) {
        return badRequest(new TitleAlreadyExistError())
      }
      await this.addItem.add({ description, title, color, activeColor })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
