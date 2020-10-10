import {
  ValidatorComposite,
  RequireFieldValidator,
  IsUuidValidatorComposite
} from '@validation/validator'
import { Validator } from '@presentation/protocols'
import { IsUuidValidatorAdapter } from '@infra/validator/uuid-validator/is-uuid-validator-adapter'

export const makeFilterPointValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  for (const field of ['items']) {
    validators.push(new RequireFieldValidator(field))
    validators.push(
      new IsUuidValidatorComposite('items', new IsUuidValidatorAdapter())
    )
  }
  return new ValidatorComposite(validators)
}
