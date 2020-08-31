import 'reflect-metadata'
import { connectionPostgres } from '@infra/db/typeorm/utils/createConnections'
import { User } from './user.entity'
import { getRepository } from 'typeorm'

describe('User entity', function () {
  beforeAll(async () => {
    await connectionPostgres.create()
    console.log('Connected database in mode: ' + process.env.MODE)
  })
  afterAll(async () => {
    await connectionPostgres.clear()
    await connectionPostgres.close()
  })

  it('should be empty', async function () {
    const userRepository = getRepository(User)
    const count = await userRepository.count()
    console.error(count)
    expect(count).toBe(0)
  })
})
