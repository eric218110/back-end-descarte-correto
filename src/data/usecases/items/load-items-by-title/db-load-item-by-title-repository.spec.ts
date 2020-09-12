import { LoadItemByTitleRepository } from '@data/protocols/data/items/load-item-by-title-repository'
import { ItemModel } from '../add-items/db-add-items-protocols'
import { DbLoadItemByTitleRepository } from './db-load-item-by-title-repository'

type SutTypes = {
  sut: DbLoadItemByTitleRepository
  loadItemByTitleRepositoryStub: LoadItemByTitleRepository
}

const makeLoadItemByTitleRepositoryStub = (): LoadItemByTitleRepository => {
  class LoadItemByTitleRepositoryStub implements LoadItemByTitleRepository {
    async loadByTitle(title: string): Promise<ItemModel> {
      return new Promise(resolve =>
        resolve({
          id: 'any_id',
          image: 'http://any_image.com',
          title: 'any_title',
          activeColor: 'any_activeColor',
          color: 'any_color'
        })
      )
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
  test('should call LoadItemByTitle correctly', async () => {
    const { sut, loadItemByTitleRepositoryStub } = makeSut()
    const spyLoadByTitle = jest.spyOn(
      loadItemByTitleRepositoryStub,
      'loadByTitle'
    )
    await sut.load('any_title')
    expect(spyLoadByTitle).toHaveBeenCalledWith('any_title')
  })

  test('should return Item if LoadItemByTitle return success', async () => {
    const { sut } = makeSut()
    const response = await sut.load('any_title')
    expect(response).toEqual({
      id: 'any_id',
      image: 'http://any_image.com',
      title: 'any_title',
      activeColor: 'any_activeColor',
      color: 'any_color'
    })
  })

  test('should return null if LoadItemByTitle returns null', async () => {
    const { sut, loadItemByTitleRepositoryStub } = makeSut()
    jest
      .spyOn(loadItemByTitleRepositoryStub, 'loadByTitle')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const response = await sut.load('any_title')
    expect(response).toBeNull()
  })

  test('should throws if LoadItemByTitle to throws', async () => {
    const { sut, loadItemByTitleRepositoryStub } = makeSut()
    jest
      .spyOn(loadItemByTitleRepositoryStub, 'loadByTitle')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const response = sut.load('any_title')
    await expect(response).rejects.toThrow()
  })
})
