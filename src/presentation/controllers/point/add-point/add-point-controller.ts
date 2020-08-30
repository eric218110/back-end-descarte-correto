import { Controller, HttpRequest, HttpResponse } from '@presentation/protocols'
import { AddPoint } from '@domain/usecases/point/add-point'

export class AddPointController implements Controller {
  constructor (
    private readonly addPoint: AddPoint
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    await this.addPoint.add({
      city: 'any_city',
      image: 'any_image_url',
      items: [{
        image: 'http://any_image_1_url.com.br',
        title: 'any_title_1'
      },
      {
        image: 'http://any_image_2_url.com.br',
        title: 'any_title_2'
      }],
      latitude: 'any_latitude',
      longitude: 'any_longitude',
      name: 'any_name',
      phone: 'any_phone',
      state: 'any_state',
      user: {
        email: 'any_email_create_new_point',
        name: 'any_user_create_new_point'
      }
    }
    )
    return null
  }
}
