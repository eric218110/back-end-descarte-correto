import request from 'supertest'
import app from '@main/config/app'
import { MongoHelper } from '@infra/db/mongodb/helpers/mongo-helper'
import { Collection } from 'mongodb'
import { LoadItemsModel } from '@domain/usecases/item/load-items'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '@main/config/env'
import { resolve } from 'path'

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
      .attach('file', resolve('test', 'file', 'file-test.png'))
      .field('title', 'any_title')
      .expect(403)
  })

  test('Should return 400 if file not exists in request body', async () => {
    const result = await accountCollection.insertOne({
      name: 'Eric Silva',
      email: 'ericsilvaccp@gmail.com',
      password: await hash('123', 12),
      role: 'admin'
    })
    const id = result.ops[0]._id
    const accessToken = sign({ id }, env.JWT_SECRET)
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
      .field('title', 'any_title')
      .expect(400)
  })

  test('Should return 403 if user not admin', async () => {
    const result = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: await hash('123', 12)
    })
    const id = result.ops[0]._id
    const accessToken = sign({ id }, env.JWT_SECRET)
    await accountCollection.updateOne({
      _id: id
    }, {
      $set: {
        accessToken
      }
    })
    await request(app)
      .post('/api/item')
      .attach('file', resolve('test', 'file', 'file-test.png'))
      .set('x-access-token', accessToken)
      .field('title', 'any_title')
      .expect(403)
  })

  test('Should return 204 if accessToken is valid with role admin', async () => {
    const result = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: await hash('123', 12),
      role: 'admin'
    })
    const id = result.ops[0]._id
    const accessToken = sign({ id }, env.JWT_SECRET)
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
      .field({ title: 'any_title' })
      .field({ file: 'any_file' })
      .attach('file', resolve('test', 'file', 'file-test.png'))
      .expect(204)
  })

  test('Should return 400 if file not supported', async () => {
    const result = await accountCollection.insertOne({
      name: 'any_name',
      email: 'any_email@email.com',
      password: await hash('123', 12),
      role: 'admin'
    })
    const id = result.ops[0]._id
    const accessToken = sign({ id }, env.JWT_SECRET)
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
      .field({ title: 'any_title' })
      .attach('file', resolve('test', 'file', 'no-supported-test.txt'))
      .expect(400)
  })
})
