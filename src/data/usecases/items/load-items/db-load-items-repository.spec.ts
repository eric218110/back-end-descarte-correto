import { DbLoadItemsRepository } from './db-load-items-repository'
import { LoadItemsModel, LoadItemsRepository } from './db-load-items-protocols'

type SutTypes = {
  sut: DbLoadItemsRepository
  loadItemsRepositoryStub: LoadItemsRepository
  itemsFake: LoadItemsModel[]
}

const makeLoadItemsFake = (): LoadItemsModel[] => [
  {
    description: 'any_description_id_1',
    title: 'any_title_1',
    activeColor: 'any_activeColor',
    color: 'any_color'
  },
  {
    description: 'any_description_id_2',
    title: 'any_title_2',
    activeColor: 'any_activeColor',
    color: 'any_color'
  },
  {
    description: 'any_description_id_3',
    title: 'any_title_3',
    activeColor: 'any_activeColor',
    color: 'any_color'
  }
]

const makeLoadItemsRepositoryStub = (): LoadItemsRepository => {
  class LoadItemsRepositoryStub implements LoadItemsRepository {
    async loadAllItems(): Promise<LoadItemsModel[]> {
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

  test('should return null if LoadItemRepositoty list is null', async () => {
    const { sut, loadItemsRepositoryStub } = makeSut()
    jest
      .spyOn(loadItemsRepositoryStub, 'loadAllItems')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const response = await sut.load()
    expect(response).toBeNull()
  })

  test('should return a list of LoadItemRepositoty on sucess', async () => {
    const { sut, itemsFake } = makeSut()
    const response = await sut.load()
    expect(response).toEqual(itemsFake)
  })

  test('should throws if LoadItemRepositoty throws', async () => {
    const { sut, loadItemsRepositoryStub } = makeSut()
    jest
      .spyOn(loadItemsRepositoryStub, 'loadAllItems')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const response = sut.load()
    await expect(response).rejects.toThrow()
  })
})
