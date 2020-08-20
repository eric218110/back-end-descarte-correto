import request from 'supertest'
import app from '@main/config/app'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { LoadItemsModel } from '@domain/usecases/load-items'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '@main/config/env'

let itemsCollection: Collection<LoadItemsModel>
let accountCollection: Collection

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  itemsCollection = await MongoHelper.getCollection('items')
  accountCollection = await MongoHelper.getCollection('account')
  await itemsCollection.deleteMany({})
  await accountCollection.deleteMany({})
})

describe('GET - Item Route', () => {
  test('Should return 200 as request and in body with list items', async () => {
    await request(app)
      .get('/api/item')
      .expect(200)
  })
})

describe('POST - Item Route', () => {
  test('Should return 403 as request', async () => {
    await request(app)
      .post('/api/item')
      .send({
        title: 'any_title',
        image: 'https://url_any_image.com'
      })
      .expect(403)
  })

  test('Should return 403 if title already exists', async () => {
    await itemsCollection.insertOne({
      title: 'any_title',
      image: 'any_image'
    })
    await request(app)
      .post('/api/item')
      .send({
        title: 'any_title',
        image: 'https://url_any_image.com'
      })
      .expect(403)
  })

  test('Should return 204 if accessToken is valid with role admin', async () => {
    const result = await accountCollection.insertOne({
      name: 'Eric Silva',
      email: 'ericsilvaccp@gmail.com',
      password: await hash('123', 12),
      role: 'admin'
    })
    const id = result.ops[0]._id
    const accessToken = sign({ id }, env.jwt_secret)
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken
      }
    })
    await request(app)
      .post('/api/item')
      .set('x-access-token', accessToken)
      .send({
        title: 'any_title',
        image: 'https://url_any_image.com'
      })
      .expect(204)
  })
})
