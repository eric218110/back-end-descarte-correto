import { LoadItemsController } from './load-items-controller'
import { noContent } from '@presentation/helper/http/http-helper'
import { LoadItems, LoadItemsModel } from './load-items-controller-protocols'

type SutType = {
  sut: LoadItemsController
  loadItemsStub: LoadItems
  fakeLoadItems: LoadItemsModel[]
}

const makeLoadItemsFake = (): LoadItemsModel[] => ([
  { image: 'http://any_image_1.com', title: 'any_title_1' },
  { image: 'http://any_image_2.com', title: 'any_title_2' },
  { image: 'http://any_image_3.com', title: 'any_title_3' }
])

const makeLoadItemsStub = (): LoadItems => {
  class LoadItemsStub implements LoadItems {
    async load (): Promise<LoadItemsModel[]> {
      return new Promise(resolve => resolve(makeLoadItemsFake()))
    }
  }
  return new LoadItemsStub()
}

const makeSut = (): SutType => {
  const loadItemsStub = makeLoadItemsStub()
  const sut = new LoadItemsController(loadItemsStub)
  const fakeLoadItems = makeLoadItemsFake()
  return {
    sut,
    loadItemsStub,
    fakeLoadItems
  }
}

describe('LoadItemsController', () => {
  test('should call LoadItems', async () => {
    const { sut, loadItemsStub } = makeSut()
    const loadSpy = jest.spyOn(loadItemsStub, 'load')
    await sut.handle({})
    expect(loadSpy).toBeCalled()
  })

  test('should return if LoadItems returns null', async () => {
    const { sut, loadItemsStub } = makeSut()
    jest.spyOn(loadItemsStub, 'load')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const response = await sut.handle({})
    expect(response).toEqual(noContent())
  })
})
