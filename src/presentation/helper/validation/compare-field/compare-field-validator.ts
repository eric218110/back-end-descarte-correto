import { Validator } from '../../../protocols/validator'
import { InvalidParamError } from '../../../errors'

export class CompareFieldValidator implements Validator {
  constructor (
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}

  isValid (input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName)
    }
  }
}
