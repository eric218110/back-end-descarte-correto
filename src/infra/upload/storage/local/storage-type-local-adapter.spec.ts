import { StorageTypeLocalAdapter } from './storage-type-local-adapter'
import { resolve } from 'path'
import { promises } from 'fs'

export type SutTypes = {
  sut: StorageTypeLocalAdapter
}

const makeSut = (): SutTypes => {
  const pathFiles = 'http://localhost:1995/files/'
  const sut = new StorageTypeLocalAdapter(pathFiles)
  return {
    sut
  }
}

const makeFileRequestFake = (): {} => ({
  body: {
    pathFile: 'any_path'
  },
  file: {
    destination: 'any_destination',
    encoding: 'any_encoding',
    fieldname: 'any_fieldname',
    filename: 'valid_any_filename.jpg',
    mimetype: 'any_mimetype',
    originalname: 'any_originalname',
    path: 'any_path',
    size: 'any_size',
    stream: 'any_stream'
  }
})

beforeAll(async () => {
  await promises.mkdir(resolve('__test__', 'file'), { recursive: true })
  const pathImage = resolve('__test__', 'file', 'file-test-remove.png')
  await promises.writeFile(pathImage, ('Test remove file'))
})

describe('StorageTypeLocalAdapter', () => {
  describe('SaveImage', () => {
    test('should return url file correct', async () => {
      const { sut } = makeSut()
      const fileUrl = await sut.saveImage(makeFileRequestFake())
      expect(fileUrl).toEqual('http://localhost:1995/files/valid_any_filename.jpg')
    })

    test('should return throws type error if request is undefined', async () => {
      const { sut } = makeSut()
      const fakeRequestInvalid = undefined
      const fileUrl = sut.saveImage(fakeRequestInvalid)
      await expect(fileUrl).rejects.toThrow(TypeError('request is required'))
    })

    test('should return throws type error if file in request is undefined', async () => {
      const { sut } = makeSut()
      const fakeRequestInvalid = {
        file: undefined
      }
      const fileUrl = sut.saveImage(fakeRequestInvalid)
      await expect(fileUrl).rejects.toThrow(TypeError('file is required'))
    })

    test('should return throws type error if filename is undefined', async () => {
      const { sut } = makeSut()
      const fakeRequestInvalid = {
        file: {
          destination: 'any_destination',
          encoding: 'any_encoding',
          fieldname: 'any_fieldname',
          filename: undefined,
          mimetype: 'any_mimetype',
          originalname: 'any_originalname',
          path: 'any_path',
          size: 'any_size',
          stream: 'any_stream'
        }
      }
      const fileUrl = sut.saveImage(fakeRequestInvalid)
      await expect(fileUrl).rejects.toThrow(TypeError('field filename is required'))
    })
  })

  describe('RemoveImage', () => {
    test('should remove file is success', async () => {
      const { sut } = makeSut()
      const pathImage = resolve('__test__', 'file', 'file-test-remove.png')
      const fileExist = await promises.stat(pathImage)
      expect(fileExist).toBeTruthy()
      await sut.removeImage(pathImage)
    })

    test('should throws if file not exist', async () => {
      const { sut } = makeSut()
      const pathImage = resolve('__test__', 'file', 'file-not-exist.png')
      const remove = sut.removeImage(pathImage)
      await expect(remove).rejects.toThrow(TypeError('Not remove file'))
    })
  })
})
