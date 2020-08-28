import { StorageTypeLocalAdapter } from './storage-type-local-adapter'
import fs from 'fs'
import { resolve } from 'path'

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
      const pathImage = resolve('test', 'file', 'file-test-remove.png')
      fs.writeFile(pathImage, 'Test RemoveImage\n', (error) => {
        if (error) throw error
      })
      const { sut } = makeSut()
      await sut.removeImage(pathImage)
      let existFile = false
      fs.stat(pathImage, function (error, stat) {
        if (error == null) {
          existFile = true
        }
      })
      expect(existFile).toBeFalsy()
    })

    test('should file only if it exists', async () => {
      const pathImage = resolve('test', 'file', 'file-not-exist.png')
      const { sut } = makeSut()
      await sut.removeImage(pathImage)
      let existFile = false
      fs.stat(pathImage, function (error, stat) {
        if (error == null) {
          existFile = true
        }
      })
      expect(existFile).toBeFalsy()
    })
  })
})
