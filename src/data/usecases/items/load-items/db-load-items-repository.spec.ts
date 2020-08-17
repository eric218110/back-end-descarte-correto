import { DbLoadItemsRepository } from './db-load-items-repository'
import { LoadItemsRepository } from '@data/protocols/items/load-items-repository'
import { LoadItemsModel } from '@domain/usecases/load-items'

type SutTypes = {
  sut: DbLoadItemsRepository
  loadItemsRepositoryStub: LoadItemsRepository
  itemsFake: LoadItemsModel[]
}

const makeLoadItemsFake = (): LoadItemsModel[] => ([
  { image: 'http://any_image_1.com', title: 'any_title_1' },
  { image: 'http://any_image_2.com', title: 'any_title_2' },
  { image: 'http://any_image_3.com', title: 'any_title_3' }
])

const makeLoadItemsRepositoryStub = (): LoadItemsRepository => {
  class LoadItemsRepositoryStub implements LoadItemsRepository {
    async loadAllItems (): Promise<LoadItemsModel[]> {
      return new Promise(resolve => resolve(makeLoadItemsFake()))
    }
  }
  return new LoadItemsRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadItemsRepositoryStub = makeLoadItemsRepositoryStub()
  const sut = new DbLoadItemsRepository(loadItemsRepositoryStub)
  const itemsFake = makeLoadItemsFake()
  return {
    sut,
    loadItemsRepositoryStub,
    itemsFake
  }
}

describe('DbLoadItemsRepository', () => {
  test('should call LoadItemRepositoty correctly', async () => {
    const { sut, loadItemsRepositoryStub } = makeSut()
    const loadAllItemsSpy = jest.spyOn(loadItemsRepositoryStub, 'loadAllItems')
    await sut.load()
    expect(loadAllItemsSpy).toBeCalled()
  })

  test('should return a list of LoadItemRepositoty on sucess', async () => {
    const { sut, itemsFake } = makeSut()
    const response = await sut.load()
    expect(response).toEqual(itemsFake)
  })
})
