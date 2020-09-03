import { EmailValidatorComposite } from './email-validator-composite'
import { EmailValidator } from '@validation/protocols/email-validator'
import { InvalidParamError } from '@presentation/errors'

const makeEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid(email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

type ISutTypes = {
  emailValidatorStub: EmailValidator
  sut: EmailValidatorComposite
}

const makeSut = (): ISutTypes => {
  const emailValidatorStub = makeEmailValidator()
  const sut = new EmailValidatorComposite('email', emailValidatorStub)
  return {
    sut,
    emailValidatorStub
  }
}

describe('Email Validator Composite', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.isValid({ email: 'any_email@mail.com' })
    expect(error).toEqual(new InvalidParamError('email'))
  })

  test('Should call email validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    sut.isValid({ email: 'any_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 500 is Email Valitador throws', () => {
    const { sut, emailValidatorStub } = makeSut()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.isValid).toThrow()
  })
})
