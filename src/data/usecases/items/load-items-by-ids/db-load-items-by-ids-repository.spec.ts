import { DbLoadItemsByIdsRepository } from './db-load-items-by-ids-repository'
import { LoadItemsByIdsRepository } from '@data/protocols/data/items/load-items-by-ids-repository'
import { ItemModel } from '@domain/models/item'

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
    await sut.loadItems(['id_item_1', 'id_item_2', 'id_item_3', 'id_item_4'])
    expect(loadAllItemsSpy).toBeCalled()
  })
})
