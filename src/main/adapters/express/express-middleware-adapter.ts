import { Middleware, HttpRequest } from '@presentation/protocols'
import { Request, Response, NextFunction } from 'express'

export const addpterMiddleware = (middleware: Middleware) => {
  return async (request: Request, response: Response, next: NextFunction) => {
    const httpRequest: HttpRequest = {
      headers: request.headers
    }
    const { body, statusCode } = await middleware.handle(httpRequest)
    if (statusCode === 200) {
      Object.assign(request, body)
      next()
    } else {
      response.status(statusCode).json({
        error: body.message
      })
    }
  }
}
