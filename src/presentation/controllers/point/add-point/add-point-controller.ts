import {
  Controller,
  HttpRequest,
  HttpResponse,
  Validator
} from '@presentation/protocols'
import { AddPoint } from '@domain/usecases/point/add-point'
import { LoadItemByIds } from '@data/protocols/data/items/load-items-by-ids'
import {
  badRequest,
  forbidden,
  serverError
} from '@presentation/helper/http/http-helper'
import { ItemNotExistError } from '@presentation/errors'
import { AccessDeniedError } from '@presentation/errors/access-denied-error'
import { LoadAccountByToken } from '@domain/usecases/account/load-accout-by-token'

export class AddPointController implements Controller {
  constructor(
    private readonly addPoint: AddPoint,
    private readonly loadItemByIds: LoadItemByIds,
    private readonly loadAccountByToken: LoadAccountByToken,
    private readonly validator: Validator
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const { items, accountId } = httpRequest.body
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

      return null
    } catch (error) {
      return serverError(error)
    }
  }
}
