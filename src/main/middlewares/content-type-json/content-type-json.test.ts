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

describe('Content type JSON Middleware', () => {
  test('Should return content type default as JSON', async () => {
    app().get('/test_content_type', (req: Request, res: Response) => {
      res.json({ nema: 'er' })
    })
    await request(app())
      .get('/test_content_type')
      .expect('content-type', /json/)
  })
})
