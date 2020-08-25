import { SaveImage } from './save-image'
import { ImageFileUploader, FileProps } from './save-image-protocols'

type SutTypes = {
  imageFileUploaderStub: ImageFileUploader
  sut: SaveImage
  fileFake: FileProps
}

const makeFileFake = (): FileProps => ({
  request: 'any_request',
  response: 'any_response'
})

const makeImageFileUploaderStub = (): ImageFileUploader => {
  class ImageFileUploaderStub implements ImageFileUploader {
    async imageUpload (fileImage: FileProps, storageType: 'LOCAL' | 'ONLINE'): Promise<void> {
      return new Promise(resolve => resolve())
    }
  }
  return new ImageFileUploaderStub()
}

const makeSut = (env: 'LOCAL' | 'ONLINE'): SutTypes => {
  const imageFileUploaderStub = makeImageFileUploaderStub()
  const sut = new SaveImage(imageFileUploaderStub, env)
  const fileFake = makeFileFake()
  return {
    imageFileUploaderStub,
    sut,
    fileFake
  }
}

describe('SaveImage', () => {
  test('should call ImageFileUploader with correct values in mode development', async () => {
    const { sut, imageFileUploaderStub, fileFake } = makeSut('LOCAL')
    const imageUploadSpy = jest.spyOn(imageFileUploaderStub, 'imageUpload')
    await sut.upload(fileFake)
    expect(imageUploadSpy).toHaveBeenCalledWith(fileFake, 'LOCAL')
  })

  test('should call ImageFileUploader with correct values in online development', async () => {
    const { sut, imageFileUploaderStub, fileFake } = makeSut('ONLINE')
    const imageUploadSpy = jest.spyOn(imageFileUploaderStub, 'imageUpload')
    await sut.upload(fileFake)
    expect(imageUploadSpy).toHaveBeenCalledWith(fileFake, 'ONLINE')
  })

  test('should throws if ImageFileUploader throws', async () => {
    const { sut, imageFileUploaderStub, fileFake } = makeSut('LOCAL')
    jest.spyOn(imageFileUploaderStub, 'imageUpload')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promisse = sut.upload(fileFake)
    await expect(promisse).rejects.toThrow()
  })
})
