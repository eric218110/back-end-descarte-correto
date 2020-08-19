import { DbAddItemRepository } from '@data/usecases/items/add-items/db-add-item-repository'
import { ItemMongoRepository } from '@infra/db/mongodb/item/item-mongo-repository'
import { AddItem } from '@domain/usecases/add-item'

export const makeDbAddItem = (): AddItem => {
  const loadItemsMongoRepository = new ItemMongoRepository()
  return new DbAddItemRepository(loadItemsMongoRepository)
}
