import { PointModel } from '@domain/models/point'
import { AddPoint, AddPointModel } from '@domain/usecases/point/add-point'
import { HttpRequest } from '@presentation/protocols'
import { AddPointController } from './add-point-controller'

type SutTypes = {
  sut: AddPointController
  addPointStub: AddPoint
}

const fakeCreatePoint = (): PointModel => ({
  id: 'valid_id',
  name: 'valid_name',
  city: 'valid_city',
  image: 'valid_image_url',
  latitude: 'valid_latitude',
  longitude: 'valid_longitude',
  state: 'valid_state',
  phone: 'valid_phone',
  user: {
    name: 'valid_user_name',
    email: 'valid_email_user_create'
  },
  items: [{
    image: 'http://valid_item_image_1_url.com.br',
    title: 'valid_item_image_1'
  },
  {
    image: 'http://valid_item_image_2_url.com.br',
    title: 'valid_item_image_2'
  }]
})

const fakeRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    city: 'any_city',
    image: 'any_image_url',
    latitude: 'any_latitude',
    longitude: 'any_longitude',
    state: 'any_state',
    phone: 'any_phone',
    items: [
      {
        item: 'any_id_item_1'
      },
      {
        item: 'any_id_item_2'
      }
    ]
  }
})

const fakeCallPointValid = (): AddPointModel => ({
  name: 'any_name',
  city: 'any_city',
  image: 'any_image_url',
  latitude: 'any_latitude',
  longitude: 'any_longitude',
  state: 'any_state',
  phone: 'any_phone',
  items: [
    {
      image: 'http://any_image_1_url.com.br',
      title: 'any_title_1'
    },
    {
      image: 'http://any_image_2_url.com.br',
      title: 'any_title_2'
    }
  ],
  user: {
    name: 'any_user_create_new_point',
    email: 'any_email_create_new_point'
  }
})

const makeAddPointStub = (): AddPoint => {
  class AddPointStub implements AddPoint {
    async add (point: AddPointModel): Promise<PointModel> {
      return new Promise(resolve => resolve(fakeCreatePoint()))
    }
  }

  return new AddPointStub()
}

const makeSut = (): SutTypes => {
  const addPointStub = makeAddPointStub()
  const sut = new AddPointController(addPointStub)
  return {
    sut,
    addPointStub
  }
}

describe('AddPointController', () => {
  describe('Add Point', () => {
    test('should call AddPoint with correct values', async () => {
      const { sut, addPointStub } = makeSut()
      const addSpy = jest.spyOn(addPointStub, 'add')
      await sut.handle(fakeRequest())
      expect(addSpy).toHaveBeenCalledWith(fakeCallPointValid())
    })
  })
})
