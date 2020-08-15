import { ValidatorComposite } from './validator-composite'
import { MissingParamsError } from '@presentation/errors'
import { Validator } from '@presentation/protocols/validator'

const makeValidator = (): Validator => {
  class ValidatorStub implements Validator {
    isValid (input: any): Error {
      return null
    }
  }
  return new ValidatorStub()
}

type SutTypes = {
  sut: ValidatorComposite
  validatorStubs: Validator[]
}

const makeSut = (): SutTypes => {
  const validatorStubs = [makeValidator(), makeValidator()]
  const sut = new ValidatorComposite(validatorStubs)

  return {
    sut,
    validatorStubs
  }
}

describe('ValidatorComposite', () => {
  test('Should return an error if any validation fails', () => {
    const { sut, validatorStubs } = makeSut()
    jest.spyOn(validatorStubs[0], 'isValid').mockReturnValueOnce(new MissingParamsError('any_field'))
    const error = sut.isValid({ field: 'any_field' })
    expect(error).toEqual(new MissingParamsError('any_field'))
  })

  test('Should return the first error if more the one any validation fails', () => {
    const { sut, validatorStubs } = makeSut()
    jest.spyOn(validatorStubs[0], 'isValid').mockReturnValueOnce(new Error())
    jest.spyOn(validatorStubs[1], 'isValid').mockReturnValueOnce(new MissingParamsError('any_field'))
    const error = sut.isValid({ field: 'any_field' })
    expect(error).toEqual(new Error())
  })

  test('Should not return if validation sucess', () => {
    const { sut } = makeSut()
    const error = sut.isValid({ field: 'any_field' })
    expect(error).toBeFalsy()
  })
})
