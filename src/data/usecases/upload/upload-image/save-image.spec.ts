import { SaveImage } from './save-image'
import { ImageFileUploader } from '@data/protocols/upload/image-file-uploader'
import { FileProps } from '@domain/usecases/upload/upload-image'

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
    async imageUpload (fileImage: FileProps): Promise<string> {
      return new Promise(resolve => resolve('https://url_any_image.com'))
    }
  }
  return new ImageFileUploaderStub()
}

const makeSut = (): SutTypes => {
  const imageFileUploaderStub = makeImageFileUploaderStub()
  const sut = new SaveImage(imageFileUploaderStub)
  const fileFake = makeFileFake()
  return {
    imageFileUploaderStub,
    sut,
    fileFake
  }
}

describe('SaveImage', () => {
  test('should call ImageFileUploader with correct values', async () => {
    const { sut, imageFileUploaderStub, fileFake } = makeSut()
    const imageUploadSpy = jest.spyOn(imageFileUploaderStub, 'imageUpload')
    await sut.upload(fileFake)
    expect(imageUploadSpy).toHaveBeenCalledWith(fileFake)
  })

  test('should return null if ImageFileUploader return null', async () => {
    const { sut, imageFileUploaderStub, fileFake } = makeSut()
    jest.spyOn(imageFileUploaderStub, 'imageUpload')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const imageUrl = await sut.upload(fileFake)
    expect(imageUrl).toBeNull()
  })

  test('should throws if ImageFileUploader throws', async () => {
    const { sut, imageFileUploaderStub, fileFake } = makeSut()
    jest.spyOn(imageFileUploaderStub, 'imageUpload')
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      )
    const promisse = sut.upload(fileFake)
    await expect(promisse).rejects.toThrow()
  })

  test('should return an image url if ImageFileUploader on sucess', async () => {
    const { sut, fileFake } = makeSut()
    const imageUrl = await sut.upload(fileFake)
    expect(imageUrl).toEqual('https://url_any_image.com')
  })
})
