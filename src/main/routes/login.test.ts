import request from 'supertest'
import { connectionDatabase } from '@infra/db/typeorm/utils/create-connections'
import { Repository } from 'typeorm'
import { EntityAccount } from '@infra/db/typeorm/entities/account.entity'
import app from '@main/config/app'
import { hash } from 'bcrypt'

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
  test('Should return 200 as request', async () => {
    await request(app())
      .post('/api/signup')
      .send({
        name: 'Eric Silva',
        email: 'ericsilvaccp@gmail.com',
        password: '123',
        passwordConfirmation: '123'
      })
      .expect(200)
  })

  describe('POST Login Route', () => {
    test('Should return 200 as request', async () => {
      const account = accountTypeOrmRepository.create({
        name: 'Eric Silva',
        email: 'ericsilvaccp@gmail.com',
        password: await hash('123', 12)
      })
      await accountTypeOrmRepository.save(account)
      await request(app())
        .post('/api/login')
        .send({
          email: 'ericsilvaccp@gmail.com',
          password: '123'
        })
        .expect(200)
    })

    test('Should return 401 as request', async () => {
      await request(app())
        .post('/api/login')
        .send({
          email: 'ericsilvaccp@gmail.com',
          password: '123'
        })
        .expect(401)
    })
  })
})
