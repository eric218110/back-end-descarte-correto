import {
  AddPointController,
  HttpRequest,
  PointModel,
  Validator,
  AddPoint,
  LoadItemByIds,
  badRequest,
  forbidden,
  serverError,
  ItemNotExistError,
  AccessDeniedError,
  LoadAccountByToken,
  ItemModel,
  AccountModel,
  AddPointModel,
  MissingParamsError
} from './add-point-controller-protocols'
import { noContent } from '@presentation/helper/http/http-helper'

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
    accountId: 'valid_access_token',
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

const fakeAddPoint = (): AddPointModel => ({
  account: fakeLoadAccount(),
  name: 'any_name',
  city: 'any_city',
  image: 'any_image_url',
  latitude: 'any_latitude',
  longitude: 'any_longitude',
  state: 'any_state',
  phone: 'any_phone',
  items: fakeLoadItems()
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

    test('should return 500 if LoadItemByIds throws', async () => {
      const { sut, loadItemByIdsStub } = makeSut()
      jest.spyOn(loadItemByIdsStub, 'loadItems').mockImplementationOnce(() => {
        throw new Error()
      })
      const response = await sut.handle(fakeRequest())
      expect(response).toEqual(serverError(new Error()))
    })
  })

  describe('Load Account', () => {
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
      expect(addSpy).toHaveBeenCalledWith('valid_access_token')
    })

    test('should return forbidden if LoadAccountByToken returns null', async () => {
      const { sut, loadAccountByTokenStub } = makeSut()
      jest
        .spyOn(loadAccountByTokenStub, 'load')
        .mockReturnValueOnce(new Promise(resolve => resolve(null)))
      const response = await sut.handle(fakeRequest())
      expect(response).toEqual(forbidden(new AccessDeniedError()))
    })

    test('should return 500 if LoadAccountByToken throws', async () => {
      const { sut, loadAccountByTokenStub } = makeSut()
      jest.spyOn(loadAccountByTokenStub, 'load').mockImplementationOnce(() => {
        throw new Error()
      })
      const response = await sut.handle(fakeRequest())
      expect(response).toEqual(serverError(new Error()))
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

  describe('Add Point', () => {
    test('should call Add Point with correct values', async () => {
      const { sut, addPointStub } = makeSut()
      const addSpy = jest.spyOn(addPointStub, 'add')
      await sut.handle(fakeRequest())
      expect(addSpy).toHaveBeenCalledWith(fakeAddPoint())
    })

    test('Should return 204 on success', async () => {
      const { sut } = makeSut()
      const response = await sut.handle(fakeRequest())
      expect(response).toEqual(noContent())
    })
  })
})
