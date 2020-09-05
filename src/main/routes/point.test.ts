import request from 'supertest'
import { connectionDatabase } from '@infra/db/typeorm/utils/create-connections'
import app from '@main/config/app'
import { Repository } from 'typeorm'
import { EntityAccount } from '@infra/db/typeorm/entities/account.entity'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '@main/config/env'
import { promises, readdirSync } from 'fs'
import { resolve } from 'path'
import rimraf from 'rimraf'

let accountTypeOrmRepository: Repository<EntityAccount>

beforeAll(async () => {
  const connection = await connectionDatabase.create()
  accountTypeOrmRepository = connection.getRepository(EntityAccount)
  await promises.mkdir(resolve('__test__', 'file'), { recursive: true })
  await promises.writeFile(
    resolve('__test__', 'file', 'file-test.png'),
    'Is image :)'
  )
  await promises.writeFile(
    resolve('__test__', 'file', 'no-supported-test.txt'),
    'File not suported'
  )
})

afterAll(async () => {
  await connectionDatabase.clear()
  await connectionDatabase.close()
  readdirSync(`${resolve('temp', 'uploads')}`).map(async file => {
    if (file.match(/-file-test.png/)) {
      await promises.unlink(resolve('temp', 'uploads', file))
    }
  })
  rimraf.sync('__test__')
})

beforeEach(async () => {
  await connectionDatabase.clear()
})

describe('POST SignUp Route', () => {
  describe('Auth', () => {
    test('Should return 403 if user not logged', async () => {
      await request(app()).post('/api/point').expect(403)
    })

    test('Should return 403 if user not user', async () => {
      const account = accountTypeOrmRepository.create({
        name: 'any_name',
        email: 'any_email@email.com',
        password: await hash('123', 12),
        role: 'any'
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
  })

  describe('File', () => {
    test('Should return 400 if file not exists in request body', async () => {
      const account = accountTypeOrmRepository.create({
        name: 'User test',
        email: 'test@test.com',
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
  })
})
