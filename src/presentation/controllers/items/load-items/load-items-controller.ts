import {
  Controller,
  HttpRequest,
  HttpResponse,
  LoadItems
} from './load-items-controller-protocols'

export class LoadItemsController implements Controller {
  constructor (
    private readonly loadItems: LoadItems
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.loadItems.load()
    return null
  }
}
