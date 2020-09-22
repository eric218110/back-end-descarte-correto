import { LoadPointsController } from './load-points-controller'
import {
  LoadPoints,
  LoadPointsModel,
  noContent,
  serverError
} from './load-points-controller-protocols'

type SutTypes = {
  sut: LoadPointsController
  loadPointStub: LoadPoints
}

const makeLoadPointsFake = (): LoadPointsModel[] => [
  {
    id: 'any_id',
    name: 'any_name',
    state: 'any_state',
    image: 'any_image',
    phone: 'any_phone',
    latitude: 'any_latitude',
    longitude: 'any_longitude',
    city: 'any_city',
    account: {
      id: 'any_id',
      email: 'any_email',
      name: 'any_name',
      accessToken: 'any_accessToken'
    },
    items: [
      {
        id: 'any_id_1',
        image: 'any_image_1',
        color: 'any_color_1',
        title: 'any_title_1',
        activeColor: 'any_activeColor_1'
      },
      {
        id: 'any_id_2',
        image: 'any_image_2',
        color: 'any_color_2',
        title: 'any_title_2',
        activeColor: 'any_activeColor_2'
      }
    ]
  }
]

const makeLoadPointsStub = (): LoadPoints => {
  class LoadPointsStub implements LoadPoints {
    async load(): Promise<LoadPointsModel[]> {
      return new Promise(resolve => resolve(makeLoadPointsFake()))
    }
  }
  return new LoadPointsStub()
}

const makeSut = (): SutTypes => {
  const loadPointStub = makeLoadPointsStub()
  const sut = new LoadPointsController(loadPointStub)
  return {
    sut,
    loadPointStub
  }
}

describe('LoadPointsController', () => {
  describe('LoadPoints', () => {
    test('should call LoadPoints', async () => {
      const { sut, loadPointStub } = makeSut()
      const loadPointStubSpy = jest.spyOn(loadPointStub, 'load')
      await sut.handle({})
      expect(loadPointStubSpy).toHaveBeenCalled()
    })

    test('Should return 204 if LoadPoints return []', async () => {
      const { sut, loadPointStub } = makeSut()
      jest
        .spyOn(loadPointStub, 'load')
        .mockReturnValueOnce(new Promise(resolve => resolve([])))
      const httpResponse = await sut.handle({})
      expect(httpResponse).toEqual(noContent())
    })

    test('should return 500 if LoadPoints throws', async () => {
      const { sut, loadPointStub } = makeSut()
      jest.spyOn(loadPointStub, 'load').mockImplementationOnce(() => {
        throw new Error()
      })
      const response = await sut.handle({})
      expect(response).toEqual(serverError(new Error()))
    })
  })
})
