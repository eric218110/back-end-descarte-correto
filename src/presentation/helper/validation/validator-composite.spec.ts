import { ValidatorComposite } from './validator-composite'
import { MissingParamsError } from '../../errors'
import { Validator } from './validator'

const makeValidatorStub = (): Validator => {
  class ValidatorStub implements Validator {
    isValid (input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}

interface SutTypes {
  sut: ValidatorComposite
  validatorStub: Validator
}

const makeSut = (): SutTypes => {
  const validatorStub = makeValidatorStub()
  const sut = new ValidatorComposite([
    validatorStub
  ])

  return {
    sut,
    validatorStub
  }
}

describe('ValidatorComposite', () => {
  test('should return an error if any validation fails', () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'isValid')
      .mockImplementationOnce(() => {
        return new MissingParamsError('any_field')
      })
    const error = sut.isValid({ field: 'any_field' })
    expect(error).toEqual(new MissingParamsError('any_field'))
  })
})
