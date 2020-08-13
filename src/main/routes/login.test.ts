import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  const accountCollection = await MongoHelper.getCollection('account')
  await accountCollection.deleteMany({})
})

describe('POST SignUp Route', () => {
  test('Should return 200 as request', async () => {
    await request(app)
      .post('/api/signup')
      .send({
        name: 'Eric Silva',
        email: 'ericsilvaccp@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })
})
