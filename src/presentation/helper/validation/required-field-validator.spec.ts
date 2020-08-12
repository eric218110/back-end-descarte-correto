import { RequireFieldValidator } from './required-field-validator'
import { MissingParamsError } from '../../errors'

describe('RequiredFieldValidation', () => {
  test('should return a MissingParamError if validation fails', () => {
    const sut = new RequireFieldValidator('any_field')
    const isError = sut.isValid({ name: 'invalid_name' })
    expect(isError).toEqual(new MissingParamsError('any_field'))
  })
})
