import request from 'supertest'
import app from '@main/config/app'
import { connectionDatabase } from '@infra/db/typeorm/utils/create-connections'
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

describe('Item Routes', () => {
  describe('GET', () => {
    test('Should return 200 as request and in body with list items', async () => {
      await request(app()).get('/api/item').expect(200)
    })
  })

  describe('POST', () => {
    test('Should return 403 as request', async () => {
      await request(app())
        .post('/api/item')
        .send({
          title: 'any_title',
          description: 'any description',
          activeColor: 'any_activeColor',
          color: 'any_color'
        })
        .expect(403)
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
        .set('x-access-token', accessToken)
        .send({
          title: 'any_title',
          description: 'any description',
          activeColor: 'any_activeColor',
          color: 'any_color'
        })
        .expect(403)
    })

    test('Should return 204 if accessToken is valid with role admin', async () => {
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
        .send({
          title: 'any_title',
          description: 'any description',
          activeColor: 'any_activeColor',
          color: 'any_color'
        })
        .expect(204)
    })
  })
})
