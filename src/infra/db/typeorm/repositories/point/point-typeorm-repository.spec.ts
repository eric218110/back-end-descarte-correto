import { connectionDatabase } from '../../utils/create-connections'
import { AddPointModelData } from '@data/models/point-model'
import { PointTypeOrmRepository } from './point-typeorm-repository'
import { Repository } from 'typeorm'
import { EntityItem } from '../../entities/item.entity'

let itemTypeOrmRepository: Repository<EntityItem>

interface SutTypes {
  sut: PointTypeOrmRepository
}

const makeAddPointFake = (): AddPointModelData => ({
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
  items: [],
  latitude: '7895',
  longitude: '7865'
})

const makeSut = (): SutTypes => {
  const sut = new PointTypeOrmRepository()
  return {
    sut
  }
}

const makeFakeItems = async (): Promise<EntityItem[]> => {
  const createFirstItem = itemTypeOrmRepository.create({
    image: 'http://any_image_first_item.com',
    title: 'Any First Item Image'
  })
  const saveFirstItem = await itemTypeOrmRepository.save(createFirstItem)
  const createSecondItem = itemTypeOrmRepository.create({
    image: 'http://any_image_Second_item.com',
    title: 'Any Second Item Image'
  })
  const saveSecondItem = await itemTypeOrmRepository.save(createSecondItem)
  return [saveFirstItem, saveSecondItem]
}

beforeAll(async () => {
  const connection = await connectionDatabase.create()
  itemTypeOrmRepository = connection.getRepository(EntityItem)
})

afterAll(async () => {
  await connectionDatabase.clear()
  await connectionDatabase.close()
})

beforeEach(async () => {
  await connectionDatabase.clear()
})

describe('PointTypeOrmRepository', () => {
  describe('Add', () => {
    test('should return null if account not exist in database', async () => {
      const { sut } = makeSut()
      const fakePoint = makeAddPointFake()
      fakePoint.items = await makeFakeItems()
      const point = await sut.addNewPoint(fakePoint)
      expect(point).toBeNull()
    })
  })
})
