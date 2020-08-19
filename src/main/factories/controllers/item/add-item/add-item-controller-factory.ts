import { Controller } from '@presentation/protocols'
import { AddItemController } from '@presentation/controllers/items/add-item/add-item-controller'
import { makeLoggerControllerDecorator } from '@main/factories/decorators/logger-controller/logger-controller-decorator-factory'
import { makeDbAddItem } from '@main/factories/usecases/item/db-add-item-factory'
import { makeAddItemValidator } from './add-item-validator-factory'

export const makeAddItemController = (): Controller => {
  const addItemController = new AddItemController(makeDbAddItem(), makeAddItemValidator())
  return makeLoggerControllerDecorator(addItemController)
}
