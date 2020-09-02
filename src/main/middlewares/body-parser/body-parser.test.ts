import request from 'supertest'
import app from '@main/config/app'
import { Request, Response } from 'express'
import { connectionDatabase } from '@infra/db/typeorm/utils/create-connections'
import { getConnection } from 'typeorm'

beforeAll(async () => {
  await connectionDatabase.create()
})

afterEach(async () => {
  await getConnection().close()
})

describe('Body Parser Middleware', () => {
  test('Should parser body request as JSON', async () => {
    app.post('/test_body_parser', (req: Request, res: Response) => {
      res.send(req.body)
    })
    await request(app)
      .post('/test_body_parser')
      .send({ name: 'Eric Silva' })
      .expect({ name: 'Eric Silva' })
  })
})
