import {
  ValidatorComposite,
  EmailValidatorComposite,
  RequireFieldValidator
} from '@validation/validator'
import { makeLoginValidator } from './login-validator-factory'
import { EmailValidator } from '@validation/protocols/email-validator'

jest.mock('@validation/validator/validator-composite/validator-composite')

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

describe('Validator Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    const emailValidatorStub = makeEmailValidator()
    makeLoginValidator()
    expect(ValidatorComposite).toHaveBeenCalledWith([
      new RequireFieldValidator('email'),
      new RequireFieldValidator('password'),
      new EmailValidatorComposite('email', emailValidatorStub)
    ])
  })
})
