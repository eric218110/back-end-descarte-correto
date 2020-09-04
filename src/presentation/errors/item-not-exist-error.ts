export class ItemNotExistError extends Error {
  constructor() {
    super('One or more items does not exist')
    this.name = 'ItemNotExistError'
  }
}
