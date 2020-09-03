export class ServerError extends Error {
  constructor(private readonly stackError: string) {
    super('Error internal')
    this.name = 'ServerError'
    this.stack = stackError
  }
}
