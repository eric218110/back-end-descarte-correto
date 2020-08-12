import { ValidatorComposite } from '../../../presentation/helper/validation/validator-composite'
import { RequireFieldValidator } from '../../../presentation/helper/validation/required-field-validator'
import { Validator } from '../../../presentation/helper/validation/validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'
import { EmailValidatorComposite } from '../../../presentation/helper/validation/email-validator-composite'

export const makeLoginValidator = (): ValidatorComposite => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const validators: Validator[] = []
  for (const field of ['email', 'password']) {
    validators.push(new RequireFieldValidator(field))
  }
  validators.push(new EmailValidatorComposite('email', emailValidatorAdapter))
  return new ValidatorComposite(validators)
}
