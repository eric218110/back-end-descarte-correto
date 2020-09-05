import { DbLoadItemsByIdsRepository } from './db-load-items-by-ids-repository'
import {
  LoadItemsByIdsRepository,
  ItemModel
} from './db-load-items-by-ids-protocols'

type SutTypes = {
  sut: DbLoadItemsByIdsRepository
  loadItemsByIdsRepositoryStub: LoadItemsByIdsRepository
}

const resultItems = (): ItemModel[] => [
  {
    id: 'valid_id_1',
    image: 'http://valid_image_1.com',
    title: 'valid_title_1'
  },
  {
    id: 'valid_id_2',
    image: 'http://valid_image_2.com',
    title: 'valid_title_2'
  },
  {
    id: 'valid_id_3',
    image: 'http://valid_image_3.com',
    title: 'valid_title_3'
  }
]

const fakeIdsItems = ['id_item_1', 'id_item_2', 'id_item_3', 'id_item_4']

const makeLoadItemsByIdsRepository = (): LoadItemsByIdsRepository => {
  class LoadItemsByIdsRepositoryStub implements LoadItemsByIdsRepository {
    async loadItems(idsItems: string[]): Promise<ItemModel[]> {
      return new Promise(resolve => resolve(resultItems()))
    }
  }
  return new LoadItemsByIdsRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadItemsByIdsRepositoryStub = makeLoadItemsByIdsRepository()
  const sut = new DbLoadItemsByIdsRepository(loadItemsByIdsRepositoryStub)
  return {
    sut,
    loadItemsByIdsRepositoryStub
  }
}

describe('DbLoadItemsByIdsRepository', () => {
  test('should call LoadItemByIdsRepositoty correctly', async () => {
    const { sut, loadItemsByIdsRepositoryStub } = makeSut()
    const loadAllItemsSpy = jest.spyOn(
      loadItemsByIdsRepositoryStub,
      'loadItems'
    )
    await sut.loadItems(fakeIdsItems)
    expect(loadAllItemsSpy).toBeCalled()
  })

  test('should return null if length item equals 0', async () => {
    const { sut } = makeSut()
    const items = await sut.loadItems([])
    expect(items).toBeNull()
  })

  test('should return null if LoadItemByIdsRepositoty reruns null', async () => {
    const { sut, loadItemsByIdsRepositoryStub } = makeSut()
    jest
      .spyOn(loadItemsByIdsRepositoryStub, 'loadItems')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const items = await sut.loadItems(fakeIdsItems)
    expect(items).toBeNull()
  })

  test('should return list item if LoadItemByIdsRepositoty success', async () => {
    const { sut } = makeSut()
    const items = await sut.loadItems(fakeIdsItems)
    expect(items).toEqual(resultItems())
  })

  test('should throws if LoadItemByIdsRepositoty throws', async () => {
    const { sut, loadItemsByIdsRepositoryStub } = makeSut()
    jest
      .spyOn(loadItemsByIdsRepositoryStub, 'loadItems')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const response = sut.loadItems(fakeIdsItems)
    await expect(response).rejects.toThrow()
  })
})