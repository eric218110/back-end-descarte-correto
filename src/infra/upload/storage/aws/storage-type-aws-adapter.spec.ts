import { StorageTypeAwsAdapter } from './storage-type-aws-adapter'

type SutTypes = {
  sut: StorageTypeAwsAdapter
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

const makeSut = (): SutTypes => {
  const sut = new StorageTypeAwsAdapter()
  return {
    sut
  }
}

describe('StorageTypeAwsAdapter', () => {
  test('should return url if upload success', async () => {
    const { sut } = makeSut()
    const response = await sut.saveImage(makeFileRequestFake())
    expect(response).toEqual('htt://any_ur.com')
  })
})
