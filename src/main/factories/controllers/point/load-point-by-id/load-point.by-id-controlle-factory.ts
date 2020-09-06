import { Controller } from '@presentation/protocols'
import { makeLoadPointByIdValidator } from './load-point.by-id-validator-factory'
import { LoadPointByIdController } from '@presentation/controllers/point/load-point-by-id/load-point-by-id-controller'
import { makeLoggerControllerDecorator } from '@main/factories/decorators/logger-controller/logger-controller-decorator-factory'
import { makeDbLoadPointById } from '@main/factories/usecases/point/load-point/db-load-point-by-id-factory'

export const makeLoadPointByIdController = (): Controller => {
  const loadPointByIdController = new LoadPointByIdController(
    makeDbLoadPointById(),
    makeLoadPointByIdValidator()
  )
  return makeLoggerControllerDecorator(loadPointByIdController)
}
