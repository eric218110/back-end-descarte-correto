import { Controller } from '@presentation/protocols'
import { LoadItemsController } from '@presentation/controllers/items/load-items/load-items-controller'
import { makeLoggerControllerDecorator } from '@main/factories/decorators/logger-controller/logger-controller-decorator-factory'
import { DbLoadItemsRepository } from '@data/usecases/items/load-items/db-load-items-repository'
import { ItemMongoRepositoty } from '@infra/db/mongodb/item/item-mongo-repository'

export const makeLoadItemController = (): Controller => {
  const loadItemsMongoRepository = new ItemMongoRepositoty()
  const dbLoadItems = new DbLoadItemsRepository(loadItemsMongoRepository)
  const loadItemsController = new LoadItemsController(dbLoadItems)
  return makeLoggerControllerDecorator(loadItemsController)
}
