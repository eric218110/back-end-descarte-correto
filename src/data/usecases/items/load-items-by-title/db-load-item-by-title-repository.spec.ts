import { LoadItemByTitleRepository } from '@data/protocols/data/items/load-item-by-title-repository'
import { ItemModel } from '../add-items/db-add-items-protocols'
import { DbLoadItemByTitleRepository } from './db-load-item-by-title-repository'

type SutTypes = {
  sut: DbLoadItemByTitleRepository
  loadItemByTitleRepositoryStub: LoadItemByTitleRepository
}

const makeLoadItemByTitleRepositoryStub = (): LoadItemByTitleRepository => {
  class LoadItemByTitleRepositoryStub implements LoadItemByTitleRepository {
    async loadByTitle (title: string): Promise<ItemModel> {
      return new Promise(resolve => resolve({
        id: 'any_id',
        image: 'http://any_image.com',
        title: 'any_title'
      }))
    }
  }
  return new LoadItemByTitleRepositoryStub()
}

const makeSut = (): SutTypes => {
  const loadItemByTitleRepositoryStub = makeLoadItemByTitleRepositoryStub()
  const sut = new DbLoadItemByTitleRepository(loadItemByTitleRepositoryStub)
  return {
    sut,
    loadItemByTitleRepositoryStub
  }
}

describe('DbLoadItemByTitleRepository', () => {
  test('should call LoadItemByToken correctly', async () => {
    const { sut, loadItemByTitleRepositoryStub } = makeSut()
    const spyLoadByTitle = jest.spyOn(loadItemByTitleRepositoryStub, 'loadByTitle')
    await sut.load('any_title')
    expect(spyLoadByTitle).toHaveBeenCalledWith('any_title')
  })
})
