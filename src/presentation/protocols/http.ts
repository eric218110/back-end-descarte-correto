type FileRequest = {
  request: any
  response: any
}

export type HttpResponse = {
  statusCode: number
  body: any
}

export type HttpRequest = {
  body?: any
  headers?: any
  file?: FileRequest
}
