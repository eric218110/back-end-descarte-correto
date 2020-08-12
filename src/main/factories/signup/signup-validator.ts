import {
  ValidatorComposite,
  CompareFieldValidator,
  EmailValidatorComposite,
  RequireFieldValidator
} from '../../../presentation/helper/validation/'
import { Validator } from '../../../presentation/protocols/validator'
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter'

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
