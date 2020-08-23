import { UploadImageMiddleware } from './upload-image-middleware'
import { UploadImage } from '@domain/usecases/upload/upload-image'
import { serverError } from '../auth/auth-middleware-protocols'

type SutTypes = {
  sut: UploadImageMiddleware
  uploadImageStub: UploadImage
}

const makeFileRequest = (): any => ({
  file: {
    request: 'any_request',
    response: 'any_response'
  }
})

const makeUploadImageStub = (): UploadImage => {
  class UploadImageStub implements UploadImage {
    async upload (file: any): Promise<void> {
      return new Promise(resolve => resolve())
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
    expect(uploadSpy).toHaveBeenCalledWith({
      file: {
        request: 'any_request',
        response: 'any_response'
      }
    })
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
})
