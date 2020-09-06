import { PointModel } from '@domain/models/point'
import { LoadPointByIdRepository } from '@data/protocols/data/point/load-point-by-id-repository'
import { DbLoadPointById } from './db-load-point-by-id'

const fakeResultPoint: PointModel = {
  id: 'any_id',
  account: {
    id: 'any_id_account',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    accessToken: 'any_accessToken',
    role: 'any_role'
  },
  name: 'any_name',
  phone: 'any_phone',
  city: 'any_city',
  state: 'any_state',
  image: 'any_image',
  items: [
    {
      id: 'any_id_item_1',
      image: 'any_image_url_1',
      title: 'any_image_title_1'
    },
    {
      id: 'any_id_item_2',
      image: 'any_image_url_2',
      title: 'any_image_title_2'
    }
  ],
  latitude: '7895',
  longitude: '7865'
}

type SutTypes = {
  sut: DbLoadPointById
  loadPointByIdRepositoryStub: LoadPointByIdRepository
}

const makeLoadPointByIdRepositoryStub = (): LoadPointByIdRepository => {
  class LoadPointByIdRepositoryStub implements LoadPointByIdRepository {
    async loadById(id: string): Promise<PointModel> {
      return new Promise(resolve => resolve(fakeResultPoint))
    }
  }
  return new LoadPointByIdRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadPointByIdRepositoryStub = makeLoadPointByIdRepositoryStub()
  const sut = new DbLoadPointById(loadPointByIdRepositoryStub)
  return {
    sut,
    loadPointByIdRepositoryStub
  }
}

describe('DbLoadPointById', () => {
  test('should call LoadPointByIdRepository with correct value', async () => {
    const { sut, loadPointByIdRepositoryStub } = makeSut()
    const loadByIdSpy = jest.spyOn(loadPointByIdRepositoryStub, 'loadById')
    await sut.load('any_id')
    expect(loadByIdSpy).toHaveBeenCalledWith('any_id')
  })

  test('should return null if LoadPointByIdRepository returns null', async () => {
    const { sut, loadPointByIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadPointByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const point = await sut.load('any_id')
    expect(point).toBeNull()
  })

  test('should return point if LoadPointByIdRepository on success', async () => {
    const { sut } = makeSut()
    const point = await sut.load('any_id')
    expect(point).toEqual(fakeResultPoint)
  })

  test('should throws if LoadPointByIdRepository throws', async () => {
    const { sut, loadPointByIdRepositoryStub } = makeSut()
    jest
      .spyOn(loadPointByIdRepositoryStub, 'loadById')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const response = sut.load('any_id')
    await expect(response).rejects.toThrow()
  })
})
