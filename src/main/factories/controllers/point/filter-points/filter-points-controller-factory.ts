import { Controller } from '@presentation/protocols'
import { FilterPointController } from '@presentation/controllers/point/filter-point/filter-point-controller'
import { makeFilterPoints } from '@main/factories/usecases/point/filter-point/db-filter-points-factory'
import { makeLoggerControllerDecorator } from '@main/factories/decorators/logger-controller/logger-controller-decorator-factory'

export const makeFilterPointsController = (): Controller => {
  const filterPointsController = new FilterPointController(makeFilterPoints())
  return makeLoggerControllerDecorator(filterPointsController)
}
