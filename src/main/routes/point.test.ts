import request from 'supertest'
import { connectionDatabase } from '@infra/db/typeorm/utils/create-connections'
import app from '@main/config/app'

beforeAll(async () => {
  await connectionDatabase.create()
})

afterAll(async () => {
  await connectionDatabase.clear()
  await connectionDatabase.close()
})

beforeEach(async () => {
  await connectionDatabase.clear()
})

describe('POST SignUp Route', () => {
  test('Should return 403 if user not logged', async () => {
    await request(app()).post('/api/point').expect(403)
  })
})
