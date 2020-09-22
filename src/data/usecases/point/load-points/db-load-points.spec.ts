import { LoadPointsModelData } from '@data/models/point-model'
import { LoadPointsRepository } from '@data/protocols/data/point/load-points-repositoty'
import { DbLoadPoints } from './db-load-points'

type SutTypes = {
  sut: DbLoadPoints
  loadPointsRepositoryStub: LoadPointsRepository
}

const makeLoadPointsFake = (): LoadPointsModelData[] => [
  {
    id: 'avalid_id',
    name: 'avalid_name',
    state: 'avalid_state',
    image: 'avalid_image',
    phone: 'avalid_phone',
    latitude: 'avalid_latitude',
    longitude: 'avalid_longitude',
    city: 'avalid_city',
    account: {
      id: 'avalid_id',
      email: 'avalid_email',
      name: 'avalid_name',
      accessToken: 'avalid_accessToken'
    },
    items: [
      {
        id: 'avalid_id_1',
        image: 'avalid_image_1',
        color: 'avalid_color_1',
        title: 'avalid_title_1',
        activeColor: 'avalid_activeColor_1'
      },
      {
        id: 'avalid_id_2',
        image: 'avalid_image_2',
        color: 'avalid_color_2',
        title: 'avalid_title_2',
        activeColor: 'avalid_activeColor_2'
      }
    ]
  }
]

const makeLoadPointsRepositoryStub = (): LoadPointsRepository => {
  class LoadPointsRepositoryStub implements LoadPointsRepository {
    async loadAll(): Promise<LoadPointsModelData[]> {
      return new Promise(resolve => resolve(makeLoadPointsFake()))
    }
  }
  return new LoadPointsRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadPointsRepositoryStub = makeLoadPointsRepositoryStub()
  const sut = new DbLoadPoints(loadPointsRepositoryStub)
  return {
    sut,
    loadPointsRepositoryStub
  }
}

describe('DbLoadPoints', () => {
  describe('LoadAll', () => {
    test('should call LoadPointsRepository', async () => {
      const { sut, loadPointsRepositoryStub } = makeSut()
      const loadPointsRepositorySpy = jest.spyOn(
        loadPointsRepositoryStub,
        'loadAll'
      )
      await sut.load()
      expect(loadPointsRepositorySpy).toHaveBeenCalled()
    })

    test('should throws if LoadPointsRepository throws', async () => {
      const { sut, loadPointsRepositoryStub } = makeSut()
      jest
        .spyOn(loadPointsRepositoryStub, 'loadAll')
        .mockReturnValueOnce(
          new Promise((resolve, reject) => reject(new Error()))
        )
      const response = sut.load()
      await expect(response).rejects.toThrow()
    })

    test('should return [] if LoadPointByIdRepository returns null', async () => {
      const { sut, loadPointsRepositoryStub } = makeSut()
      jest
        .spyOn(loadPointsRepositoryStub, 'loadAll')
        .mockReturnValueOnce(new Promise(resolve => resolve(null)))
      const point = await sut.load()
      expect(point).toEqual([])
    })

    test('should returns list of points if LoadPointRepository return list', async () => {
      const { sut } = makeSut()
      const points = await sut.load()
      expect(points).toEqual(makeLoadPointsFake())
    })
  })
})
