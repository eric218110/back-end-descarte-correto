import { RequireFieldValidator } from './required-field-validator'
import { MissingParamsError } from '../../errors'

describe('RequiredFieldValidation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = new RequireFieldValidator('any_field')
    const isError = sut.isValid({ name: 'invalid_name' })
    expect(isError).toEqual(new MissingParamsError('any_field'))
  })

  test('should not return a MissingParamError success', () => {
    const sut = new RequireFieldValidator('any_field')
    const isError = sut.isValid({ any_field: 'any_field_name' })
    expect(isError).toBeFalsy()
  })
})
