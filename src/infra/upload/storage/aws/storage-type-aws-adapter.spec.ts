import { StorageTypeAwsAdapter } from './storage-type-aws-adapter'
import { promises } from 'fs'
import { resolve } from 'path'

type SutTypes = {
  sut: StorageTypeAwsAdapter
}

const pathImage = resolve('test', 'file', 'file-test-aws.png')

const makeFileRequestFake = (): {} => ({
  body: {
    pathFile: 'any_path'
  },
  file: {
    destination: resolve('temp', 'uploads'),
    encoding: 'any_encoding',
    fieldname: 'any_fieldname',
    filename: 'file-test-aws.png',
    mimetype: 'image/png',
    originalname: 'file-test-aws.png',
    path: pathImage,
    size: 'any_size',
    stream: 'any_stream'
  }
})

const makeSut = (): SutTypes => {
  const sut = new StorageTypeAwsAdapter({
    AWS_ACCESS_KEY_ID: 'AKIA3S6DZKR6LLEGC5EC',
    AWS_SECRET_ACCESS_KEY: '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',
    AWS_DEFAULT_REGION: 'us-east-1',
    AWS_BUCKET: 'tem-coleta-back-end-test',
    AWS_ACL: 'public-read'
  })
  return {
    sut
  }
}

afterAll(async () => {
  await promises.writeFile(pathImage, ('Test remove file'))
})

describe('StorageTypeAwsAdapter', () => {
  test('should return throws file not exist in request', async () => {
    const { sut } = makeSut()
    const fileUrl = sut.saveImage({
      body: {
        pathFile: 'any_path'
      }
    })
    await expect(fileUrl).rejects.toThrow(TypeError('file is required'))
  })

  test('should return throws request not exist in request', async () => {
    const { sut } = makeSut()
    const fileUrl = sut.saveImage(undefined)
    await expect(fileUrl).rejects.toThrow(TypeError('request is required'))
  })

  test('should return throws path file is invalid', async () => {
    const { sut } = makeSut()
    const fileUrl = sut.saveImage({
      body: {
        pathFile: 'invalid_path'
      },
      file: {
        destination: 'invalid_destination',
        encoding: 'invalid_encoding',
        fieldname: 'invalid_fieldname',
        filename: 'valid_invalid_filename.jpg',
        mimetype: 'invalid_mimetype',
        originalname: 'invalid_originalname',
        path: 'invalid_path',
        size: 'invalid_size',
        stream: 'invalid_stream'
      }
    })
    await expect(fileUrl).rejects.toThrow(TypeError('file path is undefined'))
  })

  test('should return throws if AWS_ACCESS_KEY_ID config incorrect', async () => {
    const sut = new StorageTypeAwsAdapter({
      AWS_ACCESS_KEY_ID: 'invalid_key',
      AWS_SECRET_ACCESS_KEY: '99vhrVY9sSvVN0ktfeIvEzglIpISl6iJZ06F9YdD',
      AWS_DEFAULT_REGION: 'us-east-1',
      AWS_BUCKET: 'tem-coleta-back-end-test',
      AWS_ACL: 'public-read'
    })
    const fileUrl = sut.saveImage(makeFileRequestFake())
    await expect(fileUrl).rejects.toThrow(TypeError('Error - InvalidAccessKeyId'))
  })

  test('should return throws if AWS_SECRET_ACCESS_KEY config incorrect', async () => {
    const sut = new StorageTypeAwsAdapter({
      AWS_ACCESS_KEY_ID: 'AKIA3S6DZKR6LLEGC5EC',
      AWS_SECRET_ACCESS_KEY: 'invalid_access_key',
      AWS_DEFAULT_REGION: 'us-east-1',
      AWS_BUCKET: 'tem-coleta-back-end-test',
      AWS_ACL: 'public-read'
    })
    const fileUrl = sut.saveImage(makeFileRequestFake())
    await expect(fileUrl).rejects.toThrow(TypeError('Error - SignatureDoesNotMatch'))
  })

  test('should return throws if AWS_DEFAULT_REGION config incorrect', async () => {
    const sut = new StorageTypeAwsAdapter({
      AWS_ACCESS_KEY_ID: 'AKIA3S6DZKR6LLEGC5EC',
      AWS_SECRET_ACCESS_KEY: '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',
      AWS_DEFAULT_REGION: 'invalid',
      AWS_BUCKET: 'tem-coleta-back-end-test',
      AWS_ACL: 'public-read'
    })
    const fileUrl = sut.saveImage(makeFileRequestFake())
    await expect(fileUrl).rejects.toThrow(TypeError('Error - UnknownEndpoint'))
  })
})