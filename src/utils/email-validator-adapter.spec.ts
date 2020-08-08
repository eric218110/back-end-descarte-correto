import { EmailValidatorAdapter } from './email-validator-adapter'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

const makeSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter()
}

describe('EmailValidatorAdapter', () => {
  test('should return false if email validate return false', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const sut = makeSut()
    const isValid = sut.isValid('invalid@mail.com')
    expect(isValid).toBe(false)
  })

  test('should return true if email validate return true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('invalid@mail.com')
    expect(isValid).toBe(true)
  })
})
