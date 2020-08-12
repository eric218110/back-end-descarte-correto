import { Validator } from '../../protocols/validator'
import { MissingParamsError } from '../../errors'

export class RequireFieldValidator implements Validator {
  constructor (
    private readonly fieldName: string
  ) {}

  isValid (input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamsError(this.fieldName)
    }
  }
}
