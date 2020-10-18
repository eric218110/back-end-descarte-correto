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
  LoadAccountById,
  ItemModel,
  AccountModel,
  AddPointModel,
  MissingParamsError,
  noContent,
  UploadFileError
} from './add-point-controller-protocols'

type SutTypes = {
  sut: AddPointController
  loadAccountByIdStub: LoadAccountById
  addPointStub: AddPoint
  loadItemByIdsStub: LoadItemByIds
  validatorStub: Validator
}

const fakeCreatePoint = (): PointModel => ({
  id: 'valid_id',
  name: 'valid_name',
  city: 'valid_city',
  image: 'http://valid_image_url.com',
  latitude: 'valid_latitude',
  longitude: 'valid_longitude',
  state: 'valid_state',
  neighborhood: 'valide_neighborhood',
  reference: 'valide_reference',
  street: 'valide_street',
  zipCode: 'valide_zipCode',
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
      id: 'valid_item_id_1',
      title: 'valid_item_image_1',
      description: 'valid_description',
      activeColor: 'valid_active_color',
      color: 'valid_color'
    },
    {
      id: 'valid_item_id_2',
      title: 'valid_item_image_2',
      description: 'valid_description',
      activeColor: 'valid_active_color',
      color: 'valid_color'
    }
  ]
})

const fakeLoadItems = (): ItemModel[] => [
  {
    id: 'any_item_id_1',
    title: 'valid_item_image_1',
    description: 'valid_description',
    activeColor: 'any_active_color',
    color: 'any_color'
  },
  {
    id: 'any_item_id_2',
    title: 'valid_item_image_2',
    description: 'valid_description',
    activeColor: 'any_active_color',
    color: 'any_color'
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
    file: 'http://any_image_url.com',
    latitude: 'any_latitude',
    longitude: 'any_longitude',
    state: 'any_state',
    neighborhood: 'any_neighborhood',
    reference: 'any_reference',
    street: 'any_street',
    zipCode: 'any_zipCode',
    items: 'any_item_id_1, any_item_id_2'
  }
})

const fakeAddPoint = (): AddPointModel => ({
  account: fakeLoadAccount(),
  name: 'any_name',
  city: 'any_city',
  image: 'http://any_image_url.com',
  latitude: 'any_latitude',
  longitude: 'any_longitude',
  state: 'any_state',
  neighborhood: 'any_neighborhood',
  reference: 'any_reference',
  street: 'any_street',
  zipCode: 'any_zipCode',
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
    async load(idsItems: string[]): Promise<ItemModel[]> {
      return new Promise(resolve => resolve(fakeLoadItems()))
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

const makeLoadAccountByIdStub = (): LoadAccountById => {
  class LoadAccountByIdStub implements LoadAccountById {
    async load(id: string): Promise<AccountModel> {
      return new Promise(resolve => resolve(fakeLoadAccount()))
    }
  }
  return new LoadAccountByIdStub()
}

const makeSut = (): SutTypes => {
  const addPointStub = makeAddPointStub()
  const loadItemByIdsStub = makeLoadItemByIdsStub()
  const validatorStub = makeValidatorStub()
  const loadAccountByIdStub = makeLoadAccountByIdStub()
  const sut = new AddPointController(
    addPointStub,
    loadItemByIdsStub,
    loadAccountByIdStub,
    validatorStub
  )
  return {
    sut,
    loadItemByIdsStub,
    addPointStub,
    validatorStub,
    loadAccountByIdStub
  }
}

describe('AddPointController', () => {
  describe('Load Items', () => {
    test('should call LoadItemByIds with correct values', async () => {
      const { sut, loadItemByIdsStub } = makeSut()
      const addSpy = jest.spyOn(loadItemByIdsStub, 'load')
      await sut.handle(fakeRequest())
      expect(addSpy).toHaveBeenCalledWith(['any_item_id_1', 'any_item_id_2'])
    })

    test('should return bad request if LoadItemByIds returns null', async () => {
      const { sut, loadItemByIdsStub } = makeSut()
      jest
        .spyOn(loadItemByIdsStub, 'load')
        .mockReturnValueOnce(new Promise(resolve => resolve(null)))
      const response = await sut.handle(fakeRequest())
      expect(response).toEqual(badRequest(new ItemNotExistError()))
    })

    test('should return bad request if items in request is null', async () => {
      const { sut } = makeSut()
      const request = fakeRequest()
      delete request.body.items
      const response = await sut.handle(request)
      expect(response).toEqual(badRequest(new ItemNotExistError()))
    })

    test('should return bad request if items poorly formatted', async () => {
      const { sut } = makeSut()
      const request = fakeRequest()
      request.body.items = ''
      const response = await sut.handle(request)
      expect(response).toEqual(badRequest(new ItemNotExistError()))
    })

    test('should return 500 if LoadItemByIds throws', async () => {
      const { sut, loadItemByIdsStub } = makeSut()
      jest.spyOn(loadItemByIdsStub, 'load').mockImplementationOnce(() => {
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
          file: 'http://any_image_url.com',
          image: 'any_image_url',
          latitude: 'any_latitude',
          longitude: 'any_longitude',
          state: 'any_state',
          items: 'any_item_id_1, any_item_id_2'
        }
      })
      expect(response).toEqual(forbidden(new AccessDeniedError()))
    })
    test('should call LoadAccountById with correct values', async () => {
      const { sut, loadAccountByIdStub } = makeSut()
      const addSpy = jest.spyOn(loadAccountByIdStub, 'load')
      await sut.handle(fakeRequest())
      expect(addSpy).toHaveBeenCalledWith(fakeRequest().body.accountId)
    })

    test('should return forbidden if LoadAccountById returns null', async () => {
      const { sut, loadAccountByIdStub } = makeSut()
      jest
        .spyOn(loadAccountByIdStub, 'load')
        .mockReturnValueOnce(new Promise(resolve => resolve(null)))
      const response = await sut.handle(fakeRequest())
      expect(response).toEqual(forbidden(new AccessDeniedError()))
    })

    test('should return 500 if LoadAccountById throws', async () => {
      const { sut, loadAccountByIdStub } = makeSut()
      jest.spyOn(loadAccountByIdStub, 'load').mockImplementationOnce(() => {
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

  describe('File Image', () => {
    test('Should return 400 if field file not exist in request', async () => {
      const { sut } = makeSut()
      const httpResponse = await sut.handle({
        body: {
          error: 'any_error_is_required'
        }
      })
      expect(httpResponse).toEqual(
        badRequest(new UploadFileError('any_error_is_required'))
      )
    })
  })
})
