export class UploadFileError extends Error {
  constructor () {
    super('Could not save the file')
    this.name = 'UploadFileError'
  }
}
