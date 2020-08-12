import {
  RequireFieldValidator,
  EmailValidatorComposite,
  ValidatorComposite
} from '../../../presentation/helper/validation'
import { Validator } from '../../../presentation/protocols/validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

export const makeLoginValidator = (): ValidatorComposite => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const validators: Validator[] = []
  for (const field of ['email', 'password']) {
    validators.push(new RequireFieldValidator(field))
  }
  validators.push(new EmailValidatorComposite('email', emailValidatorAdapter))
  return new ValidatorComposite(validators)
}