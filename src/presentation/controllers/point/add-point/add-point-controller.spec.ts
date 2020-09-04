import { PointModel } from '@domain/models/point'
import { AddPoint, AddPointModel } from '@domain/usecases/point/add-point'
import { HttpRequest } from '@presentation/protocols'
import { AddPointController } from './add-point-controller'
import { ItemModel } from '@domain/models/item'
import { LoadItemByIds } from '@data/protocols/data/items/load-items-by-ids'
import { badRequest, forbidden } from '@presentation/helper/http/http-helper'
import { ItemNotExistError } from '@presentation/errors/'
import { AccessDeniedError } from '@presentation/errors/access-denied-error'
import { LoadAccountByToken } from '@domain/usecases/account/load-accout-by-token'
import { AccountModel } from '@domain/models/account'

type SutTypes = {
  sut: AddPointController
  loadAccountByTokenStub: LoadAccountByToken
  addPointStub: AddPoint
  loadItemByIdsStub: LoadItemByIds
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
  account: {
    id: 'valid_id_user',
    name: 'valid_name',
    email: 'valid_email_user',
    password: 'valid_password',
    accessToken: 'valid_access_token',
    role: 'valid_role'
  },
  items: [
    {
      id: 'valid_id_item_1',
      image: 'http://valid_item_image_1_url.com.br',
      title: 'valid_item_image_1'
    },
    {
      id: 'valid_id_item_2',
      image: 'http://valid_item_image_2_url.com.br',
      title: 'valid_item_image_2'
    }
  ]
})

const fakeLoadItems = (): ItemModel[] => [
  {
    id: 'valid_id_item_1',
    image: 'http://valid_item_image_1_url.com.br',
    title: 'valid_item_image_1'
  },
  {
    id: 'valid_id_item_2',
    image: 'http://valid_item_image_2_url.com.br',
    title: 'valid_item_image_2'
  }
]

const fakeLoadAccount = (): AccountModel => ({
  id: 'valid_id',
  email: 'valid_email',
  name: 'valid_name',
  password: 'valid_password',
  accessToken: 'valid_access_token',
  role: 'valid_role'
})

const fakeRequest = (): HttpRequest => ({
  body: {
    accountId: 'any_account_token_id',
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

const makeAddPointStub = (): AddPoint => {
  class AddPointStub implements AddPoint {
    async add(point: AddPointModel): Promise<PointModel> {
      return new Promise(resolve => resolve(fakeCreatePoint()))
    }
  }

  return new AddPointStub()
}

const makeLoadItemByIdsStub = (): LoadItemByIds => {
  class LoadItemByIdsStub implements LoadItemByIds {
    async loadItems(idsItems: string[]): Promise<ItemModel[]> {
      return new Promise(resolve => resolve(fakeLoadItems()))
    }
  }

  return new LoadItemByIdsStub()
}

const makeLoadAccountByTokenStub = (): LoadAccountByToken => {
  class LoadItemByIdsStub implements LoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(fakeLoadAccount()))
    }
  }

  return new LoadItemByIdsStub()
}

const makeSut = (): SutTypes => {
  const addPointStub = makeAddPointStub()
  const loadItemByIdsStub = makeLoadItemByIdsStub()
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const sut = new AddPointController(
    addPointStub,
    loadItemByIdsStub,
    loadAccountByTokenStub
  )
  return {
    sut,
    loadItemByIdsStub,
    addPointStub,
    loadAccountByTokenStub
  }
}

describe('AddPointController', () => {
  describe('Load Items', () => {
    test('should call LoadItemByIds with correct values', async () => {
      const { sut, loadItemByIdsStub } = makeSut()
      const addSpy = jest.spyOn(loadItemByIdsStub, 'loadItems')
      await sut.handle(fakeRequest())
      expect(addSpy).toHaveBeenCalledWith(['any_id_item_1', 'any_id_item_2'])
    })

    test('should call return bad request if LoadItemByIds returns null', async () => {
      const { sut, loadItemByIdsStub } = makeSut()
      jest
        .spyOn(loadItemByIdsStub, 'loadItems')
        .mockReturnValueOnce(new Promise(resolve => resolve(null)))
      const response = await sut.handle(fakeRequest())
      expect(response).toEqual(badRequest(new ItemNotExistError()))
    })
  })

  describe('Account', () => {
    test('should return forbiden if account id is null', async () => {
      const { sut } = makeSut()
      const response = await sut.handle({
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
      expect(response).toEqual(forbidden(new AccessDeniedError()))
    })

    test('should call LoadAccountByToken with correct values', async () => {
      const { sut, loadAccountByTokenStub } = makeSut()
      const addSpy = jest.spyOn(loadAccountByTokenStub, 'load')
      await sut.handle(fakeRequest())
      expect(addSpy).toHaveBeenCalledWith('any_account_token_id')
    })
  })
})
