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

describe('Get - Item Route', () => {
  test('Should return 200 as request and in body with list items', async () => {
    await request(app)
      .get('/api/item')
      .expect(200)
  })
})
