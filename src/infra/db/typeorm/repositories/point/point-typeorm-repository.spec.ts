import { connectionDatabase } from '../../utils/create-connections'
import {
  AddPointModelData,
  LoadPointsModelData
} from '@data/models/point-model'
import { PointTypeOrmRepository } from './point-typeorm-repository'
import { Repository } from 'typeorm'
import { EntityItem } from '../../entities/item.entity'
import { EntityAccount } from '../../entities/account.entity'
import { EntityPoint } from '../../entities/point.entity'

let itemTypeOrmRepository: Repository<EntityItem>
let accountTypeOrmRepository: Repository<EntityAccount>
let pointTypeOrmRepository: Repository<EntityPoint>

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
  placeName: 'valid_name',
  referencePoint: 'valid referenve point',
  locationType: 'valid_location_type',
  city: 'any_city',
  state: 'any_state',
  image: 'any_image',
  neighborhood: 'any_neighborhood',
  street: 'any_street',
  zipCode: 'any_zipCode',
  items: [],
  latitude: '7895',
  longitude: '7865'
})

const makeFakePoint = async (): Promise<EntityPoint> => {
  const fakeAccount = await makeFakeAccount()
  const fakeItems = await makeFakeItems()
  const fakePoint = {
    account: fakeAccount,
    placeName: 'any_name',
    referencePoint: 'any referenve point',
    locationType: 'any_location_type',
    neighborhood: 'any_neighborhood',
    street: 'any_street',
    zipCode: 'any_zipCode',
    city: 'any_city',
    state: 'any_state',
    image: 'any_image',
    items: fakeItems,
    latitude: '7895',
    longitude: '7865'
  }
  const createFakePoint = pointTypeOrmRepository.create(fakePoint)
  return await pointTypeOrmRepository.save(createFakePoint)
}

const makeFakePoints = async (): Promise<LoadPointsModelData[]> => {
  const firstPoint = await makeFakePoint()
  delete firstPoint.account.password
  delete firstPoint.account.role
  delete firstPoint.account.accessToken
  const secondPoint = await makeFakePoint()
  delete secondPoint.account.password
  delete secondPoint.account.role
  delete secondPoint.account.accessToken

  return [firstPoint, secondPoint]
}

const makeSut = (): SutTypes => {
  const sut = new PointTypeOrmRepository()
  return {
    sut
  }
}

const makeFakeItems = async (): Promise<EntityItem[]> => {
  const createFirstItem = itemTypeOrmRepository.create({
    title: `Any First Item Image ${Date.now()}`,
    description: 'Description imte',
    activeColor: 'activeColor',
    color: 'color'
  })
  const saveFirstItem = await itemTypeOrmRepository.save(createFirstItem)
  const createSecondItem = itemTypeOrmRepository.create({
    title: `Any Second Item Image ${Date.now()}`,
    description: 'Description imte',
    activeColor: 'activeColor',
    color: 'color'
  })
  const saveSecondItem = await itemTypeOrmRepository.save(createSecondItem)
  return [saveFirstItem, saveSecondItem]
}

const makeFakeAccount = async (): Promise<EntityAccount> => {
  const createAccount = accountTypeOrmRepository.create({
    name: 'any_name_account',
    email: `any_email_account@${Date.now()}`,
    password: 'any_password_account',
    accessToken: 'any_accessToken_account',
    role: 'any_role_account'
  })
  const saveAccount = accountTypeOrmRepository.save(createAccount)
  return saveAccount
}

beforeAll(async () => {
  const connection = await connectionDatabase.create()
  await connectionDatabase.clear()
  itemTypeOrmRepository = connection.getRepository(EntityItem)
  accountTypeOrmRepository = connection.getRepository(EntityAccount)
  pointTypeOrmRepository = connection.getRepository(EntityPoint)
})

afterAll(async () => {
  await connectionDatabase.close()
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

    test('should return null if item is empty', async () => {
      const { sut } = makeSut()
      const fakePoint = makeAddPointFake()
      fakePoint.account = await makeFakeAccount()
      const point = await sut.addNewPoint(fakePoint)
      expect(point).toBeNull()
    })

    test('should return null if item no empty but items not exists in database', async () => {
      const { sut } = makeSut()
      const fakePoint = makeAddPointFake()
      fakePoint.account = await makeFakeAccount()
      fakePoint.items = [
        {
          id: 'first_invalid_id_item',
          title: 'First Invalid Image',
          description: 'Description Item',
          activeColor: 'activeColor',
          color: 'color'
        },
        {
          id: 'seconf_invalid_id_item',
          title: 'Seconf Invalid Image',
          description: 'Description Item',
          activeColor: 'activeColor',
          color: 'color'
        }
      ]
      const point = await sut.addNewPoint(fakePoint)
      expect(point).toBeNull()
    })

    test('should return point if add success', async () => {
      await connectionDatabase.clear()
      const { sut } = makeSut()
      const fakePoint = makeAddPointFake()
      fakePoint.account = await makeFakeAccount()
      fakePoint.items = await makeFakeItems()
      const point = await sut.addNewPoint(fakePoint)
      expect(point).toBeTruthy()
      expect(point.id).toBeTruthy()
    })
  })

  describe('LoadById', () => {
    test('should return null if point not exist', async () => {
      const { sut } = makeSut()
      const point = await sut.loadById('any_id')
      expect(point).toBeNull()
    })

    test('should return point if on success', async () => {
      const createFirstItem = itemTypeOrmRepository.create({
        title: 'Any First Item Image',
        description: 'Description Item',
        activeColor: 'activeColor',
        color: 'color'
      })
      const createSecondItem = itemTypeOrmRepository.create({
        title: 'Any Second Item Image',
        description: 'Description Item',
        activeColor: 'activeColor',
        color: 'color'
      })
      const saveFirstItem = await itemTypeOrmRepository.save(createFirstItem)
      const saveSecondItem = await itemTypeOrmRepository.save(createSecondItem)

      const createAccount = accountTypeOrmRepository.create({
        name: 'any_name_account',
        email: 'any_email_account',
        password: 'any_password_account',
        accessToken: 'any_accessToken_account',
        role: 'any_role_account'
      })

      const saveAccount = await accountTypeOrmRepository.save(createAccount)

      const createPoint = pointTypeOrmRepository.create({
        account: saveAccount,
        items: [saveFirstItem, saveSecondItem],
        placeName: 'any_name',
        locationType: 'any_location_type',
        city: 'any_city',
        state: 'any_state',
        image: 'any_image',
        latitude: '-7.0235686',
        longitude: '-37.2872277',
        neighborhood: 'Jardim Lacerda',
        referencePoint: 'Prox a saida',
        street: 'Rua Francisco Alves Queirós',
        zipCode: '58704'
      })

      const savePoint = await pointTypeOrmRepository.save(createPoint)
      const { sut } = makeSut()
      const point = await sut.loadById(savePoint.id)
      expect(point).toBeTruthy()
      expect(point.id).toBeTruthy()
      expect(point.account).toBeTruthy()
      expect(point.items).toBeTruthy()
    })
  })

  describe('LoadAll', () => {
    test('should return list points if success', async () => {
      const fakePoint = await makeFakePoints()
      const { sut } = makeSut()
      const points = await sut.loadAll()
      expect(points[0].account.id).toBeTruthy()
      expect(points[0].account.email).toBeTruthy()
      expect(points[0].items).toBeTruthy()
      expect(points[0].items[0].color).toEqual(fakePoint[0].items[0].color)
      expect(points[0].account.name).toEqual(fakePoint[0].account.name)
    })

    test('should return [] if isEmpty', async () => {
      await accountTypeOrmRepository.query('DELETE FROM item')
      await pointTypeOrmRepository.query('DELETE FROM point')
      await accountTypeOrmRepository.query('DELETE FROM account')
      const { sut } = makeSut()
      const points = await sut.loadAll()
      expect(points).toEqual([])
    })
  })

  describe('FilterItemByItem', () => {
    test('should return list points if success', async () => {
      const fakePoint = await makeFakePoints()
      const idItemOne = fakePoint[0].items[0].id
      const idItemSecond = fakePoint[0].items[1].id
      const resultPoints = [fakePoint[0], fakePoint[1]]
      const { sut } = makeSut()
      const points = await sut.filterByItemsIds([idItemOne, idItemSecond])
      expect(points[0].account.id).toBeTruthy()
      expect(points[0].account.email).toBeTruthy()
      expect(points[0].items).toBeTruthy()
      expect(points[0].items[0].color).toEqual(resultPoints[0].items[0].color)
      expect(points[0].account.name).toEqual(resultPoints[0].account.name)
    })

    test('should return [] if isEmpty', async () => {
      await accountTypeOrmRepository.query('DELETE FROM item')
      await pointTypeOrmRepository.query('DELETE FROM point')
      await accountTypeOrmRepository.query('DELETE FROM account')
      const { sut } = makeSut()
      const points = await sut.loadAll()
      expect(points).toEqual([])
    })
  })
})
