import { AddItemController } from './add-item-controller'
import { HttpRequest } from '../load-items/load-items-controller-protocols'
import { ItemModel } from '@domain/models/item'
import { AddItem, AddItemModel } from '@domain/usecases/add-items'
import { serverError } from '@presentation/helper/http/http-helper'

type SutTypes = {
  addItemStub: AddItem
  sut: AddItemController
  fakeRequest: HttpRequest
}

const fakeItem = (): ItemModel => (
  { id: 'any_id', image: 'http://any_image_1.com', title: 'any_title_1' }
)

const fakeRequest = (): AddItemModel => (
  { image: 'http://any_image_1.com', title: 'any_title_1' }
)

const makeAddItemStub = (): AddItem => {
  class AddItemStub implements AddItem {
    async add (item: AddItemModel): Promise<ItemModel> {
      return new Promise(resolve => resolve(fakeItem()))
    }
  }
  return new AddItemStub()
}

const fakeHttpRequest = (): HttpRequest => ({
  body: fakeRequest()
})

const makeSut = (): SutTypes => {
  const addItemStub = makeAddItemStub()
  const sut = new AddItemController(addItemStub)
  const fakeRequest = fakeHttpRequest()
  return {
    sut,
    fakeRequest,
    addItemStub
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
})
