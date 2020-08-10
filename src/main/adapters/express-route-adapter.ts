import { Controller, HttpRequest } from '../../presentation/protocols'
import { Request, Response } from 'express'

export const addpterRoute = (controller: Controller) => {
  return async (request: Request, response: Response) => {
    const httpRequest: HttpRequest = {
      body: request.body
    }
    const { body, statusCode } = await controller.handle(httpRequest)
    response.status(statusCode).json(body)
  }
}
