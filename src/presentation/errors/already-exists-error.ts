export class AlreadyExistError extends Error {
  constructor (value: string) {
    super(`The informed value already exists: ${value}`)
    this.name = 'AlreadyExistError'
  }
}
