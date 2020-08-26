import { StorageTypeLocalAdapter } from './storage-type-local-adapter'

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
  test('should return url file correct', async () => {
    const { sut } = makeSut()
    const fileUrl = await sut.saveFile(makeFileRequestFake())
    expect(fileUrl).toEqual('http://localhost:1995/files/valid_any_filename.jpg')
  })
})
