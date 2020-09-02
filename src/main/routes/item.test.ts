import request from 'supertest'
import app from '@main/config/app'
import { connectionDatabase } from '@infra/db/typeorm/utils/create-connections'
import { resolve } from 'path'
import { Repository } from 'typeorm'
import { EntityAccount } from '@infra/db/typeorm/entities/account.entity'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '@main/config/env'
import { promises, readdirSync } from 'fs'

let accountTypeOrmRepository: Repository<EntityAccount>

beforeAll(async () => {
  const connection = await connectionDatabase.create()
  accountTypeOrmRepository = connection.getRepository(EntityAccount)
  await promises.mkdir(resolve('__test__', 'file'), { recursive: true })
  await promises.writeFile(resolve('__test__', 'file', 'file-test.png'), ('Is image :)'))
  await promises.writeFile(resolve('__test__', 'file', 'no-supported-test.txt'), ('File not suported'))
})

afterAll(async () => {
  await connectionDatabase.clear()
  await connectionDatabase.close()
  readdirSync(`${resolve('temp', 'uploads')}`)
    .map(async file => {
      if (file.match(/-file-test.png/)) {
        await promises.unlink(resolve('temp', 'uploads', file))
      }
    })
  await promises.unlink(resolve('__test__', 'file', 'file-test.png'))
  await promises.unlink(resolve('__test__', 'file', 'no-supported-test.txt'))
})

describe('Item Routes', () => {
  describe('GET', () => {
    test('Should return 200 as request and in body with list items', async () => {
      await request(app())
        .get('/api/item')
        .expect(200)
    })
  })

  describe('POST', () => {
    test('Should return 403 as request', async () => {
      await request(app())
        .post('/api/item')
        .attach('file', resolve('__test__', 'file', 'file-test.png'))
        .field('title', 'any_title')
        .expect(403)
    })

    test('Should return 400 if file not exists in request body', async () => {
      const account = accountTypeOrmRepository.create({
        name: 'Eric Silva',
        email: 'ericsilvaccp@gmail.com',
        password: await hash('123', 12),
        role: 'admin'
      })
      const result = await accountTypeOrmRepository.save(account)
      const { id } = result
      const accessToken = sign({ id }, env.JWT_SECRET)
      await accountTypeOrmRepository.update({ id }, { accessToken })
      await request(app())
        .post('/api/item')
        .set('x-access-token', accessToken)
        .field('title', 'any_title')
        .expect(400)
    })

    test('Should return 403 if user not admin', async () => {
      const account = accountTypeOrmRepository.create({
        name: 'any_name',
        email: 'any_email@email.com',
        password: await hash('123', 12)
      })
      const result = await accountTypeOrmRepository.save(account)
      const { id } = result
      const accessToken = sign({ id }, env.JWT_SECRET)
      await accountTypeOrmRepository.update({ id }, { accessToken })
      await request(app())
        .post('/api/item')
        .attach('file', resolve('__test__', 'file', 'file-test.png'))
        .set('x-access-token', accessToken)
        .field('title', 'any_title')
        .expect(403)
    })

    test('Should return 204 if accessToken is valid with role admin', async () => {
      const account = await accountTypeOrmRepository.create({
        name: 'any_name',
        email: 'any_email@email.com',
        password: await hash('123', 12),
        role: 'admin'
      })
      const result = await accountTypeOrmRepository.save(account)
      const { id } = result
      const accessToken = sign({ id }, env.JWT_SECRET)
      await accountTypeOrmRepository.update({ id }, { accessToken })
      await request(app())
        .post('/api/item')
        .set('x-access-token', accessToken)
        .field({ title: 'any_title' })
        .field({ file: 'any_file' })
        .attach('file', resolve('__test__', 'file', 'file-test.png'))
        .expect(204)
    })

    test('Should error if Storage retrun error', async () => {
      const account = accountTypeOrmRepository.create({
        name: 'any_name',
        email: 'any_email@email.com',
        password: await hash('123', 12),
        role: 'admin'
      })
      const result = await accountTypeOrmRepository.save(account)
      const { id } = result
      const accessToken = sign({ id }, env.JWT_SECRET)
      await accountTypeOrmRepository.update({ id }, { accessToken })
      await request(app())
        .post('/api/item')
        .set('x-access-token', accessToken)
        .field({ title: 'any_title' })
        .expect(400)
    })

    test('Should return 400 if file not supported', async () => {
      const account = accountTypeOrmRepository.create({
        name: 'any_name',
        email: 'any_email@email.com',
        password: await hash('123', 12),
        role: 'admin'
      })
      const result = await accountTypeOrmRepository.save(account)
      const { id } = result
      const accessToken = sign({ id }, env.JWT_SECRET)
      await accountTypeOrmRepository.update({ id }, { accessToken })
      await request(app())
        .post('/api/item')
        .set('x-access-token', accessToken)
        .field({ title: 'any_title' })
        .attach('file', resolve('__test__', 'file', 'no-supported-test.txt'))
        .expect(400)
    })
  })
})
