import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validator,
  AddPoint,
  LoadItemByIds,
  badRequest,
  forbidden,
  serverError,
  ItemNotExistError,
  AccessDeniedError,
  LoadAccountByToken,
  AddPointModel
} from './add-point-controller-protocols'
import { noContent } from '@presentation/helper/http/http-helper'
import { UploadFileError } from '@presentation/errors'

export class AddPointController implements Controller {
  constructor(
    private readonly addPoint: AddPoint,
    private readonly loadItemByIds: LoadItemByIds,
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly validator: Validator
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const {
        items,
        name,
        city,
        file,
        latitude,
        longitude,
        state,
        phone,
        accountId
      } = httpRequest.body

      if (!httpRequest.body.file) {
        return badRequest(new UploadFileError(httpRequest.body.error))
      }

      if (!items) return badRequest(new ItemNotExistError())

      const itemExist = await this.loadItemByIds.load(
        items.map(({ item }) => item)
      )
      if (!itemExist) return badRequest(new ItemNotExistError())

      if (!accountId) return forbidden(new AccessDeniedError())

      const account = await this.loadAccountByToken.load(accountId)
      if (!account) return forbidden(new AccessDeniedError())

      const isError = this.validator.isValid(httpRequest.body)
      if (isError) {
        return badRequest(isError)
      }

      const pointCreate: AddPointModel = {
        account,
        items: itemExist,
        city,
        image: file,
        latitude,
        longitude,
        name,
        phone,
        state
      }

      await this.addPoint.add(pointCreate)

      return noContent()
    } catch (error) {
      return serverError(error)
    }
  }
}
