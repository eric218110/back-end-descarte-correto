import { UploadImageMiddleware } from './upload-image-middleware'
import { UploadImage } from '@domain/usecases/upload/upload-image'
import { serverError, badRequest } from '../auth/auth-middleware-protocols'
import { UploadFileError } from '@presentation/errors/upload-file-error'

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

  test('should return 400 if UploadImage return false', async () => {
    const { sut, uploadImageStub } = makeSut()
    jest.spyOn(uploadImageStub, 'upload')
      .mockReturnValueOnce(new Promise(resolve => resolve(null)))
    const fakeRequest = {
      file: makeFileRequest()
    }
    const httpResponse = await sut.handle(fakeRequest)
    expect(httpResponse).toEqual(badRequest(new UploadFileError()))
  })

  test('should return image url if UploadImage success', async () => {
    const { sut } = makeSut()
    const fakeRequest = {
      file: makeFileRequest()
    }
    const response = await sut.handle(fakeRequest)
    expect(response.body.imageUrl).toEqual('https://url_any_image.com')
  })

  test('should return status code 200 if UploadImage success', async () => {
    const { sut } = makeSut()
    const fakeRequest = {
      file: makeFileRequest()
    }
    const response = await sut.handle(fakeRequest)
    expect(response.statusCode).toBe(200)
  })
})
