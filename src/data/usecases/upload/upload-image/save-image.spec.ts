import { SaveImage } from './save-image'
import { ImageFileUploader, FileProps } from './save-image-protocols'
import { Encrypter } from '@data/protocols/criptography/encrypter'

type SutTypes = {
  encrypterStub: Encrypter
  imageFileUploaderStub: ImageFileUploader
  sut: SaveImage
  fileFake: FileProps
}

const makeFileFake = (): FileProps => ({
  request: {
    file: { originalname: 'any_name.jpg' }
  },
  response: 'any_response'
})

const makeEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('hashed_name'))
    }
  }
  return new EncrypterStub()
}

const makeImageFileUploaderStub = (): ImageFileUploader => {
  class ImageFileUploaderStub implements ImageFileUploader {
    async imageUpload (fileImage: FileProps): Promise<string> {
      return new Promise(resolve => resolve('https://url_any_image.com'))
    }
  }
  return new ImageFileUploaderStub()
}

const makeSut = (): SutTypes => {
  const encrypterStub = makeEncrypter()
  const imageFileUploaderStub = makeImageFileUploaderStub()
  const sut = new SaveImage(imageFileUploaderStub, encrypterStub)
  const fileFake = makeFileFake()
  return {
    encrypterStub,
    imageFileUploaderStub,
    sut,
    fileFake
  }
}

describe('SaveImage', () => {
  test('should call encrypt with correct password', async () => {
    const { sut, encrypterStub, fileFake } = makeSut()
    const encryptSpy = jest.spyOn(encrypterStub, 'encrypt')
    await sut.upload(fileFake)
    expect(encryptSpy).toHaveBeenCalledWith('any_name.jpg')
  })

  test('should call ImageFileUploader with correct values', async () => {
    const { sut, imageFileUploaderStub, fileFake } = makeSut()
    const imageUploadSpy = jest.spyOn(imageFileUploaderStub, 'imageUpload')
    await sut.upload(fileFake)
    expect(imageUploadSpy).toHaveBeenCalledWith(fileFake, 'hashed_name' + '.jpg')
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
