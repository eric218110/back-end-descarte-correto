import { ValidatorComposite } from '../../../presentation/helper/validation/validator-composite'
import { RequireFieldValidator } from '../../../presentation/helper/validation/required-field-validator'
import { CompareFieldValidator } from '../../../presentation/helper/validation/compare-field-validator'
import { Validator } from '../../../presentation/protocols/validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { EmailValidatorComposite } from '../../../presentation/helper/validation/email-validator-composite'

export const makeSignUpValidator = (): ValidatorComposite => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const validators: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequireFieldValidator(field))
  }
  validators.push(new CompareFieldValidator('password', 'passwordConfirmation'))
  validators.push(new EmailValidatorComposite('email', emailValidatorAdapter))
  return new ValidatorComposite(validators)
}
