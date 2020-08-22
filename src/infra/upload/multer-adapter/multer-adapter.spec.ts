import multer from 'multer'
import { MulterAdapter } from './multer-adapter'

type SutTypes = {
  sut: MulterAdapter
}

const makeSut = (): SutTypes => {
  const sut = new MulterAdapter()
  return { sut }
}

describe('MulterAdapter', () => {
  test('should return an image url if upload image success', async () => {
    const { sut } = makeSut()
    const response = await sut.imageUpload({
      request: 'any_request',
      response: 'any_response'
    },
    'any_name_image'
    )
    multer().single('file')
    expect(response).toBe('http://image_url.com')
  })
})
