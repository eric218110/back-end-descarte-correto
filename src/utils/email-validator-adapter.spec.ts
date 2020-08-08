import { EmailValidatorAdapter } from './email-validator'
import validator from 'validator'

jest.mock('validator', () => ({
  isEmail (): boolean {
    return true
  }
}))

describe('EmailValidatorAdapter', () => {
  test('should return false if email validate return false', () => {
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false)
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid@mail.com')
    expect(isValid).toBe(false)
  })

  test('should return true if email validate return true', () => {
    const sut = new EmailValidatorAdapter()
    const isValid = sut.isValid('invalid@mail.com')
    expect(isValid).toBe(true)
  })
})
