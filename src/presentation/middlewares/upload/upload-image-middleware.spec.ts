import { UploadImageMiddleware } from './upload-image-middleware'
import { UploadImage } from '@domain/usecases/upload/upload-image'
import { serverError } from '../auth/auth-middleware-protocols'

type SutTypes = {
  sut: UploadImageMiddleware
  uploadImageStub: UploadImage
}

const makeFileRequest = (): any => ({
  fieldname: 'any_fieldname',
  originalname: 'any_originalname',
  encoding: 'any_encoding',
  mimetype: 'any/any_mimetype',
  destination: 'any/destination',
  filename: 'any_file_name',
  path: 'any/any_path',
  size: 1111
})

const makeUploadImageStub = (): UploadImage => {
  class UploadImageStub implements UploadImage {
    async upload (file: any): Promise<string> {
      return new Promise(resolve => resolve('https://url_any_image.com'))
    }
  }
  return new UploadImageStub()
}

const makeSut = (): SutTypes => {
  const uploadImageStub = makeUploadImageStub()
  const sut = new UploadImageMiddleware(uploadImageStub)
  return {
    sut,
    uploadImageStub
  }
}

describe('UploadImageMiddleware', () => {
  test('should call UploadImage with values correct', async () => {
    const { sut, uploadImageStub } = makeSut()
    const uploadSpy = jest.spyOn(uploadImageStub, 'upload')
    const fakeRequest = {
      file: makeFileRequest()
    }
    await sut.handle(fakeRequest)
    expect(uploadSpy).toHaveBeenCalledWith(makeFileRequest())
  })

  test('should return 500 if UploadImage throws', async () => {
    const { sut, uploadImageStub } = makeSut()
    jest.spyOn(uploadImageStub, 'upload')
      .mockImplementationOnce(async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      })
    const fakeRequest = {
      file: makeFileRequest()
    }
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(serverError(new Error()))
  })

  test('should return image url if UploadImage success', async () => {
    const { sut } = makeSut()
    const fakeRequest = {
      file: makeFileRequest()
    }
    const response = await sut.handle(fakeRequest)
    expect(response.body.imageUrl).toEqual('https://url_any_image.com')
  })
})
