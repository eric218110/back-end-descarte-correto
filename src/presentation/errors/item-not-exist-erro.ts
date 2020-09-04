export class TitleNotExistError extends Error {
  constructor() {
    super('One or more items does not exist')
    this.name = 'TitleNotExistError'
  }
}
