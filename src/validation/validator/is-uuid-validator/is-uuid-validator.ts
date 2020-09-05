import { Validator } from '@presentation/protocols'
import { InvalidParamError } from '@presentation/errors'
import { IsUuidValidator } from '@validation/protocols/is-uuid-validator'

export class IsUuidValidatorComposite implements Validator {
  constructor(
    private readonly fieldName: string,
    private readonly isUuidValidator: IsUuidValidator
  ) {}

  isValid(input: any): Error {
    const isValid = this.isUuidValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
