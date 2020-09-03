import { Validator } from '@presentation/protocols'
import { InvalidParamError } from '@presentation/errors'
import { EmailValidator } from '@validation/protocols/email-validator'

export class EmailValidatorComposite implements Validator {
  constructor(
    private readonly fieldName: string,
    private readonly emailValidator: EmailValidator
  ) {}

  isValid(input: any): Error {
    const isValid = this.emailValidator.isValid(input[this.fieldName])
    if (!isValid) {
      return new InvalidParamError(this.fieldName)
    }
  }
}
