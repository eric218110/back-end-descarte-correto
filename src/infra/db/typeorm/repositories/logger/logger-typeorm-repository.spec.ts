import { connectionDatabase } from '../../utils/create-connections'
import { Repository } from 'typeorm'
import { EntityLogger } from '../../entities/logger.entity'
import { LoggerTypeOrmRepository } from './logger-typeorm-repository'

let loggerTypeOrmRepository: Repository<EntityLogger>

beforeAll(async () => {
  const connection = await connectionDatabase.create()
  loggerTypeOrmRepository = connection.getRepository(EntityLogger)
})

afterAll(async () => {
  await connectionDatabase.clear()
  await connectionDatabase.close()
})

beforeEach(async () => {
  await connectionDatabase.clear()
})

describe('LoggerTypeOrmRepository', () => {
  test('should create an error log on success', async () => {
    const sut = new LoggerTypeOrmRepository()
    await sut.logError('any_error')
    const count = await loggerTypeOrmRepository.count()
    expect(count).toBe(1)
  })
})
