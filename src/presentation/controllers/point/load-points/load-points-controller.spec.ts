import { ok } from '../add-point/add-point-controller-protocols'
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
    placeName: 'any_placeName',
    state: 'any_state',
    neighborhood: 'valide_neighborhood',
    referencePoint: 'valide_referencePoint',
    locationType: 'valide_locationType',
    street: 'valide_street',
    zipCode: 'valide_zipCode',
    image: 'any_image',
    latitude: 'any_latitude',
    longitude: 'any_longitude',
    city: 'any_city',
    account: {
      id: 'any_id',
      email: 'any_email',
      name: 'any_name'
    },
    items: [
      {
        id: 'any_id_1',
        title: 'any_title_1',
        description: 'any_description_1',
        color: 'any_color_1',
        activeColor: 'any_activeColor_1'
      },
      {
        id: 'any_id_2',
        title: 'any_title_2',
        description: 'any_description_2',
        color: 'any_color_2',
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
      expect(httpResponse).toEqual(noContent([]))
    })

    test('should return 200 if LoadPoints success', async () => {
      const { sut } = makeSut()
      const response = await sut.handle({})
      expect(response).toEqual(ok(makeLoadPointsFake()))
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
