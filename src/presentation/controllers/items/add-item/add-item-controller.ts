import {
  Controller,
  HttpRequest,
  HttpResponse,
  AddItem
} from './add-items-controller-protocols'

export class AddItemController implements Controller {
  constructor (
    private readonly addItem: AddItem
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    const { image, title } = httpRequest.body
    await this.addItem.add({ image, title })
    return new Promise(resolve => resolve(null))
  }
}
