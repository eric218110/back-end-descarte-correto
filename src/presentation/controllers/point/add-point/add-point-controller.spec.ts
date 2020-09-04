import { PointModel } from '@domain/models/point'
import { AddPoint, AddPointModel } from '@domain/usecases/point/add-point'
import { HttpRequest } from '@presentation/protocols'
import { AddPointController } from './add-point-controller'
import { ItemModel } from '@domain/models/item'
import { LoadItemByIds } from '@data/protocols/data/items/load-items-by-ids'
import { badRequest } from '@presentation/helper/http/http-helper'
import { ItemNotExistError } from '@presentation/errors/'

type SutTypes = {
  sut: AddPointController
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

const fakeRequest = (): HttpRequest => ({
  body: {
    accountId: 'valid_account_id',
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

const makeSut = (): SutTypes => {
  const loadItemByIdsStub = makeLoadItemByIdsStub()
  const addPointStub = makeAddPointStub()
  const sut = new AddPointController(addPointStub, loadItemByIdsStub)
  return {
    sut,
    loadItemByIdsStub,
    addPointStub
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
})
