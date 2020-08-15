import request from 'supertest'
import app from '@main/config/app'
import { Request, Response } from 'express'

describe('CORS Middleware', () => {
  test('Should enable as request', async () => {
    app.get('/test_cors', (req: Request, res: Response) => {
      res.send()
    })
    await request(app)
      .get('/test_cors')
      .expect('access-control-allow-origin', '*')
      .expect('access-control-allow-methods', '*')
      .expect('access-control-allow-headers', '*')
  })
})
