export class UnauthorizedError extends Error {
  constructor() {
    super('not authorized')
    this.name = 'UnauthorizedError'
  }
}
