import { SavedImageStorage } from './saved-image-storage'
import { SavedFileStorage } from '@data/protocols/upload/storage/saved-file-storage'
import { HttpRequest } from '@presentation/protocols'

type SutTypes = {
  sut: SavedImageStorage
  savedFileStorage: SavedFileStorage
}

const makeSavedFileStorageStub = (): SavedFileStorage => {
  class SavedFileStorageStub implements SavedFileStorage {
    async saveFile (request: any): Promise<string> {
      return new Promise(resolve => resolve('http://image_url.com'))
    }
  }
  return new SavedFileStorageStub()
}

const makeSut = (): SutTypes => {
  const savedFileStorage = makeSavedFileStorageStub()
  const sut = new SavedImageStorage(savedFileStorage)
  return {
    savedFileStorage,
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
    const { sut, savedFileStorage } = makeSut()
    const spySaveFile = jest.spyOn(savedFileStorage, 'saveFile')
    await sut.save(makeFakeRequest())
    expect(spySaveFile).toBeCalledWith(makeFakeRequest())
  })

  test('should throws if FileStorage throws', async () => {
    const { sut, savedFileStorage } = makeSut()
    jest.spyOn(savedFileStorage, 'saveFile')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promisse = sut.save(makeFakeRequest())
    await expect(promisse).rejects.toThrow()
  })
})
