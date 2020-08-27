import { SaveImageStorage } from './saved-image-storage'
import { SavedImageStorage } from '@data/protocols/upload/storage/saved-image-storage'
import { HttpRequest } from '@presentation/protocols'

type SutTypes = {
  sut: SaveImageStorage
  savedImageStorage: SavedImageStorage
}

const makeSavedImageStorageStub = (): SavedImageStorage => {
  class SavedImageStorageStub implements SavedImageStorage {
    async saveImage (request: any): Promise<string> {
      return new Promise(resolve => resolve('http://image_url.com'))
    }
  }
  return new SavedImageStorageStub()
}

const makeSut = (): SutTypes => {
  const savedImageStorage = makeSavedImageStorageStub()
  const sut = new SaveImageStorage(savedImageStorage)
  return {
    savedImageStorage,
    sut
  }
}

const makeFakeRequest = (): HttpRequest => ({
  file: {
    request: {
      file: {
        orinalname: 'any_original_name'
      }
    },
    response: {}
  }
})

describe('SavedImageStorage', () => {
  test('should call save with correct values', async () => {
    const { sut, savedImageStorage } = makeSut()
    const spySaveFile = jest.spyOn(savedImageStorage, 'saveImage')
    await sut.save(makeFakeRequest())
    expect(spySaveFile).toBeCalledWith(makeFakeRequest())
  })

  test('should throws if FileStorage throws', async () => {
    const { sut, savedImageStorage } = makeSut()
    jest.spyOn(savedImageStorage, 'saveImage')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promisse = sut.save(makeFakeRequest())
    await expect(promisse).rejects.toThrow()
  })
})
