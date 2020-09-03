import { Controller } from '@presentation/protocols'
import { LoggerControllerDecorator } from '@main/decorators/logger-decorator'
import { LoggerTypeOrmRepository } from '@infra/db/typeorm/repositories/logger/logger-typeorm-repository'

export const makeLoggerControllerDecorator = (
  controller: Controller
): Controller => {
  const loggerTypeOrmRepository = new LoggerTypeOrmRepository()
  return new LoggerControllerDecorator(controller, loggerTypeOrmRepository)
}
