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
        image,
        latitude,
        longitude,
        state,
        phone,
        accountId
      } = httpRequest.body

      const itemExist = await this.loadItemByIds.loadItems(
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
        image,
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
