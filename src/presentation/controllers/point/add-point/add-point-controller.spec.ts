import { PointModel } from '@domain/models/point'
import { AddPoint, AddPointModel } from '@domain/usecases/point/add-point'
import { HttpRequest, Validator } from '@presentation/protocols'
import { AddPointController } from './add-point-controller'
import { ItemModel } from '@domain/models/item'
import { LoadItemByIds } from '@data/protocols/data/items/load-items-by-ids'
import {
  badRequest,
  forbidden,
  serverError
} from '@presentation/helper/http/http-helper'
import { ItemNotExistError, MissingParamsError } from '@presentation/errors/'
import { AccessDeniedError } from '@presentation/errors/access-denied-error'
import { LoadAccountByToken } from '@domain/usecases/account/load-accout-by-token'
import { AccountModel } from '@domain/models/account'

type SutTypes = {
  sut: AddPointController
  loadAccountByTokenStub: LoadAccountByToken
  addPointStub: AddPoint
  loadItemByIdsStub: LoadItemByIds
  validatorStub: Validator
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

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    isValid(input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeSut = (): SutTypes => {
  const addPointStub = makeAddPointStub()
  const loadItemByIdsStub = makeLoadItemByIdsStub()
  const loadAccountByTokenStub = makeLoadAccountByTokenStub()
  const validatorStub = makeValidatorStub()
  const sut = new AddPointController(
    addPointStub,
    loadItemByIdsStub,
    loadAccountByTokenStub,
    validatorStub
  )
  return {
    sut,
    loadItemByIdsStub,
    addPointStub,
    loadAccountByTokenStub,
    validatorStub
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

    test('should return bad request if LoadItemByIds returns null', async () => {
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

    test('should return forbidden if LoadAccountByToken returns null', async () => {
      const { sut, loadAccountByTokenStub } = makeSut()
      jest
        .spyOn(loadAccountByTokenStub, 'load')
        .mockReturnValueOnce(new Promise(resolve => resolve(null)))
      const response = await sut.handle(fakeRequest())
      expect(response).toEqual(forbidden(new AccessDeniedError()))
    })
  })

  describe('Validator', () => {
    test('Should call Validator with correct value', async () => {
      const { sut, validatorStub } = makeSut()
      const isValidSpy = jest.spyOn(validatorStub, 'isValid')
      await sut.handle(fakeRequest())
      expect(isValidSpy).toHaveBeenCalledWith(fakeRequest().body)
    })

    test('Should return 400 if Validator return Error', async () => {
      const { sut, validatorStub } = makeSut()
      jest
        .spyOn(validatorStub, 'isValid')
        .mockReturnValueOnce(new MissingParamsError('any_field'))
      const httpResponse = await sut.handle(fakeRequest())
      expect(httpResponse).toEqual(
        badRequest(new MissingParamsError('any_field'))
      )
    })

    test('should return 500 if Validator throws', async () => {
      const { sut, validatorStub } = makeSut()
      jest.spyOn(validatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })
      const response = await sut.handle(fakeRequest())
      expect(response).toEqual(serverError(new Error()))
    })
  })
})
