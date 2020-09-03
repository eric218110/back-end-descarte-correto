import { DbAddItemRepository } from './db-add-item-repository'
import {
  AddItemModel,
  AddItemRepository,
  ItemModel,
  HttpRequest
} from './db-add-items-protocols'

type SutTypes = {
  addItemRepository: AddItemRepository
  sut: DbAddItemRepository
  fakeRequest: HttpRequest
}

const makeFakeRequest = (): HttpRequest => ({
  body: { image: 'http://any_image_1.com', title: 'any_title_1' }
})

const makeItemFake = (): ItemModel => ({
  id: 'any_id',
  image: 'http://any_image_1.com',
  title: 'any_title_1'
})

const makeAdItemRepositoryStub = (): AddItemRepository => {
  class AddItemRepositoryStub implements AddItemRepository {
    async addNewItem(addItem: AddItemModel): Promise<ItemModel> {
      return new Promise(resolve => resolve(makeItemFake()))
    }
  }
  return new AddItemRepositoryStub()
}

const makeSut = (): SutTypes => {
  const addItemRepository = makeAdItemRepositoryStub()
  const sut = new DbAddItemRepository(addItemRepository)
  const fakeRequest = makeFakeRequest()
  return {
    sut,
    fakeRequest,
    addItemRepository
  }
}

describe('DbAddItemRepository', () => {
  test('should call AddtemRepository with correct values', async () => {
    const { sut, addItemRepository, fakeRequest } = makeSut()
    const addSpy = jest.spyOn(addItemRepository, 'addNewItem')
    await sut.add(fakeRequest.body)
    expect(addSpy).toBeCalledWith(fakeRequest.body)
  })

  test('should return item if AddtemRepository success', async () => {
    const { sut, fakeRequest } = makeSut()
    const { title, image } = fakeRequest.body
    const response = await sut.add({ title, image })
    expect(response).toEqual(
      expect.objectContaining({
        image: 'http://any_image_1.com',
        title: 'any_title_1'
      })
    )
  })

  test('should throws if AddtemRepository throws', async () => {
    const { sut, addItemRepository, fakeRequest } = makeSut()
    jest
      .spyOn(addItemRepository, 'addNewItem')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const response = sut.add(fakeRequest.body)
    await expect(response).rejects.toThrow()
  })
})
