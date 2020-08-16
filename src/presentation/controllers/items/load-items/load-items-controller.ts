import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadItems
} from './load-items-controller-protocols'
import { ok, noContent } from '@presentation/helper/http/http-helper'

export class LoadItemsController implements Controller {
  constructor (
    private readonly loadItems: LoadItems
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const items = await this.loadItems.load()
    if (items) {
      return ok(items)
    }
    return noContent()
  }
}
