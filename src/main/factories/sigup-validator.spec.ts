import { makeSignUpValidator } from './signup-validator'
import { ValidatorComposite } from '../../presentation/helper/validation/validator-composite'
import { RequireFieldValidator } from '../../presentation/helper/validation/required-field-validator'
import { CompareFieldValidator } from '../../presentation/helper/validation/compare-field-validator'
import { EmailValidatorComposite } from '../../presentation/helper/validation/email-validator-composite'
import { EmailValidator } from '../../presentation/protocols/email-validator'

jest.mock('../../presentation/helper/validation/validator-composite')

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
