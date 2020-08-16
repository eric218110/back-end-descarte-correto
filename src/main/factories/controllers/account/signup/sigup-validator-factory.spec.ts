import {
  ValidatorComposite,
  RequireFieldValidator,
  CompareFieldValidator,
  EmailValidatorComposite
} from '@validation/validator'
import { makeSignUpValidator } from './signup-validator-factory'
import { EmailValidator } from '@validation/protocols/email-validator'

jest.mock('@validation/validator/validator-composite/validator-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator { // MOCK TYPE STUB
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Validator Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    const emailValidatorStub = makeEmailValidator()
    makeSignUpValidator()
    expect(ValidatorComposite).toHaveBeenCalledWith([
      new RequireFieldValidator('name'),
      new RequireFieldValidator('email'),
      new RequireFieldValidator('password'),
      new RequireFieldValidator('passwordConfirmation'),
      new CompareFieldValidator('password', 'passwordConfirmation'),
      new EmailValidatorComposite('email', emailValidatorStub)
    ])
  })
})
