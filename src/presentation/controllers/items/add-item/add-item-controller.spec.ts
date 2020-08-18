import { AddItemController } from './add-item-controller'
import { HttpRequest } from '../load-items/load-items-controller-protocols'
import { ItemModel } from '@domain/models/item'
import { AddItem, AddItemModel } from '@domain/usecases/add-items'

type SutTypes = {
  addItemStub: AddItem
  sut: AddItemController
  fakeRequesItem: HttpRequest
}

const fakeItem = (): ItemModel => (
  { id: 'any_id', image: 'http://any_image_1.com', title: 'any_title_1' }
)

const fakeRequesItem = (): AddItemModel => (
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
  body: fakeRequesItem()
})

const makeSut = (): SutTypes => {
  const addItemStub = makeAddItemStub()
  const sut = new AddItemController(addItemStub)
  const fakeRequesItem = fakeHttpRequest()
  return {
    sut,
    fakeRequesItem,
    addItemStub
  }
}

describe('AddItemController', () => {
  test('should call AddItem with values correctly', async () => {
    const { sut, addItemStub, fakeRequesItem } = makeSut()
    const addSpy = jest.spyOn(addItemStub, 'add')
    await sut.handle(fakeRequesItem)
    expect(addSpy).toHaveBeenCalledWith(fakeRequesItem.body)
  })
})
