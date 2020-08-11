import { Validator } from './validator'

export class ValidatorComposite implements Validator {
  constructor (
    private readonly validators: Validator[]
  ) {}

  isValid (input: any): Error {
    for (const validator of this.validators) {
      const isError = validator.isValid(input)
      if (isError) {
        return isError
      }
    }
  }
}
