import { LoggerErrorRepository } from '@data/protocols/data/logger/logger-error-repository'
import { EntityLogger } from '../../entities/logger.entity'
import { Repository, getRepository } from 'typeorm'

export class LoggerTypeOrmRepository implements LoggerErrorRepository {
  private readonly loggerTypeOrmRepository: Repository<EntityLogger>
  constructor () {
    this.loggerTypeOrmRepository = getRepository(EntityLogger)
  }

  async logError (stack: string): Promise<void> {
    const logger = this.loggerTypeOrmRepository.create({
      stack
    })
    await this.loggerTypeOrmRepository.save(logger)
  }
}
