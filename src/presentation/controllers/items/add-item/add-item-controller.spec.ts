import { AddItemController } from './add-item-controller'
import {
  HttpRequest,
  Validator
} from '../load-items/load-items-controller-protocols'
import { ItemModel } from '@domain/models/item'
import { AddItem, AddItemModel } from '@domain/usecases/item/add-item'
import {
  serverError,
  badRequest,
  noContent
} from '@presentation/helper/http/http-helper'
import {
  MissingParamsError,
  TitleAlreadyExistError
} from '@presentation/errors'
import { LoadItemByTitle } from '@domain/usecases/item/load-item-by-title'

type SutTypes = {
  addItemStub: AddItem
  sut: AddItemController
  fakeRequest: HttpRequest
  validatorStub: Validator
  loadItemByTitleStub: LoadItemByTitle
}

const fakeItem = (): ItemModel => ({
  id: 'any_id',
  description: 'any_description',
  title: 'any_title_1',
  activeColor: 'any_activeColor',
  color: 'any_color'
})

const fakeRequest = (): {} => ({
  activeColor: 'any color',
  color: 'any secundary color',
  description: 'any description',
  title: 'any_title'
})

const fakeHttpRequest = (): HttpRequest => ({
  body: fakeRequest()
})

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    isValid(input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeAddItemStub = (): AddItem => {
  class AddItemStub implements AddItem {
    async add(item: AddItemModel): Promise<ItemModel> {
      return new Promise(resolve => resolve(fakeItem()))
    }
  }
  return new AddItemStub()
}

const makeLoadItemByTitleStub = (): LoadItemByTitle => {
  class AddItemStub implements LoadItemByTitle {
    async load(title: string): Promise<ItemModel> {
      return new Promise(resolve => resolve(null))
    }
  }
  return new AddItemStub()
}

const makeSut = (): SutTypes => {
  const loadItemByTitleStub = makeLoadItemByTitleStub()
  const addItemStub = makeAddItemStub()
  const validatorStub = makeValidatorStub()
  const sut = new AddItemController(
    addItemStub,
    validatorStub,
    loadItemByTitleStub
  )
  const fakeRequest = fakeHttpRequest()
  return {
    sut,
    fakeRequest,
    addItemStub,
    validatorStub,
    loadItemByTitleStub
  }
}

describe('AddItemController', () => {
  describe('AddItem', () => {
    test('should call AddItem with values correctly', async () => {
      const { sut, addItemStub, fakeRequest } = makeSut()
      const addSpy = jest.spyOn(addItemStub, 'add')
      await sut.handle(fakeRequest)
      expect(addSpy).toHaveBeenCalledWith(fakeRequest.body)
    })

    test('should return 500 if AddItem throws', async () => {
      const { sut, addItemStub, fakeRequest } = makeSut()
      jest.spyOn(addItemStub, 'add').mockImplementationOnce(async () => {
        throw new Error()
      })
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(serverError(new Error()))
    })

    test('Should return 204 on success', async () => {
      const { sut, fakeRequest } = makeSut()
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(noContent())
    })
  })

  describe('Validator', () => {
    test('Should call Validator with correct value', async () => {
      const { sut, validatorStub, fakeRequest } = makeSut()
      const isValidSpy = jest.spyOn(validatorStub, 'isValid')
      await sut.handle(fakeRequest)
      expect(isValidSpy).toHaveBeenCalledWith(fakeRequest.body)
    })

    test('Should return 400 if Validator return Error', async () => {
      const { sut, validatorStub, fakeRequest } = makeSut()
      jest
        .spyOn(validatorStub, 'isValid')
        .mockReturnValueOnce(new MissingParamsError('any_field'))
      const httpResponse = await sut.handle(fakeRequest)
      expect(httpResponse).toEqual(
        badRequest(new MissingParamsError('any_field'))
      )
    })

    test('should return 500 if Validator throws', async () => {
      const { sut, validatorStub, fakeRequest } = makeSut()
      jest.spyOn(validatorStub, 'isValid').mockImplementationOnce(() => {
        throw new Error()
      })
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(serverError(new Error()))
    })
  })

  describe('LoadItemByTitle', () => {
    test('should call LoadItemByTitle with values correctly', async () => {
      const { sut, loadItemByTitleStub, fakeRequest } = makeSut()
      const addSpy = jest.spyOn(loadItemByTitleStub, 'load')
      await sut.handle(fakeRequest)
      expect(addSpy).toHaveBeenCalledWith(fakeRequest.body.title)
    })

    test('should return 400 if title already exist', async () => {
      const { sut, loadItemByTitleStub, fakeRequest } = makeSut()
      jest
        .spyOn(loadItemByTitleStub, 'load')
        .mockReturnValueOnce(new Promise(resolve => resolve(fakeItem())))
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(badRequest(new TitleAlreadyExistError()))
    })

    test('should return 500 if LoadItemByTitle throws', async () => {
      const { sut, loadItemByTitleStub, fakeRequest } = makeSut()
      jest
        .spyOn(loadItemByTitleStub, 'load')
        .mockImplementationOnce(async () => {
          throw new Error()
        })
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(serverError(new Error()))
    })

    test('should return 204 if title not exist', async () => {
      const { sut, fakeRequest } = makeSut()
      const response = await sut.handle(fakeRequest)
      expect(response).toEqual(noContent())
    })
  })
})
