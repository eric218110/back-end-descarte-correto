import request from 'supertest'
import app from '@main/config/app'
import env from '@main/config/env'
import rimraf from 'rimraf'
import { connectionDatabase } from '@infra/db/typeorm/utils/create-connections'
import { Repository } from 'typeorm'
import { EntityAccount } from '@infra/db/typeorm/entities/account.entity'
import { hash } from 'bcrypt'
import { sign } from 'jsonwebtoken'
import { promises, readdirSync } from 'fs'
import { resolve } from 'path'
import { EntityItem } from '@infra/db/typeorm/entities/item.entity'
import { EntityPoint } from '@infra/db/typeorm/entities/point.entity'

let accountTypeOrmRepository: Repository<EntityAccount>
let itemTypeOrmRepository: Repository<EntityItem>
let pointTypeOrmRepository: Repository<EntityPoint>

beforeAll(async () => {
  const connection = await connectionDatabase.create()
  accountTypeOrmRepository = connection.getRepository(EntityAccount)
  itemTypeOrmRepository = connection.getRepository(EntityItem)
  pointTypeOrmRepository = connection.getRepository(EntityPoint)
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
  await connectionDatabase.close()
  readdirSync(`${resolve('temp', 'uploads')}`).map(async file => {
    if (file.match(/-file-test.png/)) {
      await promises.unlink(resolve('temp', 'uploads', file))
    }
  })
  rimraf.sync('__test__')
})

const makeFakePoint = async (): Promise<EntityPoint> => {
  const createFirstItem = itemTypeOrmRepository.create({
    image: 'http://any_image_first_item.com',
    title: `Any First Item Image_${Date.now()}_`,
    activeColor: 'anyActiveColor',
    color: 'AnyColor'
  })
  const createSecondItem = itemTypeOrmRepository.create({
    image: 'http://any_image_Second_item.com',
    title: `Any Second Item Image_${Date.now()}_`,
    activeColor: 'anyActiveColor',
    color: 'AnyColor'
  })
  const saveFirstItem = await itemTypeOrmRepository.save(createFirstItem)
  const saveSecondItem = await itemTypeOrmRepository.save(createSecondItem)

  const createAccount = accountTypeOrmRepository.create({
    name: 'any_name_account',
    email: `any_${Date.now()}_@any.com`,
    password: 'any_password_account',
    accessToken: 'any_accessToken_account',
    role: 'any_role_account'
  })

  const saveAccount = await accountTypeOrmRepository.save(createAccount)

  const createPoint = pointTypeOrmRepository.create({
    account: saveAccount,
    items: [saveFirstItem, saveSecondItem],
    name: 'any_name',
    city: 'any_city',
    state: 'any_state',
    image: 'any_image',
    latitude: '7895',
    longitude: '7865'
  })
  return await pointTypeOrmRepository.save(createPoint)
}

const makeFakePoints = async (): Promise<void> => {
  await makeFakePoint()
  await makeFakePoint()
}

const clearTables = async (): Promise<void> => {
  await itemTypeOrmRepository.query('DELETE FROM item')
  await pointTypeOrmRepository.query('DELETE FROM point')
  await accountTypeOrmRepository.query('DELETE FROM account')
}

describe('POST /api/point Route', () => {
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

describe('GET /api/point/:id', () => {
  test('Should return 400 if params id not type UUID', async () => {
    await request(app()).get('/api/point/not_uuid').expect(400)
  })

  test('Should return 204 no content if point not exist', async () => {
    await request(app())
      .get('/api/point/1011b475-b4ba-41c8-8acd-f0811847369a')
      .expect(204)
  })
  test('Should return 200 with list points if id point exist', async () => {
    const { id } = await makeFakePoint()
    await request(app()).get(`/api/point/${id}`).expect(200)
  })
})

describe('GET /api/points', () => {
  test('Should return 204 if list points is empty', async () => {
    await clearTables()
    await request(app()).get('/api/points').expect(204)
  })

  test('Should return 200 if list points no empty', async () => {
    await clearTables()
    await makeFakePoints()
    await request(app()).get('/api/points').expect(200)
  })
})
