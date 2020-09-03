export class TitleAlreadyExistError extends Error {
  constructor() {
    super('Field title already exist')
    this.name = 'TitleAlreadyExistError'
  }
}
