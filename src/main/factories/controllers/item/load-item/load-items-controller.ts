import { Controller } from '@presentation/protocols'
import { LoadItemsController } from '@presentation/controllers/items/load-items/load-items-controller'
import { makeLoggerControllerDecorator } from '@main/factories/decorators/logger-controller/logger-controller-decorator-factory'
import { DbLoadItemsRepository } from '@data/usecases/items/load-items/db-load-items-repository'
import { ItemTypeOrmRepository } from '@infra/db/typeorm/repositories/item/item-typeorm-repository'

export const makeLoadItemController = (): Controller => {
  const loadItemsTypeOrmRepository = new ItemTypeOrmRepository()
  const dbLoadItems = new DbLoadItemsRepository(loadItemsTypeOrmRepository)
  const loadItemsController = new LoadItemsController(dbLoadItems)
  return makeLoggerControllerDecorator(loadItemsController)
}
