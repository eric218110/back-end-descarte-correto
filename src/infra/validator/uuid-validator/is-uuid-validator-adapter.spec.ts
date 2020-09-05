import { IsUuidValidatorAdapter } from './is-uuid-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isUUID(): boolean {
    return true
  }
}))

const makeSut = (): IsUuidValidatorAdapter => {
  return new IsUuidValidatorAdapter()
}

describe('IsUuidValidatorAdapter', () => {
  test('should return false if uuid validate return false', () => {
    jest.spyOn(validator, 'isUUID').mockReturnValueOnce(false)
    const sut = makeSut()
    const isValid = sut.isValid('invalid uuid')
    expect(isValid).toBe(false)
  })

  test('should return true if is uuid validate return true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('any_uuid')
    expect(isValid).toBe(true)
  })
})
