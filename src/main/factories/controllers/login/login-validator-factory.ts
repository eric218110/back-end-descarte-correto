import {
  RequireFieldValidator,
  EmailValidatorComposite,
  ValidatorComposite
} from '../../../../validation/validator'
import { Validator } from '../../../../presentation/protocols'
import { EmailValidatorAdapter } from '../../../../infra/validator/email-validator-adapter'

export const makeLoginValidator = (): ValidatorComposite => {
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const validators: Validator[] = []
  for (const field of ['email', 'password']) {
    validators.push(new RequireFieldValidator(field))
  }
  validators.push(new EmailValidatorComposite('email', emailValidatorAdapter))
  return new ValidatorComposite(validators)
}
