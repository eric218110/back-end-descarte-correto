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
import { UploadFileError, TitleAlreadyExistError } from '@presentation/errors'
import { LoadItemByTitle } from '@domain/usecases/item/load-item-by-title'
import { StorageRemoveFile } from '@domain/usecases/upload/storage/storage-remove-file'

export class AddItemController implements Controller {
  constructor(
    private readonly addItem: AddItem,
    private readonly validator: Validator,
    private readonly loadItemByTitle: LoadItemByTitle,
    private readonly storageRemoveFile: StorageRemoveFile
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      if (!httpRequest.body.file) {
        return badRequest(new UploadFileError(httpRequest.body.error))
      }
      const isError = this.validator.isValid(httpRequest.body)
      if (isError) {
        return badRequest(isError)
      }

      const { title, file } = httpRequest.body
      const titleExist = await this.loadItemByTitle.load(title)
      if (titleExist) {
        await this.storageRemoveFile.remove(httpRequest.body.pathFile)
        return badRequest(new TitleAlreadyExistError())
      }
      await this.addItem.add({ image: file, title })

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
