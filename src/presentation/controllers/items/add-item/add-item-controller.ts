import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddItem,
  Validator
} from './add-item-controller-protocols'
import { serverError, badRequest, noContent } from '@presentation/helper/http/http-helper'
import { UploadFileError } from '@presentation/errors'
import { LoadItemByTitle } from '@domain/usecases/item/load-item-by-title'

export class AddItemController implements Controller {
  constructor (
    private readonly addItem: AddItem,
    private readonly validator: Validator,
    private readonly loadItemByTitle: LoadItemByTitle
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const isError = this.validator.isValid(httpRequest.body)
      if (isError) {
        return badRequest(isError)
      }

      if (!httpRequest.body.file) {
        return badRequest(new UploadFileError())
      }

      const { title, file } = httpRequest.body
      await this.loadItemByTitle.load(title)
      await this.addItem.add({ image: file, title })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
