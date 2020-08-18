import { HttpResponse } from '@presentation/protocols/http'
import { ServerError } from '@presentation/errors'
import { UnauthorizedError } from '@presentation/errors/unauthorized-error'

export const badRequest = (error: Error): HttpResponse => (
  {
    statusCode: 400,
    body: error
  })

export const forbidden = (error: Error): HttpResponse => (
  {
    statusCode: 403,
    body: error
  })

export const serverError = (error: Error): HttpResponse => (
  {
    statusCode: 500,
    body: new ServerError(error.stack)
  }
)

export const ok = (data: any): HttpResponse => (
  {
    statusCode: 200,
    body: data
  }
)

export const onCreated = (data: any): HttpResponse => (
  {
    statusCode: 201,
    body: data
  }
)

export const noContent = (): HttpResponse => (
  {
    statusCode: 204,
    body: null
  }
)

export const unauthorizedError = (): HttpResponse => (
  {
    statusCode: 401,
    body: new UnauthorizedError()
  }
)
