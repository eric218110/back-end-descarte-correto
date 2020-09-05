import request from 'supertest'
import { connectionDatabase } from '@infra/db/typeorm/utils/create-connections'
import app from '@main/config/app'
import { Repository } from 'typeorm'
import { EntityAccount } from '@infra/db/typeorm/entities/account.entity'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import env from '@main/config/env'

let accountTypeOrmRepository: Repository<EntityAccount>

beforeAll(async () => {
  const connection = await connectionDatabase.create()
  accountTypeOrmRepository = connection.getRepository(EntityAccount)
})

afterAll(async () => {
  await connectionDatabase.clear()
  await connectionDatabase.close()
})

beforeEach(async () => {
  await connectionDatabase.clear()
})

describe('POST SignUp Route', () => {
  describe('Auth', () => {
    test('Should return 403 if user not logged', async () => {
      await request(app()).post('/api/point').expect(403)
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
  })
})
