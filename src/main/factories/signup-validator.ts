import { ValidatorComposite } from '../../presentation/helper/validation/validator-composite'
import { RequireFieldValidator } from '../../presentation/helper/validation/required-field-validator'
import { Validator } from '../../presentation/helper/validation/validator'

export const makeSignUpValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validators.push(new RequireFieldValidator(field))
  }
  return new ValidatorComposite(validators)
}
