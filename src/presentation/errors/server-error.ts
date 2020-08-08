export class ServerError extends Error {
  constructor () {
    super('Error internal')
    this.name = 'ServerError'
  }
}
