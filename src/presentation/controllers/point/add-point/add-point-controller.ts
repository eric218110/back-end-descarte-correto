import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { AddPoint } from '@domain/usecases/point/add-point'
import { LoadItemByIds } from '@data/protocols/data/items/load-items-by-ids'
import { badRequest } from '@presentation/helper/http/http-helper'
import { ItemNotExistError } from '@presentation/errors'

export class AddPointController implements Controller {
  constructor(
    private readonly addPoint: AddPoint,
    private readonly loadItemByIds: LoadItemByIds
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    const { items } = httpRequest.body
    const itemExist = await this.loadItemByIds.loadItems(
      items.map(({ item }) => item)
    )
    if (!itemExist) return badRequest(new ItemNotExistError())
    await this.addPoint.add({
      name: 'any_name',
      city: 'any_city',
      image: 'any_image_url',
      latitude: 'any_latitude',
      longitude: 'any_longitude',
      state: 'any_state',
      phone: 'any_phone',
      account: {
        id: 'valid_id_user',
        name: 'valid_name',
        email: 'valid_email_user',
        password: 'valid_password',
        accessToken: 'valid_access_token',
        role: 'valid_role'
      },
      items: [
        {
          id: 'valid_id_item_1',
          image: 'http://valid_item_image_1_url.com.br',
          title: 'valid_item_image_1'
        },
        {
          id: 'valid_id_item_2',
          image: 'http://valid_item_image_2_url.com.br',
          title: 'valid_item_image_2'
        }
      ]
    })
    return null
  }
}
