import { AddPointModelData, PointModelData } from '@data/models/point-model'
import { AddPointRepository } from '@data/protocols/data/point/add-point-repository'
import { DbAddPoint } from './db-add-point'

const fakeAddPoint: AddPointModelData = {
  account: {
    id: 'any_id_account',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    accessToken: 'any_accessToken',
    role: 'any_role'
  },
  placeName: 'any_placeName',
  referencePoint: 'any_referencePoint',
  locationType: 'any_locationType',
  image: 'any_image',
  items: [
    {
      id: 'any_id_item_1',
      description: 'any_description',
      title: 'any_image_title_1',
      activeColor: 'any_activeColor',
      color: 'any_color'
    },
    {
      id: 'any_id_item_2',
      description: 'any description',
      title: 'any_image_title_2',
      activeColor: 'any_activeColor',
      color: 'any_color'
    }
  ],
  latitude: '7895',
  longitude: '7865'
}

const fakeAddPointResult: PointModelData = {
  id: 'any_id',
  account: {
    id: 'any_id_account',
    name: 'any_name',
    email: 'any_email',
    password: 'any_password',
    accessToken: 'any_accessToken',
    role: 'any_role'
  },
  placeName: 'any_placeName',
  referencePoint: 'any_referencePoint',
  locationType: 'any_locationType',
  image: 'any_image',
  items: [
    {
      id: 'any_id_item_1',
      description: 'any_description',
      title: 'any_image_title_1',
      activeColor: 'any_activeColor',
      color: 'any_color'
    },
    {
      id: 'any_id_item_2',
      description: 'any description',
      title: 'any_image_title_2',
      activeColor: 'any_activeColor',
      color: 'any_color'
    }
  ],
  latitude: '7895',
  longitude: '7865'
}

type SutTypes = {
  sut: DbAddPoint
  addPointRepositoryStub: AddPointRepository
}

const makeAddPointRepositoryStub = (): AddPointRepository => {
  class AddPointRepositoryStub implements AddPointRepository {
    async addNewPoint(point: AddPointModelData): Promise<PointModelData> {
      return new Promise(resolve => resolve(fakeAddPointResult))
    }
  }
  return new AddPointRepositoryStub()
}

const makeSut = (): SutTypes => {
  const addPointRepositoryStub = makeAddPointRepositoryStub()
  const sut = new DbAddPoint(addPointRepositoryStub)
  return {
    sut,
    addPointRepositoryStub
  }
}

describe('DbAddPoint', () => {
  test('should call AddPointRepository with correct values', async () => {
    const { sut, addPointRepositoryStub } = makeSut()
    const addNewPointSpy = jest.spyOn(addPointRepositoryStub, 'addNewPoint')
    await sut.add(fakeAddPoint)
    expect(addNewPointSpy).toHaveBeenCalledWith(fakeAddPoint)
  })

  test('should return Point if AddPointRepository on success', async () => {
    const { sut } = makeSut()
    const point = await sut.add(fakeAddPoint)
    expect(point).toEqual(fakeAddPointResult)
  })

  test('should return null if AddPointRepository on fails', async () => {
    const { sut, addPointRepositoryStub } = makeSut()
    jest
      .spyOn(addPointRepositoryStub, 'addNewPoint')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const point = await sut.add(fakeAddPoint)
    expect(point).toBeNull()
  })

  test('should throws if AddPointRepository throws', async () => {
    const { sut, addPointRepositoryStub } = makeSut()
    jest
      .spyOn(addPointRepositoryStub, 'addNewPoint')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const response = sut.add(fakeAddPoint)
    await expect(response).rejects.toThrow()
  })
})
