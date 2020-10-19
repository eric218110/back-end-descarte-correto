import { MulterHelper } from './multer-helper'

describe('MulterAdapter', () => {
  test('should MulterHelper generate filename correct', () => {
    const generateFileName = MulterHelper.generateFileName('any_file_name')
    expect(generateFileName.match(/any_file_name/)).toBeTruthy()
  })
})
