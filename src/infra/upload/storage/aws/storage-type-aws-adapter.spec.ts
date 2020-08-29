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

beforeEach(async () => {
  await promises.mkdir(resolve('test', 'file'), { recursive: true })
  await promises.writeFile(pathImage, ('Test remove file'))
})

describe('StorageTypeAwsAdapter', () => {
  describe('Upload()', () => {
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

    test('should return throws if AWS config incorrect', async () => {
      const sut = new StorageTypeAwsAdapter({
        AWS_ACCESS_KEY_ID: 'invalid_key',
        AWS_SECRET_ACCESS_KEY: '99vhrVY9sSvVN0ktfeIvEzglIpISl6iJZ06F9YdD',
        AWS_DEFAULT_REGION: 'us-east-1',
        AWS_BUCKET: 'tem-coleta-back-end-test',
        AWS_ACL: 'public-read'
      })
      const fileUrl = sut.saveImage(makeFileRequestFake())
      await expect(fileUrl).rejects.toThrow(TypeError('Error invalid config'))
    })

    test('should return image url if image save in AWS S3', async () => {
      const { sut } = makeSut()
      const fileUrl = await sut.saveImage(makeFileRequestFake())
      const uploadSuccess = fileUrl.indexOf('file-test-aws.png')
      expect(uploadSuccess).toBeTruthy()
    })
  })

  describe('Remove()', () => {
    test('should remove file is success', async () => {
      const { sut } = makeSut()
      let fileExist = await promises.stat(pathImage)
      expect(fileExist).toBeTruthy()
      await sut.removeImage(pathImage)
      fileExist = await promises.stat(pathImage)
      expect(fileExist).toBeTruthy()
    })

    test('should return throws if error config', async () => {
      const sut = new StorageTypeAwsAdapter({
        AWS_ACCESS_KEY_ID: 'invalid_key',
        AWS_SECRET_ACCESS_KEY: '99vhrVY9sSvVN0ktfeIvEzglIpISl6iJZ06F9YdD',
        AWS_DEFAULT_REGION: 'us-east-1',
        AWS_BUCKET: 'tem-coleta-back-end-test',
        AWS_ACL: 'public-read'
      })
      const fileUrl = sut.saveImage(makeFileRequestFake())
      await expect(fileUrl).rejects.toThrow(TypeError('Error invalid config'))
    })
  })
})
