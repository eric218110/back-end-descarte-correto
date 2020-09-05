import { Controller } from '@presentation/protocols'
import { AddPointController } from '@presentation/controllers/point/add-point/add-point-controller'
import { makeLoggerControllerDecorator } from '@main/factories/decorators/logger-controller/logger-controller-decorator-factory'
import { makeDbAddPoint } from '@main/factories/usecases/point/add-point/db-add-point-factory'
import { makeLoadItemByIds } from '@main/factories/usecases/item/load-items-by-ids/load-items-by-ids'
import { makeDbLoadAccountById } from '@main/factories/usecases/account/load-account-by-id/db-load-account-by-id-factory'
import { makeAddPointValidator } from './add-point-validator-factory'

export const makeAddPointController = (): Controller => {
  const addPointController = new AddPointController(
    makeDbAddPoint(),
    makeLoadItemByIds(),
    makeDbLoadAccountById(),
    makeAddPointValidator()
  )
  return makeLoggerControllerDecorator(addPointController)
}
