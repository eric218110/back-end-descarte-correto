import { SaveImage } from './save-image'
import { ImageFileUploader } from '@data/protocols/upload/image-file-uploader'

type FileImageUpload = {
  fieldname: string
  originalname: string
  encoding: string
  mimetype: string
  destination: string
  filename: string
  path: string
  size: number
}

type SutTypes = {
  imageFileUploaderStub: ImageFileUploader
  sut: SaveImage
  fileFake: FileImageUpload
}

const makeFileFake = (): FileImageUpload => ({
  fieldname: 'any_fieldname',
  originalname: 'any_originalname',
  encoding: 'any_encoding',
  mimetype: 'any/any_mimetype',
  destination: 'any/destination',
  filename: 'any_file_name',
  path: 'any/any_path',
  size: 1111
})

const makeImageFileUploaderStub = (): ImageFileUploader => {
  class ImageFileUploaderStub implements ImageFileUploader {
    async imageUpload (fileImage: any): Promise<string> {
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
})
