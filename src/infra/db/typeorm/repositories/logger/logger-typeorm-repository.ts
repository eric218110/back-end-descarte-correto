import {
  LoggerErrorRepository,
  EntityLogger,
  Repository,
  getRepository
} from './logger-typeorm-repository-protocols'

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
