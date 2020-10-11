import {
  ValidatorComposite,
  RequireFieldValidator
} from '@validation/validator'
import { Validator } from '@presentation/protocols'

export const makeFilterPointValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['items']) {
    validators.push(new RequireFieldValidator(field))
  }
  return new ValidatorComposite(validators)
}
