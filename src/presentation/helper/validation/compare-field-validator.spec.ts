import { CompareFieldValidator } from './compare-field-validator'
import { InvalidParamError } from '../../errors'

const makeSut = (): CompareFieldValidator => {
  return new CompareFieldValidator('any_field', 'any_field_to_compare')
}

describe('RequiredFieldValidation', () => {
  test('should return a InvalidParamError if validation fails', () => {
    const sut = makeSut()
    const isError = sut.isValid({
      any_field: 'any_field',
      any_field_to_compare: 'invalid_field'
    })
    expect(isError).toEqual(new InvalidParamError('any_field_to_compare'))
  })

  test('should not return a InvalidParamError success', () => {
    const sut = makeSut()
    const isError = sut.isValid({
      any_field: 'any_field',
      any_field_to_compare: 'any_field'
    })
    expect(isError).toBeFalsy()
  })
})
