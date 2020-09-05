import { IsUuidValidatorComposite } from './is-uuid-validator'
import { IsUuidValidator } from '@validation/protocols/is-uuid-validator'
import { InvalidParamError } from '@presentation/errors'

const makeIsUuidValidator = (): IsUuidValidator => {
  class IsUuidValidatorStub implements IsUuidValidator {
    isValid(accountId: string): boolean {
      return true
    }
  }
  return new IsUuidValidatorStub()
}

type ISutTypes = {
  isUuidValidatorStub: IsUuidValidator
  sut: IsUuidValidatorComposite
}

const makeSut = (): ISutTypes => {
  const isUuidValidatorStub = makeIsUuidValidator()
  const sut = new IsUuidValidatorComposite('accountId', isUuidValidatorStub)
  return {
    sut,
    isUuidValidatorStub
  }
}

describe('UUID Validator Composite', () => {
  test('Should return an error if UuidValidator returns false', () => {
    const { sut, isUuidValidatorStub } = makeSut()
    jest.spyOn(isUuidValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.isValid({ accountId: 'any_account_id' })
    expect(error).toEqual(new InvalidParamError('accountId'))
  })

  test('Should call uuid validator with correct accountId', () => {
    const { sut, isUuidValidatorStub } = makeSut()
    const isValidSpy = jest.spyOn(isUuidValidatorStub, 'isValid')
    sut.isValid({ accountId: 'any_account_id' })
    expect(isValidSpy).toHaveBeenCalledWith('any_account_id')
  })

  test('Should return 500 is Uuid Valitador throws', () => {
    const { sut, isUuidValidatorStub } = makeSut()
    jest.spyOn(isUuidValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(sut.isValid).toThrow()
  })
})
