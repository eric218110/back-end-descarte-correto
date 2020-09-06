import {
  ValidatorComposite,
  IsUuidValidatorComposite
} from '@validation/validator'
import { Validator } from '@presentation/protocols'
import { IsUuidValidatorAdapter } from '@infra/validator/uuid-validator/is-uuid-validator-adapter'

export const makeLoadPointByIdValidator = (): ValidatorComposite => {
  const validators: Validator[] = []
  validators.push(
    new IsUuidValidatorComposite('id', new IsUuidValidatorAdapter())
  )
  return new ValidatorComposite(validators)
}
