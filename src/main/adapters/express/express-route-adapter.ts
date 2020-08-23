import { Controller, HttpRequest } from '@presentation/protocols'
import { Request, Response } from 'express'

export const addpterRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    if (request.file) {

    }
    const httpRequest: HttpRequest = {
      body: request.body,
      headers: request.headers,
      file: (request.file) ? {
        request: request.file,
        response: null
      }
        : {
          request: null,
          response: null
        }
    }
    const { body, statusCode } = await controller.handle(httpRequest)
    if (statusCode >= 200 && statusCode <= 299) {
      response.status(statusCode).json(body)
    } else {
      response.status(statusCode).json({
        error: body.message
      })
    }
  }
}
