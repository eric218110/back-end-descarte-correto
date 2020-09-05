import { IsUuidValidator } from '@validation/protocols/is-uuid-validator'
import validator from 'validator'

export class IsUuidValidatorAdapter implements IsUuidValidator {
  isValid(uuid: string): boolean {
    return validator.isUUID(uuid)
  }
}
