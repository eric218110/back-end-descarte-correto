export interface Validator {
  isValid: (input: any) => Error
}
