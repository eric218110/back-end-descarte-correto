import request from 'supertest'
import app from '@main/config/app'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'

let accountCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  accountCollection = await MongoHelper.getCollection('account')
  await accountCollection.deleteMany({})
})

describe('Get - Item Route', () => {
  test('Should return 200 as request', async () => {
    await request(app)
      .get('/api/item')
      .send({
        email: 'ericsilvaccp@gmail.com',
        password: '123'
      })
      .expect(200)
  })
})
