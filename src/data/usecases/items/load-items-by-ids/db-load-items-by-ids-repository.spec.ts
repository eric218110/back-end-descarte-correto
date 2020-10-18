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
    description: 'description_item_1.com',
    title: 'valid_title_1',
    activeColor: 'valid_activeColor',
    color: 'valid_color'
  },
  {
    id: 'valid_id_2',
    description: 'description_item_2.com',
    title: 'valid_title_2',
    activeColor: 'valid_activeColor',
    color: 'valid_color'
  },
  {
    id: 'valid_id_3',
    description: 'description_item_3.com',
    title: 'valid_title_3',
    activeColor: 'valid_activeColor',
    color: 'valid_color'
  }
]

const fakeIdsItems = ['id_item_1', 'id_item_2', 'id_item_3', 'id_item_4']

const makeLoadItemsByIdsRepository = (): LoadItemsByIdsRepository => {
  class LoadItemsByIdsRepositoryStub implements LoadItemsByIdsRepository {
    async loadItemsByIds(idsItems: string[]): Promise<ItemModel[]> {
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
      'loadItemsByIds'
    )
    await sut.load(fakeIdsItems)
    expect(loadAllItemsSpy).toBeCalled()
  })

  test('should return null if length item equals 0', async () => {
    const { sut } = makeSut()
    const items = await sut.load([])
    expect(items).toBeNull()
  })

  test('should return null if LoadItemByIdsRepositoty reruns null', async () => {
    const { sut, loadItemsByIdsRepositoryStub } = makeSut()
    jest
      .spyOn(loadItemsByIdsRepositoryStub, 'loadItemsByIds')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const items = await sut.load(fakeIdsItems)
    expect(items).toBeNull()
  })

  test('should return list item if LoadItemByIdsRepositoty success', async () => {
    const { sut } = makeSut()
    const items = await sut.load(fakeIdsItems)
    expect(items).toEqual(resultItems())
  })

  test('should throws if LoadItemByIdsRepositoty throws', async () => {
    const { sut, loadItemsByIdsRepositoryStub } = makeSut()
    jest
      .spyOn(loadItemsByIdsRepositoryStub, 'loadItemsByIds')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const response = sut.load(fakeIdsItems)
    await expect(response).rejects.toThrow()
  })
})
