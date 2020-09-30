import {
  ValidatorComposite,
  RequireFieldValidator,
  IsUuidValidatorComposite
} from '@validation/validator'
import { Validator } from '@presentation/protocols'
import { IsUuidValidatorAdapter } from '@infra/validator/uuid-validator/is-uuid-validator-adapter'

export const makeAddPointValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of [
    'name',
    'latitude',
    'longitude',
    'city',
    'state',
    'items',
    'neighborhood',
    'reference',
    'street',
    'zipCode'
  ]) {
    validators.push(new RequireFieldValidator(field))
    validators.push(
      new IsUuidValidatorComposite('accountId', new IsUuidValidatorAdapter())
    )
  }
  return new ValidatorComposite(validators)
}
