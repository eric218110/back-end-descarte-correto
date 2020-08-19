export class AccessDeniedError extends Error {
  constructor () {
    super('This received email is already in use')
    this.name = 'Forbidden'
  }
}
