import { SaveImage } from './save-image'
import { ImageFileUploader, FileProps } from './save-image-protocols'
import { SavedImageStorage } from '@data/protocols/upload/storage/saved-image-storage'

type SutTypes = {
  imageFileUploaderStub: ImageFileUploader
  sut: SaveImage
  saveFileStorageStub: SavedImageStorage
  fileFake: FileProps
}

const makeFileFake = (): FileProps => ({
  request: 'any_request',
  response: 'any_response'
})

const makeImageFileUploaderStub = (): ImageFileUploader => {
  class ImageFileUploaderStub implements ImageFileUploader {
    async imageUpload(
      fileImage: FileProps,
      saveFileStorage: SavedImageStorage
    ): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new ImageFileUploaderStub()
}

const makeSaveFileStorageStub = (): SavedImageStorage => {
  class SavedImageStorageStub implements SavedImageStorage {
    async saveImage(request: any): Promise<string> {
      return new Promise(resolve => resolve())
    }
  }
  return new SavedImageStorageStub()
}

const makeSut = (): SutTypes => {
  const imageFileUploaderStub = makeImageFileUploaderStub()
  const saveFileStorageStub = makeSaveFileStorageStub()
  const sut = new SaveImage(imageFileUploaderStub, saveFileStorageStub)
  const fileFake = makeFileFake()
  return {
    imageFileUploaderStub,
    sut,
    fileFake,
    saveFileStorageStub
  }
}

describe('SaveImage', () => {
  test('should call ImageFileUploader with SaveFileStorage', async () => {
    const {
      sut,
      imageFileUploaderStub,
      fileFake,
      saveFileStorageStub
    } = makeSut()
    const imageUploadSpy = jest.spyOn(imageFileUploaderStub, 'imageUpload')
    await sut.upload(fileFake)
    expect(imageUploadSpy).toHaveBeenCalledWith(fileFake, saveFileStorageStub)
  })

  test('should throws if ImageFileUploader throws', async () => {
    const { sut, imageFileUploaderStub, fileFake } = makeSut()
    jest
      .spyOn(imageFileUploaderStub, 'imageUpload')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promisse = sut.upload(fileFake)
    await expect(promisse).rejects.toThrow()
  })
})
