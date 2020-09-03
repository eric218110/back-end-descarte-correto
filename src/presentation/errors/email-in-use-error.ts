export class EmailInUserError extends Error {
  constructor() {
    super('This received email is already in use')
    this.name = 'EmailInUserError'
  }
}
