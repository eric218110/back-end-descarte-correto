import { Controller } from '@presentation/protocols'
import { AddItemController } from '@presentation/controllers/items/add-item/add-item-controller'
import { makeLoggerControllerDecorator } from '@main/factories/decorators/logger-controller/logger-controller-decorator-factory'
import { makeDbAddItem } from '@main/factories/usecases/item/add-item/db-add-item-factory'
import { makeAddItemValidator } from './add-item-validator-factory'
import { makeLoadItemByTitle } from '@main/factories/usecases/item/load-item-by-title/load-item-by-title'

export const makeAddItemController = (): Controller => {
  const addItemController = new AddItemController(
    makeDbAddItem(),
    makeAddItemValidator(),
    makeLoadItemByTitle()
  )
  return makeLoggerControllerDecorator(addItemController)
}
