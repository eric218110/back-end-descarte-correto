import request from 'supertest'
import app from '@main/config/app'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { LoadItemsModel } from '@domain/usecases/load-items'

let itemsCollection: Collection<LoadItemsModel>

beforeAll(async () => {
  await MongoHelper.connect(process.env.MONGO_URL)
})

afterAll(async () => {
  await MongoHelper.disconnect()
})

beforeEach(async () => {
  itemsCollection = await MongoHelper.getCollection('items')
  await itemsCollection.deleteMany({})
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
})
