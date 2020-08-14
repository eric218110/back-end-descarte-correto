import { Controller } from '../../../../presentation/protocols'
import { LoggerControllerDecorator } from '../../../decorators/logger-decorator'
import { LoggerMongoRepository } from '../../../../infra/db/mongodb/logger/logger-mongo-repository'

export const makeLoggerControllerDecorator = (controller: Controller): Controller => {
  const loggerMongoRepository = new LoggerMongoRepository()
  return new LoggerControllerDecorator(controller, loggerMongoRepository)
}
