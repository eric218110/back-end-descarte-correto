import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'

export const addpterRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body
    }
    const { body, statusCode } = await controller.handle(httpRequest)
    if (statusCode === 200) {
      response.status(statusCode).json(body)
    } else {
      response.status(statusCode).json({
        error: body.message
      })
    }
  }
}