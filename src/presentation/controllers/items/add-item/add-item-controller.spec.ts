import { AddItemController } from './add-item-controller'
import { HttpRequest, Validator } from '../load-items/load-items-controller-protocols'
import { ItemModel } from '@domain/models/item'
import { AddItem, AddItemModel } from '@domain/usecases/add-item'
import { serverError, onCreated, badRequest, alreadyExist } from '@presentation/helper/http/http-helper'
import { MissingParamsError } from '@presentation/errors'
import { AlreadyExistError } from '@presentation/errors/already-exists-error'

type SutTypes = {
  addItemStub: AddItem
  sut: AddItemController
  fakeRequest: HttpRequest
  validatorStub: Validator
}

const fakeItem = (): ItemModel => (
  { id: 'any_id', image: 'http://any_image_1.com', title: 'any_title_1' }
)

const fakeRequest = (): AddItemModel => (
  { image: 'http://any_image_1.com', title: 'any_title_1' }
)

const fakeHttpRequest = (): HttpRequest => ({
  body: fakeRequest()
})

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    isValid (input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}

const makeAddItemStub = (): AddItem => {
  class AddItemStub implements AddItem {
    async add (item: AddItemModel): Promise<ItemModel> {
      return new Promise(resolve => resolve(fakeItem()))
    }
  }
  return new AddItemStub()
}

const makeSut = (): SutTypes => {
  const addItemStub = makeAddItemStub()
  const validatorStub = makeValidatorStub()
  const sut = new AddItemController(addItemStub, validatorStub)
  const fakeRequest = fakeHttpRequest()
  return {
    sut,
    fakeRequest,
    addItemStub,
    validatorStub
  }
}

describe('AddItemController', () => {
  test('should call AddItem with values correctly', async () => {
    const { sut, addItemStub, fakeRequest } = makeSut()
    const addSpy = jest.spyOn(addItemStub, 'add')
    await sut.handle(fakeRequest)
    expect(addSpy).toHaveBeenCalledWith(fakeRequest.body)
  })

  test('should return 500 if AddItem throws', async () => {
    const { sut, addItemStub, fakeRequest } = makeSut()
    jest.spyOn(addItemStub, 'add')
      .mockImplementationOnce(async () => {
        throw new Error()
      })
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 419 if item already exist', async () => {
    const { sut, addItemStub, fakeRequest } = makeSut()
    jest.spyOn(addItemStub, 'add')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(alreadyExist(new AlreadyExistError(fakeRequest.body.title)))
  })

  test('should return 201 if AddItem success', async () => {
    const { sut, fakeRequest } = makeSut()
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(onCreated(fakeItem()))
  })

  test('Should call Validator with correct value', async () => {
    const { sut, validatorStub, fakeRequest } = makeSut()
    const isValidSpy = jest.spyOn(validatorStub, 'isValid')
    await sut.handle(fakeRequest)
    expect(isValidSpy).toHaveBeenCalledWith(fakeRequest.body)
  })

  test('Should return 400 if Validator return Error', async () => {
    const { sut, validatorStub, fakeRequest } = makeSut()
    jest.spyOn(validatorStub, 'isValid').mockReturnValueOnce(new MissingParamsError('any_field'))
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParamsError('any_field')))
  })

  test('should return 500 if Validator throws', async () => {
    const { sut, validatorStub, fakeRequest } = makeSut()
    jest.spyOn(validatorStub, 'isValid')
      .mockImplementationOnce(() => {
        throw new Error()
      })
    const response = await sut.handle(fakeRequest)
    expect(response).toEqual(serverError(new Error()))
  })

  test('Should return 201 and list if Validator is null', async () => {
    const { sut, fakeRequest } = makeSut()
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(onCreated(fakeItem()))
  })
})
