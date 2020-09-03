export class UploadFileError extends Error {
  constructor(messageError: string) {
    super(`Error saving: ${messageError}`)
    this.name = 'UploadFileError'
  }
}
