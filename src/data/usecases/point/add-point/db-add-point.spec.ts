import { AddPointModelData, PointModelData } from '@data/models/point-model'
import { AddPointRepository } from '@data/protocols/data/point/add-point-repository'
import { DbAddPoint } from './db-add-point'

const fakePoint: AddPointModelData = {
  user: {
    email: 'any_email',
    name: 'any_name'
  },
  name: 'any_name',
  phone: 'any_phone',
  city: 'any_city',
  state: 'any_state',
  image: 'any_image',
  items: [
    {
      image: 'any_image_url_1',
      title: 'any_image_title_1'
    },
    {
      image: 'any_image_url_2',
      title: 'any_image_title_2'
    }
  ],
  latitude: '7895',
  longitude: '7865'
}

const fakePointResult: PointModelData = {
  id: 'any_id',
  user: {
    email: 'any_email',
    name: 'any_name'
  },
  name: 'any_name',
  phone: 'any_phone',
  city: 'any_city',
  state: 'any_state',
  image: 'any_image',
  items: [
    {
      image: 'any_image_url_1',
      title: 'any_image_title_1'
    },
    {
      image: 'any_image_url_2',
      title: 'any_image_title_2'
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
      return new Promise(resolve => resolve(fakePointResult))
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
    await sut.add(fakePoint)
    expect(addNewPointSpy).toHaveBeenCalledWith(fakePoint)
  })
})
