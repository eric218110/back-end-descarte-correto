import { Controller } from '@presentation/protocols'
import { LoadPointsController } from '@presentation/controllers/point/load-points/load-points-controller'
import { makeLoggerControllerDecorator } from '@main/factories/decorators/logger-controller/logger-controller-decorator-factory'
import { makeDbLoadPoints } from '@main/factories/usecases/point/load-points/db-load-points-factory'

export const makeLoadPointsController = (): Controller => {
  const loadPointsController = new LoadPointsController(makeDbLoadPoints())
  return makeLoggerControllerDecorator(loadPointsController)
}
