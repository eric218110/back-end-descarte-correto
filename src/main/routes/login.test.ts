import request from 'supertest'
import app from '../config/app'
import { MongoHelper } from '../../infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { hash } from 'bcrypt'

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

describe('POST Login Route', () => {
  test('Should return 200 as request', async () => {
    await accountCollection.insertOne({
      name: 'Eric Silva',
      email: 'ericsilvaccp@gmail.com',
      password: await hash('123', 12)
    })
    await request(app)
      .post('/api/login')
      .send({
        email: 'ericsilvaccp@gmail.com',
        password: '123'
      })
      .expect(200)
  })
})
