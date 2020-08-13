import {
  ValidatorComposite,
  EmailValidatorComposite,
  RequireFieldValidator
} from '../../../presentation/helper/validation'
import { makeLoginValidator } from './login-validator-factory'
import { EmailValidator } from '../../../presentation/protocols/email-validator'

jest.mock('../../../presentation/helper/validation/validator-composite/validator-composite')

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
    makeLoginValidator()
    expect(ValidatorComposite).toHaveBeenCalledWith([
      new RequireFieldValidator('email'),
      new RequireFieldValidator('password'),
      new EmailValidatorComposite('email', emailValidatorStub)
    ])
  })
})
