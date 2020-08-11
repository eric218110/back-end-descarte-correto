import { makeSignUpValidator } from './signup-validator'
import { ValidatorComposite } from '../../presentation/helper/validation/validator-composite'
import { RequireFieldValidator } from '../../presentation/helper/validation/required-field-validator'

jest.mock('../../presentation/helper/validation/validator-composite')

describe('Validator Factory', () => {
  test('should call ValidationComposite with all validations', () => {
    makeSignUpValidator()
    expect(ValidatorComposite).toHaveBeenCalledWith([
      new RequireFieldValidator('name'),
      new RequireFieldValidator('email'),
      new RequireFieldValidator('password'),
      new RequireFieldValidator('passwordConfirmation')
    ])
  })
})
