import { RemovedImageStorage } from '@data/protocols/upload/storage/remove-image-storage'
import { RemoveImageStorage } from './remove-image-storage'

type SutTypes = {
  sut: RemoveImageStorage
  removedImageStorage: RemovedImageStorage
}

const makeRemovedImageStorageStub = (): RemovedImageStorage => {
  class RemovedImageStorageStub implements RemovedImageStorage {
    async removeImage (pathImage: string): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new RemovedImageStorageStub()
}

const makeSut = (): SutTypes => {
  const removedImageStorage = makeRemovedImageStorageStub()
  const sut = new RemoveImageStorage(removedImageStorage)
  return {
    sut,
    removedImageStorage
  }
}

describe('RemoveImageStorage', () => {
  test('should call RemovedImageStorage with correct values', async () => {
    const { sut, removedImageStorage } = makeSut()
    const removeFileSpy = jest.spyOn(removedImageStorage, 'removeImage')
    await sut.remove('any_image_path.file')
    expect(removeFileSpy).toHaveBeenCalledWith('any_image_path.file')
  })
})
