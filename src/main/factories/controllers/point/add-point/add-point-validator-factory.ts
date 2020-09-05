import {
  ValidatorComposite,
  RequireFieldValidator
} from '@validation/validator'
import { Validator } from '@presentation/protocols'

export const makeAddPointValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of [
    'name',
    'latitude',
    'longitude',
    'city',
    'state',
    'items'
  ]) {
    validators.push(new RequireFieldValidator(field))
  }
  return new ValidatorComposite(validators)
}
