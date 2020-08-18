import { AddItemModel } from '@domain/usecases/add-item'
import { DbAddtemRepository } from './db-add-item-repository'
import { AddItemRepository } from '@data/protocols/items/add-items-repository'
import { ItemModel } from '@domain/models/item'
import { HttpRequest } from '@presentation/protocols'

type SutTypes = {
  addItemRepository: AddItemRepository
  sut: DbAddtemRepository
  fakeRequest: HttpRequest
}

const makeFakeRequest = (): HttpRequest => ({
  body: { image: 'http://any_image_1.com', title: 'any_title_1' }
})

const makeItemFake = (): ItemModel => (
  { id: 'any_id', image: 'http://any_image_1.com', title: 'any_title_1' }
)

const makeAdItemRepositoryStub = (): AddItemRepository => {
  class AddItemRepositoryStub implements AddItemRepository {
    async addNewItem (addItem: AddItemModel): Promise<ItemModel> {
      return new Promise(resolve => resolve(makeItemFake()))
    }
  }
  return new AddItemRepositoryStub()
}

const makeSut = (): SutTypes => {
  const addItemRepository = makeAdItemRepositoryStub()
  const sut = new DbAddtemRepository(addItemRepository)
  const fakeRequest = makeFakeRequest()
  return {
    sut,
    fakeRequest,
    addItemRepository
  }
}

describe('DbAddItemRepository', () => {
  test('should call DbAddtemRepository with correct values', async () => {
    const { sut, addItemRepository, fakeRequest } = makeSut()
    const addSpy = jest.spyOn(addItemRepository, 'addNewItem')
    await sut.add(fakeRequest.body)
    expect(addSpy).toBeCalledWith(fakeRequest.body)
  })
})
