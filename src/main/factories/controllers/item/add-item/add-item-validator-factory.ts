import {
  ValidatorComposite,
  RequireFieldValidator
} from '@validation/validator'
import { Validator } from '@presentation/protocols'

export const makeAddItemValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['title', 'color', 'activeColor']) {
    validators.push(new RequireFieldValidator(field))
  }
  return new ValidatorComposite(validators)
}
