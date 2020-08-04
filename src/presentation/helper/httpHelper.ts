import { IHttpResponse } from '../protocols/IHttp'
import { ServerError } from '../errors/ServerError'

export const badRequest = (error: Error): IHttpResponse => (
  {
    statusCode: 400,
    body: error
  })

export const serverError = (): IHttpResponse => (
  {
    statusCode: 500,
    body: new ServerError()
  }
)
